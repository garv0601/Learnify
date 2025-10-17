"use client"

import React, { useState } from 'react'
import Image from 'next/image'
import { Book, PlayCircle, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import toast from 'react-hot-toast'

function CourseCard({ course }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const courseJson = course?.courseJson?.course

  const safeToast = (fn, msg) => {
    try {
      fn(msg)
    } catch (err) {
      alert(msg)
    }
  }

  const onEnrollCourse = async () => {
  try {
    setLoading(true)
    const { data } = await axios.post('/api/enroll-course', {
      courseId: course?.cid,
    })

    // Some APIs return string, some return object
    const message =
      typeof data === 'string'
        ? data
        : data?.resp || data?.message || 'Enrolled successfully!'

    // Show dynamic message
    if (message.toLowerCase().includes('already')) {
      toast.error(message)
      alert(message)
    } else {
      toast.success(message)
      alert(message)
    }

    console.log('Server response:', data)
  } catch (e) {
    console.error('Enrollment error:', e)
    toast.error('Server error while enrolling')
    alert('Server error while enrolling')
  } finally {
    setLoading(false)
  }
}

  const handleGenerateCourse = async () => {
    setLoading(true)
    const nextUrl = '/workspace/edit-course/' + course?.cid

    const link = document.createElement('link')
    link.rel = 'prefetch'
    link.href = nextUrl
    document.head.appendChild(link)

    await new Promise((resolve) => {
      const img = new window.Image()
      img.src = course?.bannerImageUrl || '/default-course.jpg'
      img.onload = resolve
      img.onerror = resolve
    })

    router.push(nextUrl)
    setLoading(false)
  }

  return (
    <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-md hover:shadow-xl transform transition-all duration-300 hover:scale-105 bg-white flex flex-col w-full md:w-[360px] lg:w-[380px]">
      <div className="relative w-full h-[220px]">
        <Image
          src={course?.bannerImageUrl || '/default-course.jpg'}
          alt={courseJson?.name || 'Course'}
          fill
          className="object-cover"
        />
      </div>

      <div className="p-3 flex flex-col justify-between flex-1">
        <div className="mb-1">
          <h2 className="text-xl font-semibold mb-2 line-clamp-1 text-gray-900">
            {courseJson?.name || 'Untitled Course'}
          </h2>
          <p className="text-sm text-gray-600 line-clamp-3">
            {courseJson?.description || 'No description provided yet.'}
          </p>
        </div>

        <div className="flex items-center justify-between mt-5">
          <h3 className="flex items-center gap-2 text-gray-700 text-sm flex-shrink-0">
            <Book className="w-4 h-4 text-blue-500" />
            {courseJson?.noOfChapters || 0} Chapters
          </h3>

          <div className="flex-shrink-0">
            {course?.courseContent?.length ? (
              <Button
                onClick={onEnrollCourse}
                disabled={loading}
                className="flex items-center gap-2 text-sm font-medium 
                           transition-transform duration-200 
                           hover:scale-105 hover:shadow-lg 
                           active:scale-95 active:shadow-sm 
                           bg-gradient-to-r from-blue-500 to-indigo-500 text-white"
              >
                {loading ? (
                  <span className="animate-pulse">Enrolling...</span>
                ) : (
                  <>
                    <PlayCircle className="w-4 h-4" />
                    Enroll Course
                  </>
                )}
              </Button>
            ) : (
              <Button
                onClick={handleGenerateCourse}
                disabled={loading}
                className={`flex items-center gap-2 text-sm font-medium 
                            transition-transform duration-200 
                            hover:scale-105 hover:shadow-lg 
                            active:scale-95 active:shadow-sm 
                            border border-gray-300 text-gray-700 bg-white 
                            ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                <Settings className="w-4 h-4" />
                {loading ? 'Generating...' : 'Generate Course'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CourseCard
