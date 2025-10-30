import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

const reviewSchema = z.object({
  course_id: z.string().uuid(),
  rating: z.number().min(1).max(5),
  title: z.string().optional(),
  comment: z.string().optional(),
});

const helpfulSchema = z.object({
  review_id: z.string().uuid(),
  is_helpful: z.boolean(),
});

// GET /api/courses/reviews - Get reviews for a course
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get('course_id');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');
    
    if (!courseId) {
      return NextResponse.json(
        { error: 'course_id is required' },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    
    const { data: reviews, error } = await supabase
      .from('course_reviews')
      .select(`
        *,
        user:profiles!course_reviews_user_id_fkey(id, full_name, avatar_url)
      `)
      .eq('course_id', courseId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    return NextResponse.json({ 
      data: reviews || [],
      success: true 
    });

  } catch (error: any) {
    console.error('Get reviews error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch reviews', success: false },
      { status: 500 }
    );
  }
}

// POST /api/courses/reviews - Create a review
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized', success: false },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validated = reviewSchema.parse(body);

    // Check if user is enrolled in the course
    const { data: enrollment } = await supabase
      .from('enrollments')
      .select('id')
      .eq('user_id', user.id)
      .eq('course_id', validated.course_id)
      .eq('status', 'active')
      .single();

    if (!enrollment) {
      return NextResponse.json(
        { error: 'You must be enrolled in this course to leave a review', success: false },
        { status: 403 }
      );
    }

    // Create the review
    const { data: review, error } = await supabase
      .from('course_reviews')
      .insert({
        course_id: validated.course_id,
        user_id: user.id,
        enrollment_id: enrollment.id,
        rating: validated.rating,
        title: validated.title,
        comment: validated.comment,
        verified_purchase: true,
      })
      .select(`
        *,
        user:profiles!course_reviews_user_id_fkey(id, full_name, avatar_url)
      `)
      .single();

    if (error) {
      // Handle duplicate review
      if (error.code === '23505') {
        return NextResponse.json(
          { error: 'You have already reviewed this course', success: false },
          { status: 409 }
        );
      }
      throw error;
    }

    return NextResponse.json({ 
      data: review,
      success: true 
    });

  } catch (error: any) {
    console.error('Create review error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create review', success: false },
      { status: 500 }
    );
  }
}

// PATCH /api/courses/reviews - Update a review
export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized', success: false },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { review_id, rating, title, comment } = body;

    if (!review_id) {
      return NextResponse.json(
        { error: 'review_id is required', success: false },
        { status: 400 }
      );
    }

    // Update the review
    const { data: review, error } = await supabase
      .from('course_reviews')
      .update({
        rating,
        title,
        comment,
        updated_at: new Date().toISOString(),
      })
      .eq('id', review_id)
      .eq('user_id', user.id)
      .select(`
        *,
        user:profiles!course_reviews_user_id_fkey(id, full_name, avatar_url)
      `)
      .single();

    if (error) throw error;

    return NextResponse.json({ 
      data: review,
      success: true 
    });

  } catch (error: any) {
    console.error('Update review error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update review', success: false },
      { status: 500 }
    );
  }
}

// DELETE /api/courses/reviews - Delete a review
export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized', success: false },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const reviewId = searchParams.get('review_id');

    if (!reviewId) {
      return NextResponse.json(
        { error: 'review_id is required', success: false },
        { status: 400 }
      );
    }

    // Delete the review
    const { error } = await supabase
      .from('course_reviews')
      .delete()
      .eq('id', reviewId)
      .eq('user_id', user.id);

    if (error) throw error;

    return NextResponse.json({ 
      success: true 
    });

  } catch (error: any) {
    console.error('Delete review error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete review', success: false },
      { status: 500 }
    );
  }
}
