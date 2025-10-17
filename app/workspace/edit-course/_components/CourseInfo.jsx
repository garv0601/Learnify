"use client";

import { Book, Clock, PlayCircle, TrendingUp } from 'lucide-react';
import React, { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import { useRouter } from 'next/navigation';

function CourseInfo({ course, viewCourse }) {
    const courseLayout = course?.courseJson?.course;
    const [loading, setLoading] = useState(false); // For Generate Content
    const [continueLoading, setContinueLoading] = useState(false); // For Continue Learning
    const router = useRouter();

    const GenerateCourseContent = async () => {
        try {
            setLoading(true);
            const result = await axios.post('/api/generate-course-content', {
                courseJson: courseLayout,
                courseTitle: course?.name,
                courseId: course?.cid
            });
            console.log(result.data);
            alert('Course Content Generated Successfully');
            setLoading(false);
            router.replace('/workspace');
        } catch (e) {
            setLoading(false);
            console.error(e);
        }
    }

    const handleContinueLearning = (e) => {
        e.preventDefault(); // prevent default link navigation
        setContinueLoading(true);
        router.push(`/course/${course?.cid}`); // navigate programmatically
    }

    return (
        <div className='relative'>
            {/* Loading overlay for Continue Learning */}
            {continueLoading && (
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

            <div className='md:flex gap-5 justify-between p-5 rounded-2xl shadow-md bg-gray-50'>
                <div className='flex flex-col gap-3'>
                    <h2 className='font-bold text-3xl'>{courseLayout?.name}</h2>
                    <p className='line-clamp-2 text-gray-500'>{courseLayout?.description}</p>

                    <div className='grid grid-cols-1 md:grid-cols-3 gap-5'>
                        <div className='flex items-center gap-5 p-3 rounded-lg shadow-md'>
                            <Clock className='text-blue-500' />
                            <section>
                                <h2 className='font-bold'>Duration</h2>
                                <h2>
                                    {(() => {
                                        if (!courseLayout?.chapters) return "N/A";
                                        const totalMinutes = courseLayout.chapters
                                            .map(ch => {
                                                let hours = 0, minutes = 0;
                                                const h = ch.duration.match(/(\d+)\s*hours?/i);
                                                const m = ch.duration.match(/(\d+)\s*minutes?/i);
                                                if (h) hours = parseInt(h[1]);
                                                if (m) minutes = parseInt(m[1]);
                                                return hours * 60 + minutes;
                                            })
                                            .reduce((a, b) => a + b, 0);
                                        const hours = Math.floor(totalMinutes / 60);
                                        const minutes = totalMinutes % 60;
                                        return minutes === 0 ? `${hours} hours` : `${hours} hours ${minutes} minutes`;
                                    })()}
                                </h2>
                            </section>
                        </div>

                        <div className='flex items-center gap-5 p-3 rounded-lg shadow-md'>
                            <Book className='text-green-500' />
                            <section>
                                <h2 className='font-bold'>Chapters</h2>
                                <h2>{course?.noOfChapters}</h2>
                            </section>
                        </div>

                        <div className='flex items-center gap-5 p-3 rounded-lg shadow-md'>
                            <TrendingUp className='text-red-500' />
                            <section>
                                <h2 className='font-bold'>Difficulty Level</h2>
                                <h2>{course?.level}</h2>
                            </section>
                        </div>
                    </div>

                    {!viewCourse ? (
                        <Button
                            onClick={GenerateCourseContent}
                            disabled={loading}
                            className="w-full transition-all duration-150 ease-in-out active:scale-95 active:shadow-inner"
                        >
                            {loading ? 'Generating...' : 'Generate Content'}
                        </Button>
                    ) : (
                        <Button
                            onClick={handleContinueLearning}
                            className="w-full transition-all duration-150 ease-in-out active:scale-95 active:shadow-inner"
                        >
                            <PlayCircle className='inline mr-2' /> Continue Learning
                        </Button>
                    )}

                </div>

                <Image
                    src={course?.bannerImageUrl || '/placeholder.png'}
                    alt="Course Banner"
                    width={800}
                    height={400}
                    className="w-full mt-5 md:mt-0 object-cover aspect-auto h-[240px] rounded-2xl object-cover"
                />
            </div>
        </div>
    )
}

export default CourseInfo;
