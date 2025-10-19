'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import VideoPlayer from '@/components/learn/VideoPlayer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

interface Lesson {
  id: string;
  title: string;
  content: string;
  video_url?: string;
  duration_minutes?: number;
  order_index: number;
}

interface LessonNav {
  id: string;
  title: string;
  order_index: number;
}

interface Course {
  id: string;
  title: string;
  description: string;
}

export default function LessonPage({
  params,
}: {
  params: { courseId: string; lessonId: string };
}) {
  const router = useRouter();
  const supabase = createClient();
  
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [completed, setCompleted] = useState(false);
  const [nextLesson, setNextLesson] = useState<LessonNav | null>(null);
  const [previousLesson, setPreviousLesson] = useState<LessonNav | null>(null);

  useEffect(() => {
    loadLessonData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.lessonId]);

  async function loadLessonData() {
    try {
      // Load lesson
      const { data: lessonData, error: lessonError } = await supabase
        .from('lessons')
        .select('*')
        .eq('id', params.lessonId)
        .single();

      if (lessonError) throw lessonError;
      setLesson(lessonData);

      // Load course
      const { data: courseData, error: courseError } = await supabase
        .from('courses')
        .select('id, title, description')
        .eq('id', params.courseId)
        .single();

      if (courseError) throw courseError;
      setCourse(courseData);

      // Load progress
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: progress } = await supabase
          .from('lesson_progress')
          .select('completed')
          .eq('user_id', user.id)
          .eq('lesson_id', params.lessonId)
          .single();

        if (progress) {
          setCompleted(progress.completed);
        }

        // Load next/previous lessons (only need id, title, order_index for navigation)
        const { data: allLessons } = await supabase
          .from('lessons')
          .select('id, title, order_index')
          .eq('course_id', params.courseId)
          .order('order_index', { ascending: true });

        if (allLessons) {
          const currentIndex = allLessons.findIndex((l) => l.id === params.lessonId);
          if (currentIndex > 0) {
            setPreviousLesson(allLessons[currentIndex - 1]);
          }
          if (currentIndex < allLessons.length - 1) {
            setNextLesson(allLessons[currentIndex + 1]);
          }
        }
      }
    } catch (error) {
      console.error('Error loading lesson:', error);
      toast.error('Failed to load lesson');
    } finally {
      setLoading(false);
    }
  }

  async function handleMarkComplete() {
    try {
      const response = await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lessonId: params.lessonId,
          courseId: params.courseId,
          completed: true,
        }),
      });

      if (!response.ok) throw new Error('Failed to mark complete');

      setCompleted(true);
      toast.success('Lesson marked as complete!');

      // Auto-advance to next lesson
      if (nextLesson) {
        setTimeout(() => {
          router.push(`/learn/${params.courseId}/${nextLesson.id}`);
        }, 1500);
      }
    } catch (error) {
      console.error('Error marking complete:', error);
      toast.error('Failed to mark lesson complete');
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!lesson || !course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Lesson Not Found</h1>
          <Button onClick={() => router.push(`/courses/${params.courseId}`)}>
            Back to Course
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => router.push(`/courses/${params.courseId}`)}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to {course.title}
          </button>
          <h1 className="text-3xl font-bold text-gray-900">{lesson.title}</h1>
        </div>

        {/* Video Player */}
        {lesson.video_url && (
          <div className="mb-8">
            <VideoPlayer
              videoUrl={lesson.video_url}
              lessonId={lesson.id}
              courseId={params.courseId}
            />
          </div>
        )}

        {/* Content */}
        <Card className="p-6 mb-8">
          <div
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: lesson.content }}
          />
        </Card>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <div>
            {previousLesson && (
              <Button
                variant="outline"
                onClick={() => router.push(`/learn/${params.courseId}/${previousLesson.id}`)}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous Lesson
              </Button>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {!completed && (
              <Button onClick={handleMarkComplete}>
                <CheckCircle className="w-4 h-4 mr-2" />
                Mark as Complete
              </Button>
            )}

            {completed && nextLesson && (
              <Button
                onClick={() => router.push(`/learn/${params.courseId}/${nextLesson.id}`)}
              >
                Next Lesson
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
