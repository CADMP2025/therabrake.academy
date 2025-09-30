import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/client';
import { z } from 'zod';

const courseSchema = z.object({
  title: z.string().min(2),
  description: z.string(),
  content: z.string(),
  ce_hours: z.number().min(0.5),
  provider_number: z.string().optional(),
  modules: z.array(z.any()),
  quiz: z.array(z.any())
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = courseSchema.parse(body);
    
    const supabase = createClient();
    
    // Create course
    const { data: course, error } = await supabase
      .from('courses')
      .insert({
        title: validated.title,
        description: validated.description,
        ce_hours: validated.ce_hours,
        provider_number: validated.provider_number,
        status: 'draft'
      })
      .select()
      .single();
      
    if (error) throw error;
    
    // Create modules
    if (validated.modules.length > 0) {
      await supabase
        .from('modules')
        .insert(
          validated.modules.map((m: any, idx: number) => ({
            course_id: course.id,
            title: m.title,
            content: m.content,
            order_index: idx
          }))
        );
    }
    
    // Create quiz
    if (validated.quiz.length > 0) {
      const { data: quizData } = await supabase
        .from('quizzes')
        .insert({
          course_id: course.id,
          title: `${validated.title} Assessment`,
          passing_score: 70
        })
        .select()
        .single();
        
      if (quizData) {
        await supabase
          .from('quiz_questions')
          .insert(
            validated.quiz.map((q: any, idx: number) => ({
              quiz_id: quizData.id,
              question: q.question,
              answers: q.answers,
              correct_answer: q.correct,
              explanation: q.explanation,
              order_index: idx
            }))
          );
      }
    }
    
    return NextResponse.json({ success: true, courseId: course.id });
  } catch (error) {
    console.error('Course creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create course' },
      { status: 500 }
    );
  }
}
