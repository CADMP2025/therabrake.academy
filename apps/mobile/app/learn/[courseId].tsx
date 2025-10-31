import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { VideoView, useVideoPlayer } from 'expo-video';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

interface Lesson {
  id: string;
  title: string;
  description: string;
  video_url: string;
  duration_minutes: number;
  order_index: number;
}

interface Course {
  id: string;
  title: string;
}

export default function LearnScreen() {
  const { courseId } = useLocalSearchParams();
  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const videoPlayer = currentLesson
    ? useVideoPlayer(currentLesson.video_url, (player) => {
        player.loop = false;
        player.play();
      })
    : null;

  useEffect(() => {
    fetchCourseAndLessons();
  }, [courseId]);

  const fetchCourseAndLessons = async () => {
    try {
      // Fetch course info
      const { data: courseData, error: courseError } = await supabase
        .from('courses')
        .select('id, title')
        .eq('id', courseId)
        .single();

      if (courseError) throw courseError;
      setCourse(courseData);

      // Fetch lessons
      const { data: lessonsData, error: lessonsError } = await supabase
        .from('lessons')
        .select('*')
        .eq('course_id', courseId)
        .order('order_index', { ascending: true });

      if (lessonsError) throw lessonsError;
      setLessons(lessonsData || []);

      // Set first lesson as current
      if (lessonsData && lessonsData.length > 0) {
        setCurrentLesson(lessonsData[0]);
      }
    } catch (error) {
      console.error('Error fetching course data:', error);
      Alert.alert('Error', 'Could not load course content');
    } finally {
      setLoading(false);
    }
  };

  const handleLessonSelect = (lesson: Lesson) => {
    setCurrentLesson(lesson);
  };

  const handleMarkComplete = async () => {
    if (!user || !currentLesson) return;

    try {
      const { error } = await supabase.from('user_progress').upsert({
        user_id: user.id,
        lesson_id: currentLesson.id,
        course_id: courseId,
        completed: true,
        completed_at: new Date().toISOString(),
      });

      if (error) throw error;
      Alert.alert('Success', 'Lesson marked as complete!');
    } catch (error) {
      console.error('Error marking complete:', error);
      Alert.alert('Error', 'Could not save progress');
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (!course || lessons.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>No lessons available</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {currentLesson && videoPlayer && (
        <View style={styles.videoContainer}>
          <VideoView
            style={styles.video}
            player={videoPlayer}
            allowsFullscreen
            allowsPictureInPicture
          />
        </View>
      )}

      <View style={styles.content}>
        <Text style={styles.courseTitle}>{course.title}</Text>
        
        {currentLesson && (
          <View style={styles.lessonInfo}>
            <Text style={styles.lessonTitle}>{currentLesson.title}</Text>
            <Text style={styles.duration}>
              ⏱️ {currentLesson.duration_minutes} minutes
            </Text>
            <Text style={styles.description}>{currentLesson.description}</Text>
            
            <TouchableOpacity
              style={styles.completeButton}
              onPress={handleMarkComplete}
            >
              <Text style={styles.completeButtonText}>Mark as Complete</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.lessonsSection}>
          <Text style={styles.sectionTitle}>
            Course Content ({lessons.length} lessons)
          </Text>
          <ScrollView style={styles.lessonsList}>
            {lessons.map((lesson, index) => (
              <TouchableOpacity
                key={lesson.id}
                style={[
                  styles.lessonItem,
                  currentLesson?.id === lesson.id && styles.lessonItemActive,
                ]}
                onPress={() => handleLessonSelect(lesson)}
              >
                <View style={styles.lessonNumber}>
                  <Text style={styles.lessonNumberText}>{index + 1}</Text>
                </View>
                <View style={styles.lessonDetails}>
                  <Text
                    style={[
                      styles.lessonItemTitle,
                      currentLesson?.id === lesson.id &&
                        styles.lessonItemTitleActive,
                    ]}
                    numberOfLines={2}
                  >
                    {lesson.title}
                  </Text>
                  <Text style={styles.lessonDuration}>
                    {lesson.duration_minutes} min
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  videoContainer: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: '#000',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  content: {
    flex: 1,
  },
  courseTitle: {
    fontSize: 14,
    color: '#666',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  lessonInfo: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  lessonTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  duration: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
    marginBottom: 16,
  },
  completeButton: {
    backgroundColor: '#34C759',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  completeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  lessonsSection: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
    padding: 20,
    paddingBottom: 12,
  },
  lessonsList: {
    flex: 1,
  },
  lessonItem: {
    flexDirection: 'row',
    padding: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    alignItems: 'center',
  },
  lessonItemActive: {
    backgroundColor: '#f0f8ff',
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  lessonNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  lessonNumberText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
  },
  lessonDetails: {
    flex: 1,
  },
  lessonItemTitle: {
    fontSize: 16,
    color: '#1a1a1a',
    marginBottom: 4,
  },
  lessonItemTitleActive: {
    fontWeight: 'bold',
    color: '#007AFF',
  },
  lessonDuration: {
    fontSize: 12,
    color: '#999',
  },
  errorText: {
    fontSize: 18,
    color: '#666',
  },
});
