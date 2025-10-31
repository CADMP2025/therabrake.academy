import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Alert,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

interface CourseDetail {
  id: string;
  title: string;
  description: string;
  thumbnail_url?: string;
  level: string;
  duration_hours: number;
  price: number;
  learning_objectives?: string[];
  prerequisites?: string[];
}

export default function CourseDetailScreen() {
  const { id } = useLocalSearchParams();
  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [enrolled, setEnrolled] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    fetchCourseDetail();
    if (user) {
      checkEnrollment();
    }
  }, [id, user]);

  const fetchCourseDetail = async () => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setCourse(data);
    } catch (error) {
      console.error('Error fetching course:', error);
      Alert.alert('Error', 'Could not load course details');
    } finally {
      setLoading(false);
    }
  };

  const checkEnrollment = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('enrollments')
        .select('id')
        .eq('course_id', id)
        .eq('user_id', user.id)
        .single();

      setEnrolled(!!data);
    } catch (error) {
      // Not enrolled or error
      setEnrolled(false);
    }
  };

  const handleEnroll = () => {
    if (!user) {
      Alert.alert('Sign In Required', 'Please sign in to enroll in this course');
      return;
    }

    // Navigate to enrollment/checkout screen
    router.push(`/enrollment/${id}` as any);
  };

  const handleStartLearning = () => {
    // Navigate to lesson screen
    router.push(`/learn/${id}` as any);
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (!course) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Course not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {course.thumbnail_url ? (
        <Image source={{ uri: course.thumbnail_url }} style={styles.banner} />
      ) : (
        <View style={[styles.banner, styles.placeholderBanner]}>
          <Text style={styles.placeholderText}>📚</Text>
        </View>
      )}

      <View style={styles.content}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{course.level}</Text>
        </View>

        <Text style={styles.title}>{course.title}</Text>

        <View style={styles.meta}>
          <Text style={styles.metaText}>⏱️ {course.duration_hours} hours</Text>
          <Text style={styles.price}>
            {course.price > 0 ? `$${course.price}` : 'Free'}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About This Course</Text>
          <Text style={styles.description}>{course.description}</Text>
        </View>

        {course.learning_objectives && course.learning_objectives.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>What You'll Learn</Text>
            {course.learning_objectives.map((objective, index) => (
              <View key={index} style={styles.listItem}>
                <Text style={styles.bullet}>✓</Text>
                <Text style={styles.listText}>{objective}</Text>
              </View>
            ))}
          </View>
        )}

        {course.prerequisites && course.prerequisites.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Prerequisites</Text>
            {course.prerequisites.map((prereq, index) => (
              <View key={index} style={styles.listItem}>
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.listText}>{prereq}</Text>
              </View>
            ))}
          </View>
        )}
      </View>

      <View style={styles.footer}>
        {enrolled ? (
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleStartLearning}
          >
            <Text style={styles.primaryButtonText}>Continue Learning</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.primaryButton} onPress={handleEnroll}>
            <Text style={styles.primaryButtonText}>
              {course.price > 0 ? `Enroll for $${course.price}` : 'Enroll Now'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
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
  banner: {
    width: '100%',
    height: 250,
    backgroundColor: '#e0e0e0',
  },
  placeholderBanner: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 64,
  },
  content: {
    padding: 20,
  },
  badge: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  meta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  metaText: {
    fontSize: 16,
    color: '#666',
  },
  price: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  listItem: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  bullet: {
    fontSize: 16,
    color: '#007AFF',
    marginRight: 12,
    fontWeight: 'bold',
  },
  listText: {
    flex: 1,
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  footer: {
    padding: 20,
    paddingBottom: 40,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  primaryButton: {
    backgroundColor: '#007AFF',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  errorText: {
    fontSize: 18,
    color: '#666',
  },
});
