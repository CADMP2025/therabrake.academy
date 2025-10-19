export interface GradingResult {
  totalPoints: number;
  earnedPoints: number;
  score: number;
  passed: boolean;
  questionResults: QuestionResult[];
}

export interface QuestionResult {
  questionId: string;
  isCorrect: boolean;
  pointsEarned: number;
  maxPoints: number;
  userAnswer: any;
  correctAnswer: any;
}

export function gradeQuiz(
  questions: any[],
  answers: Record<string, any>,
  passingScore: number = 70
): GradingResult {
  let totalPoints = 0;
  let earnedPoints = 0;
  const questionResults: QuestionResult[] = [];

  questions.forEach(question => {
    totalPoints += question.points;
    const userAnswer = answers[question.id];
    let isCorrect = false;
    let pointsEarned = 0;

    switch (question.question_type) {
      case 'multiple_choice':
      case 'true_false':
        isCorrect = userAnswer === question.correct_answer;
        pointsEarned = isCorrect ? question.points : 0;
        break;

      case 'short_answer':
        isCorrect = normalizeText(userAnswer) === normalizeText(question.correct_answer);
        pointsEarned = isCorrect ? question.points : 0;
        break;

      case 'multiple_select':
        const correctAnswers = Array.isArray(question.correct_answer) 
          ? question.correct_answer 
          : [question.correct_answer];
        const userAnswers = Array.isArray(userAnswer) ? userAnswer : [userAnswer];
        
        isCorrect = arraysEqual(correctAnswers.sort(), userAnswers.sort());
        pointsEarned = isCorrect ? question.points : 0;
        break;
    }

    earnedPoints += pointsEarned;
    questionResults.push({
      questionId: question.id,
      isCorrect,
      pointsEarned,
      maxPoints: question.points,
      userAnswer,
      correctAnswer: question.correct_answer
    });
  });

  const score = totalPoints > 0 ? (earnedPoints / totalPoints) * 100 : 0;
  const passed = score >= passingScore;

  return {
    totalPoints,
    earnedPoints,
    score,
    passed,
    questionResults
  };
}

function normalizeText(text: string): string {
  if (!text) return '';
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s]/g, '')
    .replace(/\s+/g, ' ');
}

function arraysEqual(arr1: any[], arr2: any[]): boolean {
  if (arr1.length !== arr2.length) return false;
  return arr1.every((val, idx) => val === arr2[idx]);
}

export function calculateCECredits(score: number, courseHours: number): number {
  if (score < 70) return 0;
  return courseHours;
}

export function generateQuizFeedback(result: GradingResult): string {
  const { score } = result;

  if (score >= 90) {
    return 'Excellent work! You have demonstrated mastery of the material.';
  } else if (score >= 80) {
    return 'Great job! You have a strong understanding of the concepts.';
  } else if (score >= 70) {
    return 'Good work! You have passed and met the minimum requirements.';
  } else if (score >= 60) {
    return 'You were close! Review the material and try again.';
  } else {
    return 'Please review the course material thoroughly before retaking the quiz.';
  }
}
