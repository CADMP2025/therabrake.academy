'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { BookOpen, Clock, Award } from 'lucide-react';

interface CourseProgress {
  course_id: string;
  course_title: string;
  completed_lessons: number;
  total_lessons: number;
  progress_percentage: number;
}

export default function ProgressWidget() {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState<CourseProgress[]>([]);
  const supabase = createClient();

  useEffect(() => {
    loadProgress();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadProgress() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setLoading(false);
        return;
      }

      // Get all enrollments with progress
      const { data: enrollments, error } = await supabase
        .from('enrollments')
        .select(`
          course_id,
          courses (
            id,
            title
          )
        `)
        .eq('user_id', user.id)
        .eq('status', 'active');

      if (error) throw error;

      if (!enrollments || enrollments.length === 0) {
        setProgress([]);
        setLoading(false);
        return;
      }

      // Get progress for each course
      const progressData = await Promise.all(
        enrollments.map(async (enrollment) => {
          const courseId = enrollment.course_id;

          // Get total lessons
          const { count: totalLessons } = await supabase
            .from('lessons')
            .select('*', { count: 'exact', head: true })
            .eq('course_id', courseId);

          // Get completed lessons
          const { count: completedLessons } = await supabase
            .from('lesson_progress')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user.id)
            .eq('course_id', courseId)
            .eq('completed', true);

          const total = totalLessons || 0;
          const completed = completedLessons || 0;
          const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

          return {
            course_id: courseId,
            course_title: (enrollment.courses as any)?.title || 'Untitled Course',
            completed_lessons: completed,
            total_lessons: total,
            progress_percentage: percentage,
          };
        })
      );

      setProgress(progressData);
    } catch (error) {
      console.error('Error loading progress:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </Card>
    );
  }

  if (progress.length === 0) {
    return (
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <BookOpen className="w-5 h-5 mr-2 text-blue-600" />
          Your Progress
        </h3>
        <p className="text-gray-600">
          No active courses yet. Enroll in a course to start learning!
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <BookOpen className="w-5 h-5 mr-2 text-blue-600" />
        Your Progress
      </h3>

      <div className="space-y-4">
        {progress.map((course) => (
          <div key={course.course_id} className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-gray-900">{course.course_title}</h4>
              <span className="text-sm text-gray-600">
                {course.completed_lessons}/{course.total_lessons} lessons
              </span>
            </div>
            <Progress value={course.progress_percentage} className="h-2" />
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">{course.progress_percentage}% complete</span>
              {course.progress_percentage === 100 && (
                <span className="flex items-center text-green-600">
                  <Award className="w-4 h-4 mr-1" />
                  Completed
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
