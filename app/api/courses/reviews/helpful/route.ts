import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

const helpfulSchema = z.object({
  review_id: z.string().uuid(),
  is_helpful: z.boolean(),
});

// POST /api/courses/reviews/helpful - Mark a review as helpful or not
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
    const validated = helpfulSchema.parse(body);

    // Upsert helpfulness
    const { data, error } = await supabase
      .from('review_helpfulness')
      .upsert({
        review_id: validated.review_id,
        user_id: user.id,
        is_helpful: validated.is_helpful,
      })
      .select()
      .single();

    if (error) throw error;

    // Update helpful count on the review
    if (validated.is_helpful) {
      await supabase.rpc('increment_review_helpful_count', {
        review_id: validated.review_id
      });
    } else {
      await supabase.rpc('decrement_review_helpful_count', {
        review_id: validated.review_id
      });
    }

    return NextResponse.json({ 
      data,
      success: true 
    });

  } catch (error: any) {
    console.error('Mark review helpful error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to mark review as helpful', success: false },
      { status: 500 }
    );
  }
}
