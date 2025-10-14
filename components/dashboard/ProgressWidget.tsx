'use client';

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { BookOpen, Clock, Award } from 'lucide-react';
import Link from 'next/link';

interface CourseProgress {
  course: any;
  overall: number;
  completed: number;
  total: number;
}

export default function ProgressWidget() {
  const [courses, setCourses] = useState<CourseProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClientComponentClient();

  useEffect(() => {
    loadProgress();
  }, []);

  const loadProgress = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Get enrolled courses
    const { data: enrollments } = await supabase
      .from('enrollments')
      .select('*, courses(*)')
      .eq('user_id', user.id)
      .eq('enrollment_status', 'active');

    if (!enrollments) {
      setLoading(false);
      return;
    }

    // Load progress for each course
    const progressData = await Promise.all(
      enrollments.map(async (enrollment) => {
        const response = await fetch(`/api/progress?courseId=${enrollment.course_id}`);
        const data = await response.json();
        return {
          course: enrollment.courses,
          ...data
        };
      })
    );

    setCourses(progressData);
    setLoading(false);
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Your Progress</h2>
      
      {courses.map(({ course, overall, completed, total }) => (
        <Card key={course.id} className="p-6 hover:shadow-lg transition-shadow">
          <Link href={`/learn/${course.id}`}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold mb-1">{course.title}</h3>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <BookOpen className="w-4 h-4" />
                    {completed} / {total} lessons
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {course.duration_hours}h
                  </span>
                  <span className="flex items-center gap-1">
                    <Award className="w-4 h-4" />
                    {course.ce_hours} CE
                  </span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-[#3B82F6]">
                  {Math.round(overall)}%
                </p>
                <p className="text-xs text-gray-600">Complete</p>
              </div>
            </div>
            
            <Progress value={overall} className="h-2" />
            
            {overall === 100 && (
              <div className="mt-4 p-3 bg-[#10B981] bg-opacity-10 rounded-lg">
                <p className="text-sm text-[#10B981] font-semibold">
                  ✓ Course Complete! Claim your certificate
                </p>
              </div>
            )}
          </Link>
        </Card>
      ))}

      {courses.length === 0 && (
        <Card className="p-8 text-center">
          <p className="text-gray-600 mb-4">You haven't enrolled in any courses yet.</p>
          <Link href="/courses">
            <button className="bg-[#3B82F6] text-white px-6 py-2 rounded-lg">
              Browse Courses
            </button>
          </Link>
        </Card>
      )}
    </div>
  );
}
