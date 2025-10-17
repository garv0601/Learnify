import { db } from "@/config/db";
import { coursesTable, enrollCourseTable } from "@/config/schema";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { and, desc, eq } from "drizzle-orm";


export async function POST(req) {
    const { courseId } = await req.json();

    const user = await currentUser();
    //if course already enrolled 
    const enrollCourses = await db.select().from(enrollCourseTable).where(and(eq(enrollCourseTable.userEmail, user?.primaryEmailAddress.emailAddress), eq(enrollCourseTable.cid, courseId)))

    if (enrollCourses?.length == 0) {
        const result = await db.insert(enrollCourseTable).values({
            cid: courseId,
            userEmail: user.primaryEmailAddress?.emailAddress
        }).returning(enrollCourseTable)

        return NextResponse.json(result);
    }

    return NextResponse.json({ 'resp': 'Already Enrolled' })
}


export async function GET(req) {

    const user = await currentUser();

    const { searchParams } = new URL(req.url);
    const courseId = searchParams?.get('courseId');

    if (courseId) {
        const result = await db.select().from(coursesTable).innerJoin(enrollCourseTable, eq(coursesTable.cid, enrollCourseTable.cid))
            .where(and(eq(enrollCourseTable.userEmail, user?.primaryEmailAddress.emailAddress), eq(enrollCourseTable.cid, courseId)));

        return NextResponse.json(result[0]);

    }
    else {
        const result = await db.select().from(coursesTable).innerJoin(enrollCourseTable, eq(coursesTable.cid, enrollCourseTable.cid))
            .where(eq(enrollCourseTable.userEmail, user?.primaryEmailAddress.emailAddress))
            .orderBy(desc(enrollCourseTable.id));

        return NextResponse.json(result);
    }

}





export async function PUT(req) {
  const { courseId, chapter, topic } = await req.json(); // single subtopic
  const user = await currentUser();

  // Get current completedChapters
  const enrollData = await db
    .select()
    .from(enrollCourseTable)
    .where(
      and(
        eq(enrollCourseTable.cid, courseId),
        eq(enrollCourseTable.userEmail, user?.primaryEmailAddress?.emailAddress)
      )
    );

  if (!enrollData?.length) return NextResponse.json({ error: "Enrollment not found" }, { status: 404 });

  const currentCompleted = enrollData[0].completedChapters || [];

  // Check if this subtopic is already completed
  const existsIndex = currentCompleted.findIndex(
    (c) => c.chapter === chapter && c.topic === topic
  );

  let updatedCompleted;
  if (existsIndex !== -1) {
    // Remove (mark as incomplete)
    updatedCompleted = currentCompleted.filter(
      (_, i) => i !== existsIndex
    );
  } else {
    // Add (mark as complete)
    updatedCompleted = [...currentCompleted, { chapter, topic }];
  }

  const result = await db
    .update(enrollCourseTable)
    .set({ completedChapters: updatedCompleted })
    .where(
      and(
        eq(enrollCourseTable.cid, courseId),
        eq(enrollCourseTable.userEmail, user?.primaryEmailAddress?.emailAddress)
      )
    )
    .returning(enrollCourseTable);

  return NextResponse.json(result[0]);
}
