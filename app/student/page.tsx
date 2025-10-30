'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Award, Clock, TrendingUp } from 'lucide-react';

type CourseProgress = {
  courseId: string;
  courseTitle: string;
  totalLessons: number;
  completedLessons: number;
  inProgressLessons: number;
  totalTimeSpent: number;
  avgProgressPercentage: number;
  lastAccessed: string;
  estimatedCompletion: string | null;
};

type ProgressStats = {
  totalCourses: number;
  activeCourses: number;
  completedCourses: number;
  totalTimeSpent: number;
  totalCEHours: number;
  currentStreak: number;
  longestStreak: number;
  coursesProgress: CourseProgress[];
};

type ActivityEntry = {
  activity_date: string;
  lessons_accessed: number;
  time_spent: number;
  videos_watched: number;
  notes_created: number;
};

export default function StudentDashboard() {
  const [userName, setUserName] = useState<string>('');
  const [stats, setStats] = useState<ProgressStats | null>(null);
  const [activity, setActivity] = useState<ActivityEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadDashboardData = useCallback(async () => {
    const supabase = createClient();
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setUserName((user.user_metadata?.full_name as string) || user.email || '');

      // Fetch progress stats and recent activity in parallel
      const [statsRes, activityRes] = await Promise.all([
        fetch('/api/progress/dashboard'),
        fetch('/api/activity/recent')
      ]);

      if (statsRes.ok) {
        const s = await statsRes.json();
        setStats(s.stats as ProgressStats);
      }
      if (activityRes.ok) {
        const a = await activityRes.json();
        setActivity(a.activity as ActivityEntry[]);
      }
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Welcome back{userName ? `, ${userName}` : ''} 👋</h1>
        {stats && (
          <p className="text-sm text-muted-foreground mt-1">
            Current streak: <span className="font-medium">{stats.currentStreak}</span> days · Longest: <span className="font-medium">{stats.longestStreak}</span> days
          </p>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.activeCourses ?? 0}</div>
            <p className="text-xs text-muted-foreground">Currently enrolled</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.completedCourses ?? 0}</div>
            <p className="text-xs text-muted-foreground">Courses finished</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">CE Hours Earned</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalCEHours ?? 0}</div>
            <p className="text-xs text-muted-foreground">Total credits</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(stats?.coursesProgress?.length ?? 0) - (stats?.completedCourses ?? 0)}</div>
            <p className="text-xs text-muted-foreground">Courses with activity</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Continue Learning</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">Pick up where you left off</p>
            {stats && stats.coursesProgress.length > 0 ? (
              <div className="space-y-3">
                {stats.coursesProgress.slice(0, 3).map((cp) => (
                  <div key={cp.courseId} className="flex items-center justify-between rounded-lg border p-3">
                    <div>
                      <div className="font-medium">{cp.courseTitle}</div>
                      <div className="text-xs text-muted-foreground">{cp.avgProgressPercentage}% complete</div>
                    </div>
                    <Link
                      href={`/courses/${cp.courseId}`}
                      className="text-sm bg-primary text-white py-1.5 px-3 rounded-md hover:opacity-90"
                    >
                      Continue
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <>
                <p className="text-center py-4 text-muted-foreground mb-4">No courses in progress</p>
                <Link
                  href="/courses/catalog"
                  className="w-full bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary-dark transition inline-block text-center"
                >
                  Browse Course Catalog
                </Link>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {activity.length > 0 ? (
              <div className="space-y-2">
                {activity.slice(0, 7).map((a) => (
                  <div key={a.activity_date} className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{new Date(a.activity_date).toLocaleDateString()}</span>
                    <span>
                      {a.lessons_accessed} lessons · {(a.time_spent / 60).toFixed(0)} min · {a.videos_watched} videos
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No recent activity yet. Start a course to begin your streak!</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
