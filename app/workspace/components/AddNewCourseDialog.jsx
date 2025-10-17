'use client'

import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Loader2Icon, Sparkle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { desc } from 'drizzle-orm'
import { useState } from 'react'
import axios from 'axios'
import { uuid } from 'drizzle-orm/gel-core'
import { v4 as uuidv4 } from 'uuid';
import { useRouter } from 'next/navigation'  // use next/navigation in App Router

function AddNewCourseDialog({ children }) {

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    noOfChapters: 1,
    includeVideo: false,
    level: '',
    categary: ''
  });


  const router = useRouter();

  const onHandleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    console.log(formData);
  }


  const onGenerate = async () => {
    console.log(formData);
    const courseId = uuidv4();
    try {
      setLoading(true);
      const result = await axios.post('/api/generate-course-layout', {
        ...formData, courseId: courseId
      });
      if(result.data.resp=='Limit Exceed'){
        alert('Please Subscribe to the plan');
        router.push('/workspace/billing');
      }
      setLoading(false);
      router.push('/workspace/edit-course/' + result.data?.courseId);
    }
    catch (e) {
      setLoading(false)
      console.log(e);
    }

  };
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Course Using AI</DialogTitle>
          <DialogDescription asChild>
            <div className="flex flex-col gap-4 mt-3">

              <div className="flex flex-col gap-1">
                <label>Course Name</label>
                <Input placeholder="Course Name" onChange={(event) => onHandleInputChange('name', event?.target.value)} />
              </div>

              <div className="flex flex-col gap-1">
                <label>Course Description (optional)</label>
                <Input placeholder="Course Description" onChange={(event) => onHandleInputChange('description', event?.target.value)} />
              </div>

              <div className="flex flex-col gap-1">
                <label>No. of Chapters</label>
                <Input placeholder="No. of chapters" type='number' onChange={(event) => onHandleInputChange('noOfChapters', event?.target.value)} />
              </div>


              <div className="flex gap-3 items-center">
                <label>Include Video</label>
                <Switch onCheckedChange={() => onHandleInputChange('includeVideo', !formData?.includeVideo)} />
              </div>


              <div className="flex flex-col gap-1">
                <label>Difficulty Level</label>
                <Select onValueChange={(value) => onHandleInputChange('level', value)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Difficulty Level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Beginner">Beginner</SelectItem>
                    <SelectItem value="Moderate">Moderate</SelectItem>
                    <SelectItem value="Advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>


              <div className="flex flex-col gap-1">
                <label>Categary</label>
                <Input placeholder="Categary (Seperated by Comma)" type="text" onChange={(event) => onHandleInputChange('categary', event?.target.value)} />
              </div>

              <div className='mt-4 '>
                <Button
                  className="w-full transition-all duration-150 ease-in-out active:scale-95 active:shadow-inner"
                  onClick={onGenerate} disabled={loading}
                >
                  {loading ? <Loader2Icon className='animate-spin' /> : <Sparkle className="mr-2" />}
                  Generate Course
                </Button>

              </div>

            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}

export default AddNewCourseDialog
