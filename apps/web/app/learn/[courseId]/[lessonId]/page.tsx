'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import EnhancedVideoPlayer from '@/components/learn/EnhancedVideoPlayer';
import LessonNotes from '@/components/learn/LessonNotes';
import LessonResources from '@/components/learn/LessonResources';
import LessonTranscript from '@/components/learn/LessonTranscript';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, ArrowRight, CheckCircle, BookOpen, FileText, MessageSquare, Subtitles } from 'lucide-react';
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
  const videoPlayerRef = useRef<{ seekTo: (time: number) => void }>(null);
  
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [completed, setCompleted] = useState(false);
  const [nextLesson, setNextLesson] = useState<LessonNav | null>(null);
  const [previousLesson, setPreviousLesson] = useState<LessonNav | null>(null);
  const [currentVideoTime, setCurrentVideoTime] = useState(0);
  const [activeTab, setActiveTab] = useState('content');

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

      // Auto-advance to next lesson after 2 seconds
      if (nextLesson) {
        setTimeout(() => {
          router.push(`/learn/${params.courseId}/${nextLesson.id}`);
        }, 2000);
      }
    } catch (error) {
      console.error('Error marking complete:', error);
      toast.error('Failed to mark lesson complete');
    }
  }

  const handleVideoProgress = (progress: number) => {
    // Could be used for analytics or progress tracking
  };

  const handleVideoComplete = () => {
    handleMarkComplete();
  };

  const handleSeekToTimestamp = (time: number) => {
    // This would need to be implemented in the video player
    // For now, we'll just show a toast
    toast('Seeking to ' + Math.floor(time) + 's');
  };

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
            <EnhancedVideoPlayer
              videoUrl={lesson.video_url}
              lessonId={lesson.id}
              courseId={params.courseId}
              onProgress={handleVideoProgress}
              onComplete={handleVideoComplete}
              autoAdvance={!!nextLesson}
            />
          </div>
        )}

        {/* Tabbed Content Area */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="content">
              <BookOpen className="w-4 h-4 mr-2" />
              Lesson Content
            </TabsTrigger>
            <TabsTrigger value="notes">
              <MessageSquare className="w-4 h-4 mr-2" />
              My Notes
            </TabsTrigger>
            <TabsTrigger value="resources">
              <FileText className="w-4 h-4 mr-2" />
              Resources
            </TabsTrigger>
            <TabsTrigger value="transcript">
              <Subtitles className="w-4 h-4 mr-2" />
              Transcript
            </TabsTrigger>
          </TabsList>

          <TabsContent value="content" className="mt-6">
            <Card className="p-6">
              <div
                className="prose max-w-none dark:prose-invert"
                dangerouslySetInnerHTML={{ __html: lesson.content }}
              />
            </Card>
          </TabsContent>

          <TabsContent value="notes" className="mt-6">
            <LessonNotes
              lessonId={lesson.id}
              courseId={params.courseId}
              currentVideoTime={currentVideoTime}
              onSeekTo={handleSeekToTimestamp}
            />
          </TabsContent>

          <TabsContent value="resources" className="mt-6">
            <LessonResources
              lessonId={lesson.id}
              courseId={params.courseId}
            />
          </TabsContent>

          <TabsContent value="transcript" className="mt-6">
            <LessonTranscript
              lessonId={lesson.id}
              lessonTitle={lesson.title}
            />
          </TabsContent>
        </Tabs>

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
