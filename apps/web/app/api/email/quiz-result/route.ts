import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, quizId, attemptId, score, passed } = body;

    if (!email || !quizId || !attemptId || score === undefined || passed === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const supabase = createRouteHandlerClient({ cookies });

    // Get quiz and course details
    const { data: quiz } = await supabase
      .from('quizzes')
      .select(`
        *,
        lesson:lessons (
          title,
          course:courses (
            title,
            id
          )
        )
      `)
      .eq('id', quizId)
      .single();

    if (!quiz) {
      return NextResponse.json({ error: 'Quiz not found' }, { status: 404 });
    }

    const courseTitle = quiz.lesson?.course?.title || 'Course';
    const courseId = quiz.lesson?.course?.id || '';
    const quizTitle = quiz.title || 'Quiz';
    const passingScore = quiz.passing_score || 80;

    const subject = passed 
      ? `🎉 Congratulations! You passed the ${quizTitle}!`
      : `Quiz Results: ${quizTitle}`;

    const htmlContent = passed
      ? `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Quiz Passed</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #10B981 0%, #059669 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
    <h1 style="color: white; margin: 0;">🎉 Congratulations!</h1>
  </div>
  
  <div style="background: #fff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
    <p style="font-size: 18px; margin-top: 0;">Great job! You have successfully passed the <strong>${quizTitle}</strong>!</p>
    
    <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <h2 style="margin-top: 0; color: #10B981;">Your Results</h2>
      <p style="font-size: 32px; font-weight: bold; color: #10B981; margin: 10px 0;">${score}%</p>
      <p style="color: #6b7280; margin: 0;">Passing Score: ${passingScore}%</p>
    </div>

    <p>This is a significant achievement! You can now continue with the course and work towards earning your certificate.</p>

    <div style="text-align: center; margin: 30px 0;">
      <a href="${process.env.NEXT_PUBLIC_SITE_URL}/courses/${courseId}" style="background: #3B82F6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 600;">Continue Learning</a>
    </div>

    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">

    <p style="font-size: 14px; color: #6b7280;">
      <strong>Course:</strong> ${courseTitle}<br>
      <strong>Quiz:</strong> ${quizTitle}
    </p>
  </div>

  <div style="text-align: center; padding: 20px; color: #9ca3af; font-size: 12px;">
    <p>© ${new Date().getFullYear()} TheraBrake Academy. All rights reserved.</p>
  </div>
</body>
</html>
      `
      : `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Quiz Results</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #EF4444 0%, #DC2626 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
    <h1 style="color: white; margin: 0;">Quiz Results</h1>
  </div>
  
  <div style="background: #fff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
    <p style="font-size: 18px; margin-top: 0;">You have completed the <strong>${quizTitle}</strong>, but did not meet the passing score this time.</p>
    
    <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <h2 style="margin-top: 0; color: #EF4444;">Your Results</h2>
      <p style="font-size: 32px; font-weight: bold; color: #EF4444; margin: 10px 0;">${score}%</p>
      <p style="color: #6b7280; margin: 0;">Passing Score: ${passingScore}%</p>
    </div>

    <p><strong>Don't worry!</strong> Learning takes time and practice. Here are some tips to help you succeed:</p>
    
    <ul style="color: #4b5563;">
      <li>Review the course materials carefully</li>
      <li>Take notes on key concepts</li>
      <li>Watch the video lessons again</li>
      <li>Practice with any study materials provided</li>
    </ul>

    <p>You can retake the quiz after 24 hours. We believe in you!</p>

    <div style="text-align: center; margin: 30px 0;">
      <a href="${process.env.NEXT_PUBLIC_SITE_URL}/courses/${courseId}" style="background: #3B82F6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 600;">Review Course Materials</a>
    </div>

    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">

    <p style="font-size: 14px; color: #6b7280;">
      <strong>Course:</strong> ${courseTitle}<br>
      <strong>Quiz:</strong> ${quizTitle}
    </p>
  </div>

  <div style="text-align: center; padding: 20px; color: #9ca3af; font-size: 12px;">
    <p>© ${new Date().getFullYear()} TheraBrake Academy. All rights reserved.</p>
  </div>
</body>
</html>
      `;

    const { data, error } = await resend.emails.send({
      from: 'TheraBrake Academy <noreply@therabrake.academy>',
      to: [email],
      subject: subject,
      html: htmlContent,
    });

    if (error) {
      console.error('Email send error:', error);
      return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error sending quiz result email:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
