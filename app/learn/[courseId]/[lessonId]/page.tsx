'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import VideoPlayer from '@/components/learn/VideoPlayer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, ChevronRight, CheckCircle2, FileText, Download } from 'lucide-react';
import Link from 'next/link';

export default function LessonPage({ 
  params 
}: { 
  params: { courseId: string; lessonId: string } 
}) {
  const [lesson, setLesson] = useState<any>(null);
  const [course, setCourse] = useState<any>(null);
  const [modules, setModules] = useState<any[]>([]);
  const [progress, setProgress] = useState(0);
  const [resources, setResources] = useState<any[]>([]);
  const router = useRouter();
  const supabase = createClientComponentClient();

  useEffect(() => {
    loadLessonData();
  }, [params.lessonId]);

  const loadLessonData = async () => {
    // Load lesson
    const { data: lessonData } = await supabase
      .from('lessons')
      .select('*')
      .eq('id', params.lessonId)
      .single();

    if (lessonData) {
      setLesson(lessonData);
    }

    // Load course with modules and lessons
    const { data: courseData } = await supabase
      .from('courses')
      .select('*, modules(*, lessons(*))')
      .eq('id', params.courseId)
      .single();

    if (courseData) {
      setCourse(courseData);
      setModules(courseData.modules.sort((a: any, b: any) => a.order_index - b.order_index));
    }

    // Load resources
    const { data: resourceData } = await supabase
      .from('resources')
      .select('*')
      .eq('lesson_id', params.lessonId);

    if (resourceData) {
      setResources(resourceData);
    }

    // Load progress
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: progressData } = await supabase
        .from('lesson_progress')
        .select('progress_percentage')
        .eq('user_id', user.id)
        .eq('lesson_id', params.lessonId)
        .single();

      if (progressData) {
        setProgress(progressData.progress_percentage);
      }
    }
  };

  const findAdjacentLessons = () => {
    let prevLesson = null;
    let nextLesson = null;
    let found = false;

    for (const module of modules) {
      const sortedLessons = module.lessons.sort((a: any, b: any) => a.order_index - b.order_index);
      
      for (let i = 0; i < sortedLessons.length; i++) {
        if (sortedLessons[i].id === params.lessonId) {
          found = true;
          if (i > 0) {
            prevLesson = sortedLessons[i - 1];
          } else {
            const prevModule = modules.find(m => m.order_index === module.order_index - 1);
            if (prevModule && prevModule.lessons.length > 0) {
              const sortedPrevLessons = prevModule.lessons.sort((a: any, b: any) => a.order_index - b.order_index);
              prevLesson = sortedPrevLessons[sortedPrevLessons.length - 1];
            }
          }
          
          if (i < sortedLessons.length - 1) {
            nextLesson = sortedLessons[i + 1];
          } else {
            const nextModule = modules.find(m => m.order_index === module.order_index + 1);
            if (nextModule && nextModule.lessons.length > 0) {
              const sortedNextLessons = nextModule.lessons.sort((a: any, b: any) => a.order_index - b.order_index);
              nextLesson = sortedNextLessons[0];
            }
          }
          break;
        }
      }
      if (found) break;
    }

    return { prevLesson, nextLesson };
  };

  const handleProgress = (percentage: number) => {
    setProgress(percentage);
  };

  const handleComplete = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase
      .from('lesson_progress')
      .upsert({
        user_id: user.id,
        lesson_id: params.lessonId,
        progress_percentage: 100,
        completed: true,
        completed_at: new Date().toISOString()
      });

    setProgress(100);
  };

  if (!lesson || !course) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3B82F6]" />
      </div>
    );
  }

  const { prevLesson, nextLesson } = findAdjacentLessons();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Card className="p-6 mb-6">
              <div className="mb-4">
                <Link 
                  href={`/courses/${params.courseId}`}
                  className="text-[#3B82F6] hover:underline mb-2 inline-block"
                >
                  ← Back to Course
                </Link>
                <h1 className="text-3xl font-bold mb-2">{lesson.title}</h1>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span>{lesson.duration_minutes} minutes</span>
                  <span>•</span>
                  <div className="flex items-center gap-2">
                    <Progress value={progress} className="w-32 h-2" />
                    <span>{Math.round(progress)}%</span>
                  </div>
                </div>
              </div>

              {/* Video Player */}
              {lesson.video_url && (
                <VideoPlayer
                  videoUrl={lesson.video_url}
                  lessonId={lesson.id}
                  onProgress={handleProgress}
                  onComplete={handleComplete}
                />
              )}

              {/* Text Content */}
              {lesson.content && (
                <div 
                  className="prose max-w-none mt-6"
                  dangerouslySetInnerHTML={{ __html: lesson.content }}
                />
              )}

              {/* Resources */}
              {resources.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Lesson Resources
                  </h3>
                  <div className="space-y-2">
                    {resources.map(resource => (
                      <a
                        key={resource.id}
                        href={resource.file_url}
                        download
                        className="flex items-center justify-between p-4 bg-white border rounded-lg hover:bg-gray-50"
                      >
                        <div>
                          <p className="font-semibold">{resource.title}</p>
                          <p className="text-sm text-gray-600">{resource.resource_type}</p>
                        </div>
                        <Download className="w-5 h-5 text-[#3B82F6]" />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div className="flex justify-between mt-8 pt-6 border-t">
                {prevLesson ? (
                  <Link href={`/learn/${params.courseId}/${prevLesson.id}`}>
                    <Button variant="outline">
                      <ChevronLeft className="w-4 h-4 mr-2" />
                      Previous Lesson
                    </Button>
                  </Link>
                ) : (
                  <div />
                )}

                {nextLesson ? (
                  <Link href={`/learn/${params.courseId}/${nextLesson.id}`}>
                    <Button className="bg-[#3B82F6]">
                      Next Lesson
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                ) : (
                  <Button className="bg-[#10B981]">
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Complete Course
                  </Button>
                )}
              </div>
            </Card>
          </div>

          {/* Sidebar - Course Outline */}
          <div>
            <Card className="p-6 sticky top-4">
              <h3 className="font-bold mb-4">Course Content</h3>
              <div className="space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
                {modules.map(module => (
                  <div key={module.id}>
                    <h4 className="font-semibold text-sm mb-2">{module.title}</h4>
                    <div className="space-y-1">
                      {module.lessons
                        .sort((a: any, b: any) => a.order_index - b.order_index)
                        .map((l: any) => (
                          <Link
                            key={l.id}
                            href={`/learn/${params.courseId}/${l.id}`}
                            className={`block p-2 rounded text-sm hover:bg-gray-100 ${
                              l.id === params.lessonId ? 'bg-[#3B82F6] text-white' : ''
                            }`}
                          >
                            {l.title}
                          </Link>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
