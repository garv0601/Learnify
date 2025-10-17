import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { eq } from 'drizzle-orm';
import axios from 'axios';
import { db } from '@/config/db';
import { coursesTable } from '@/config/schema';

const PROMPT = `Depends on Chapter name and Topic Generate content for each topic in HTML
and give response in JSON format.
Schema:{
chapterName: <string>,
topics: [
  {
    topic: <string>,
    content: <string>
  }
]
}
: User Input:`;

// -----------------------------
// MAIN FUNCTION
// -----------------------------
export async function POST(req) {
  try {
    const { courseJson, courseTitle, courseId } = await req.json();

    if (!courseJson?.chapters?.length) {
      return NextResponse.json({ error: "No chapters found" }, { status: 400 });
    }

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    const model = 'gemini-2.5-flash';

    // Generate content for each chapter
    const promises = courseJson.chapters.map(async (chapter) => {
      const contents = [
        {
          role: 'user',
          parts: [
            {
              text: PROMPT + JSON.stringify(chapter),
            },
          ],
        },
      ];

      const response = await ai.models.generateContent({
        model,
        contents,
      });

      const RawResp = response.candidates[0]?.content?.parts?.[0]?.text || "";

      // Extract JSON safely
      const match = RawResp.match(/\{[\s\S]*\}/);
      if (!match) {
        console.error("Invalid JSON response from AI:", RawResp);
        throw new Error("Invalid JSON from AI");
      }

      const JSONResp = JSON.parse(match[0]);

      // Get related YouTube videos for the chapter
      const youtubeData = await getYoutubeVideo(chapter?.chapterName);

      return {
        ...JSONResp,
        youtubeData,
      };
    });

    const CourseContent = await Promise.all(promises);

    // Save to DB
    await db
      .update(coursesTable)
      .set({
        courseContent: CourseContent,
      })
      .where(eq(coursesTable.cid, courseId));

    return NextResponse.json({
      courseName: courseTitle,
      CourseContent,
    });
  } catch (err) {
    console.error("Error generating course content:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// -----------------------------
// HELPER FUNCTION: YouTube
// -----------------------------
const YOUTUBE_BASE_URL = 'https://www.googleapis.com/youtube/v3/search';

const getYoutubeVideo = async (topic) => {
  try {
    const params = {
      part: 'snippet',
      q: topic,
      maxResults: 4,
      type: 'video',
      key: process.env.YOUTUBE_API_KEY,
    };

    const resp = await axios.get(YOUTUBE_BASE_URL, { params });
    const youtubeVideoListResp = resp.data.items;

    const youtubeVideoList = youtubeVideoListResp.map((item) => ({
      videoId: item.id?.videoId,
      title: item.snippet?.title,
      // description: item.snippet?.description,
      // thumbnail: item.snippet?.thumbnails?.high?.url,
    }));

    console.log("youtubeVideoList", youtubeVideoList);
    return youtubeVideoList;
  } catch (error) {
    console.error("YouTube API error:", error);
    return [];
  }
};
