"use client";

import AppHeader from '@/app/workspace/components/AppHeader';
import React, { useEffect, useState } from 'react';
import ChapterListSidebar from '../_components/ChapterListSidebar';
import ChapterContent from '../_components/ChapterContent';
import { useParams } from 'next/navigation';
import axios from 'axios';

function Course() {
  const { courseId } = useParams();
  const [courseInfo, setCourseInfo] = useState(null);
  const [selectedTopicIndex, setSelectedTopicIndex] = useState(0);

  useEffect(() => {
    GetEnrolledCourseById();
  }, []);

  const GetEnrolledCourseById = async () => {
    try {
      const result = await axios.get('/api/enroll-course?courseId=' + courseId);
      setCourseInfo(result.data);
      setSelectedTopicIndex(0);
    } catch (error) {
      console.error('Error fetching course info:', error);
    }
  };

  if (!courseInfo) {
    return <div className="p-10">Loading course data...</div>;
  }

  return (
    <div>
      <AppHeader hideSidebar={true} />
      <div className="flex gap-10">
        <ChapterListSidebar
          courseInfo={courseInfo}
          selectedTopicIndex={selectedTopicIndex}
          setSelectedTopicIndex={setSelectedTopicIndex}
        />
        <ChapterContent
          courseInfo={courseInfo}
          selectedTopicIndex={selectedTopicIndex}
          refreshCourse={GetEnrolledCourseById} // ✅ added this
        />
      </div>


     
    </div>
  );
}

export default Course;
