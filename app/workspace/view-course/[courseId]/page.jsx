// "use client";

// import { useParams } from 'next/navigation'
import React from 'react'
import EditCourse from '../../edit-course/[courseId]/page';

function viewCourse() {
  // const {courseId}=useParams();
  return (
    <div>
      <EditCourse viewCourse={true}/>
    </div>
  )
}

export default viewCourse
