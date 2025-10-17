"use client"
import React from 'react'
import WelcomeBanner from './components/WelcomeBanner' 
import CourseList from './components/CourseList'
import EnrollCourseList from './components/EnrollCourseList'

function Workspace() {
  return (
    <div>
      <WelcomeBanner />
      <EnrollCourseList/>
      <CourseList />
      
    </div>
  )
}

export default Workspace
