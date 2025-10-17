"use client";

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useUser } from '@clerk/nextjs';
import axios from 'axios';
import { Search } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import CourseCard from '../components/CourseCard';


function Explore() {
  const [courseList, setCourseList] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, isLoaded } = useUser();

  const getCourseList = async () => {
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
      getCourseList();
    }
  }, [isLoaded, user]);

  return (
    <div>
      <h2 className="font-bold text-3xl mb-6">Explore More Courses</h2>
      
      <div className="flex gap-5 max-w-md mb-5">
        <Input placeholder="Search" />
        <Button>
          <Search className="mr-2" /> Search
        </Button>
      </div>

      {loading ? (
        <p>Loading courses...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-[repeat(auto-fit,minmax(380px,1fr))] gap-5">
          {courseList.map((course, index) => (
            <CourseCard course={course} key={index} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Explore;
