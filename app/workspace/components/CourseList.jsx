// "use client"

// import React, { useEffect } from 'react'
// import { useState } from 'react'
// import Image from 'next/image'
// import { Button } from '@/components/ui/button'
// import AddNewCourseDialog from './AddNewCourseDialog'
// import axios from 'axios'
// import { useUser } from '@clerk/nextjs'
// import { index } from 'drizzle-orm/gel-core'
// import CourseCard from './CourseCard'

// function CourseList() {
//   const [courseList, setCourseList] = useState([]);

//   const { user } = useUser();
//   useEffect(() => {
//     user && GetCourseList();
//   }, [user]);
//   const GetCourseList = async () => {
//     const result = await axios.get('/api/courses');
//     console.log(result.data);
//     setCourseList(result.data);
//   }

//   return (
//     <div className='mt-10 '>
//       <h2 className='font-bold text-3xl'>Course List</h2>
//       {courseList?.length == 0 ?
//         <div className='flex p-7 items-center justify-center flex-col border rounded-2xl mt-3 bg-secondary '>
//           <Image src={'/online-education.png'} alt='Education' height={120} width={120} />
//           <h2 className='my-2 text-lg font-bold'>Look like you haven't created any courses yet</h2>

//           <AddNewCourseDialog>
//             <Button>+ Create your first course</Button>
//           </AddNewCourseDialog>

//         </div> :
//         <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-5'>{courseList?.map((course,index)=>(
//           <CourseCard course={course} key={index}/>
//         ))}</div>}
//     </div>
//   )
// }

// export default CourseList



"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import AddNewCourseDialog from './AddNewCourseDialog';
import axios from 'axios';
import { useUser } from '@clerk/nextjs';
import CourseCard from './CourseCard';

function CourseList() {
  const [courseList, setCourseList] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, isLoaded } = useUser();

  const GetCourseList = async () => {
    try {
      setLoading(true);
      const result = await axios.get('/api/courses');
      setCourseList(result.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoaded && user) {
      GetCourseList();
    }
  }, [isLoaded, user]);

  return (
    <div className="mt-10">
      <h2 className="font-bold text-3xl">Course List</h2>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-5 mt-5">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-60 rounded-2xl bg-secondary animate-pulse flex flex-col justify-between p-4 shadow-md"
            >
              <div className="h-32 bg-gray-300 rounded-lg"></div>
              <div className="mt-4 space-y-2">
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                <div className="h-4 bg-gray-300 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      ) : courseList.length === 0 ? (
        <div className="flex p-7 items-center justify-center flex-col border rounded-2xl mt-3 bg-secondary">
          <Image src="/online-education.png" alt="Education" height={120} width={120} />
          <h2 className="my-2 text-lg font-bold">
            Looks like you haven't created any courses yet
          </h2>
          <AddNewCourseDialog>
            <Button>+ Create your first course</Button>
          </AddNewCourseDialog>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-[repeat(auto-fit,minmax(380px,1fr))] gap-5 mt-5">
  {courseList.map((course, index) => (
    <CourseCard course={course} key={index} />
  ))}
</div>


      )}
    </div>
  );
}

export default CourseList;
