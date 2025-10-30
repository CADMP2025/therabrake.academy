'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Award, Clock, TrendingUp } from 'lucide-react';

interface Course {
  id: string;
  ce_hours: number;
  [key: string]: any;
}

interface Enrollment {
  id: string;
  status: 'active' | 'completed' | 'cancelled';
  user_id: string;
  course_id: string;
  courses: Course;
  [key: string]: any;
}

interface DashboardData {
  activeEnrollments: number;
  completedCourses: number;
  totalCEHours: number;
  inProgressHours: number;
}

export default function StudentDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadDashboardData = useCallback(async () => {
    const supabase = createClient();
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      // Fetch dashboard data
      const { data: enrollments, error } = await supabase
        .from('enrollments')
        .select('*, courses(*)')
        .eq('user_id', user.id);

      if (error) throw error;

      // Calculate stats - cast enrollments to proper type
      const typedEnrollments = enrollments as Enrollment[] | null;
      const active = typedEnrollments?.filter((e: Enrollment) => e.status === 'active').length || 0;
      const completed = typedEnrollments?.filter((e: Enrollment) => e.status === 'completed').length || 0;
      const totalHours =
        typedEnrollments
          ?.filter((e: Enrollment) => e.status === 'completed')
          .reduce((sum: number, e: Enrollment) => sum + (e.courses?.ce_hours || 0), 0) || 0;
      const inProgress =
        typedEnrollments
          ?.filter((e: Enrollment) => e.status === 'active')
          .reduce((sum: number, e: Enrollment) => sum + (e.courses?.ce_hours || 0), 0) || 0;

      setData({
        activeEnrollments: active,
        completedCourses: completed,
        totalCEHours: totalHours,
        inProgressHours: inProgress,
      });
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
      <h1 className="text-3xl font-bold mb-8">My Learning Dashboard</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data?.activeEnrollments || 0}</div>
            <p className="text-xs text-muted-foreground">Currently enrolled</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data?.completedCourses || 0}</div>
            <p className="text-xs text-muted-foreground">Courses finished</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">CE Hours Earned</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data?.totalCEHours || 0}</div>
            <p className="text-xs text-muted-foreground">Total credits</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data?.inProgressHours || 0}</div>
            <p className="text-xs text-muted-foreground">Hours available</p>
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
            <p className="text-center py-4 text-muted-foreground mb-4">
              No courses in progress
            </p>
            <Link 
              href="/student/courses"
              className="w-full bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary-dark transition inline-block text-center"
            >
              Browse Course Catalog
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link 
              href="/student/certificates"
              className="block w-full text-left p-3 rounded-lg border hover:bg-gray-50 transition"
            >
              <div className="font-medium">View Certificates</div>
              <div className="text-sm text-muted-foreground">Download and verify your certificates</div>
            </Link>
            <Link 
              href="/student/courses"
              className="block w-full text-left p-3 rounded-lg border hover:bg-gray-50 transition"
            >
              <div className="font-medium">Enroll in New Course</div>
              <div className="text-sm text-muted-foreground">Browse available courses and programs</div>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
