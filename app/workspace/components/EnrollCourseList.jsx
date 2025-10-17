"use client"

import axios from 'axios'
import React, { useEffect, useState } from 'react'
import EnrolledCourseCard from './EnrolledCourseCard'

function EnrollCourseList() {
  const [enrolledCourseList, setEnrolledCourseList] = useState([])

  useEffect(() => {
    GetEnrolledCourse()
  }, [])

  const GetEnrolledCourse = async () => {
    const result = await axios.get('/api/enroll-course')
    console.log(result.data)
    setEnrolledCourseList(result.data)
  }

  return (
    enrolledCourseList?.length > 0 && (
      <div className="mt-6">
        <h2 className="font-bold text-3xl mb-6">Continue Learning Your Courses</h2>

        {/* Responsive Flex Layout */}
        <div className="flex flex-wrap gap-6 justify-center md:justify-start">
          {enrolledCourseList?.map((course, index) => (
            <EnrolledCourseCard
              course={course?.courses}
              enrollCourse={course?.enrollCourse}
              key={index}
            />
          ))}
        </div>
      </div>
    )
  )
}

export default EnrollCourseList
