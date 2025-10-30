'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { 
  BookOpen, 
  Clock, 
  Award, 
  TrendingUp, 
  CheckCircle,
  PlayCircle,
  Calendar,
  Target,
  Flame
} from 'lucide-react';

interface CourseProgress {
  courseId: string;
  courseTitle: string;
  totalLessons: number;
  completedLessons: number;
  inProgressLessons: number;
  totalTimeSpent: number; // seconds
  avgProgressPercentage: number;
  lastAccessed: string;
  estimatedCompletion?: string;
}

interface ProgressStats {
  totalCourses: number;
  activeCourses: number;
  completedCourses: number;
  totalTimeSpent: number; // seconds
  totalCEHours: number;
  currentStreak: number;
  longestStreak: number;
  coursesProgress: CourseProgress[];
}

interface ProgressDashboardProps {
  userId?: string;
}

export default function ProgressDashboard({ userId }: ProgressDashboardProps) {
  const [stats, setStats] = useState<ProgressStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProgressStats();
  }, [userId]);

  const loadProgressStats = async () => {
    try {
      const response = await fetch('/api/progress/dashboard');
      if (response.ok) {
        const data = await response.json();
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Failed to load progress stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const calculateCEHours = (seconds: number): number => {
    return Math.round((seconds / 3600) * 10) / 10;
  };

  const getProgressColor = (percentage: number): string => {
    if (percentage >= 75) return 'text-green-600';
    if (percentage >= 50) return 'text-blue-600';
    if (percentage >= 25) return 'text-yellow-600';
    return 'text-gray-600';
  };

  const getStreakEmoji = (streak: number): string => {
    if (streak >= 30) return '🔥🔥🔥';
    if (streak >= 14) return '🔥🔥';
    if (streak >= 7) return '🔥';
    return '⭐';
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <Card className="p-12 text-center">
        <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-400" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          No Progress Yet
        </h3>
        <p className="text-gray-600">
          Start a course to begin tracking your progress!
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Active Courses */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">
                Active Courses
              </p>
              <p className="text-3xl font-bold text-gray-900">
                {stats.activeCourses}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {stats.completedCourses} completed
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <PlayCircle className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>

        {/* Total Time */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">
                Total Time
              </p>
              <p className="text-3xl font-bold text-gray-900">
                {formatTime(stats.totalTimeSpent)}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {calculateCEHours(stats.totalTimeSpent)} CE Hours
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <Clock className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>

        {/* Current Streak */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">
                Current Streak
              </p>
              <div className="flex items-baseline space-x-1">
                <p className="text-3xl font-bold text-gray-900">
                  {stats.currentStreak}
                </p>
                <span className="text-xl">{getStreakEmoji(stats.currentStreak)}</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Best: {stats.longestStreak} days
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
              <Flame className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </Card>

        {/* CE Hours */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">
                CE Hours Earned
              </p>
              <p className="text-3xl font-bold text-gray-900">
                {stats.totalCEHours}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Continuing Education
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <Award className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Course Progress Details */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900">
            Course Progress
          </h3>
          <TrendingUp className="w-5 h-5 text-gray-400" />
        </div>

        <div className="space-y-6">
          {stats.coursesProgress.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <BookOpen className="w-12 h-12 mx-auto mb-3 text-gray-400" />
              <p>No courses in progress</p>
            </div>
          ) : (
            stats.coursesProgress.map((course) => {
              const completionPercentage = Math.round(
                (course.completedLessons / course.totalLessons) * 100
              );

              return (
                <div key={course.courseId} className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 mb-1">
                        {course.courseTitle}
                      </h4>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span className="flex items-center">
                          <CheckCircle className="w-4 h-4 mr-1" />
                          {course.completedLessons}/{course.totalLessons} lessons
                        </span>
                        <span className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {formatTime(course.totalTimeSpent)}
                        </span>
                        <span className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {new Date(course.lastAccessed).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className={`text-2xl font-bold ${getProgressColor(completionPercentage)}`}>
                      {completionPercentage}%
                    </div>
                  </div>

                  <Progress value={completionPercentage} className="h-2" />

                  {course.estimatedCompletion && (
                    <div className="flex items-center text-sm text-gray-500">
                      <Target className="w-4 h-4 mr-1" />
                      Estimated completion: {course.estimatedCompletion}
                    </div>
                  )}

                  {/* Milestone Indicators */}
                  <div className="flex items-center space-x-2">
                    {[25, 50, 75, 100].map((milestone) => (
                      <div
                        key={milestone}
                        className={`flex-1 h-1 rounded-full ${
                          completionPercentage >= milestone
                            ? 'bg-green-500'
                            : 'bg-gray-200'
                        }`}
                        title={`${milestone}% milestone`}
                      />
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </Card>

      {/* Weekly Activity */}
      <Card className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">
          This Week's Activity
        </h3>
        <div className="grid grid-cols-7 gap-2">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
            <div key={day} className="text-center">
              <div className="text-xs text-gray-600 mb-2">{day}</div>
              <div
                className={`w-full h-12 rounded-lg ${
                  index < stats.currentStreak
                    ? 'bg-green-500'
                    : 'bg-gray-200'
                }`}
              />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
