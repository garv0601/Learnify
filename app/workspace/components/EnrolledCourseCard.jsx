"use client";

import { Button } from '@/components/ui/button';
import { PlayCircle } from 'lucide-react';
import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import { Progress } from "@/components/ui/progress";
import { useRouter } from 'next/navigation';

function EnrolledCourseCard({ course, enrollCourse }) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const courseJson = course?.courseJson?.course;

  const calculatePerProgress = () => {
    const totalTopics = course?.courseContent?.reduce((sum, chapter) => {
      return sum + (chapter?.topics?.length || 0);
    }, 0) || 1;

    const completedTopics = enrollCourse?.completedChapters?.length || 0;

    return (completedTopics / totalTopics) * 100;
  };

  useEffect(() => {
    // Listen to Next.js navigation events
    const handleStart = () => setIsLoading(true);
    const handleComplete = () => setIsLoading(false);

    // next/navigation doesn’t expose events directly, so we use a workaround with window events
    // This works if you wrap all navigation in router.push() like below

    return () => {
      // cleanup if needed
    };
  }, []);

  const handleContinueLearning = () => {
    setIsLoading(true);
    router.push(`/workspace/view-course/${course?.cid}`);
  };

  return (
    <div className="relative">
      {/* Loading overlay */}
      {isLoading && (
        <div
          role="status"
          aria-live="polite"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
        >
          <div className="flex flex-col items-center gap-4 bg-white/90 dark:bg-gray-900/90 p-6 rounded-xl shadow-lg">
            <svg
              className="animate-spin h-12 w-12 text-indigo-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              ></path>
            </svg>
            <p className="text-gray-800">Fetching your course...</p>
          </div>
        </div>
      )}

      <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-md hover:shadow-xl transform transition-all duration-300 hover:scale-105 bg-white flex flex-col w-full md:w-[360px] lg:w-[380px] mt-3">
        <div className="relative w-full h-48 md:h-52 lg:h-56">
          <Image
            src={course?.bannerImageUrl || '/default-course.jpg'}
            alt={courseJson?.name || 'Course'}
            fill
            className="object-cover"
          />
        </div>

        <div className="p-4 flex flex-col justify-between flex-1">
          <h2 className="text-xl font-semibold mb-2 line-clamp-1 text-gray-900">
            {courseJson?.name || 'Untitled Course'}
          </h2>
          <p className="text-sm text-gray-600 line-clamp-3 mb-3">
            {courseJson?.description || 'No description provided yet.'}
          </p>

          <div>
            <h2 className='flex justify-between text-sm text-primary'>
              Progress <span>{Math.round(calculatePerProgress())}%</span>
            </h2>

            <Progress value={calculatePerProgress()} />
            <Button
              className="w-full mt-3 transform transition-transform duration-150 active:scale-95"
              onClick={handleContinueLearning}
            >
              <PlayCircle className="inline mr-2" /> Continue Learning
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EnrolledCourseCard;
