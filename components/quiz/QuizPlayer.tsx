'use client';'use client';'use client';'use client'



import { useState, useEffect, useRef } from 'react';

import { useRouter } from 'next/navigation';

import { Card } from '@/components/ui/card';import { useState, useEffect, useRef } from 'react';

import { Button } from '@/components/ui/button';

import { Progress } from '@/components/ui/progress';import { useRouter } from 'next/navigation';

import { Clock, AlertCircle, Flag, ChevronLeft, ChevronRight } from 'lucide-react';

import toast from 'react-hot-toast';import { Card } from '@/components/ui/card';import { useState, useEffect, useRef } from 'react';import { useState, useEffect, useCallback } from 'react'



interface QuizQuestion {import { Button } from '@/components/ui/button';

  id: string;

  question: string;import { Progress } from '@/components/ui/progress';import { useRouter } from 'next/navigation';import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

  question_type: 'multiple_choice' | 'true_false';

  answers: string[];import { 

  correct_answer: number;

  explanation?: string;  Clock, import { Card } from '@/components/ui/card';import { Button } from '@/components/ui/button'

  points: number;

  order_index: number;  AlertCircle, 

}

  Flag,import { Button } from '@/components/ui/button';import { Card } from '@/components/ui/card'

interface QuizPlayerProps {

  quizId: string;  ChevronLeft,

  courseId: string;

  quizTitle: string;  ChevronRightimport { Progress } from '@/components/ui/progress';

  passingScore: number;

  timeLimit?: number;} from 'lucide-react';

  maxAttempts?: number;

  onComplete?: (passed: boolean, score: number) => void;import toast from 'react-hot-toast';import { interface QuizPlayerProps {

}



export default function QuizPlayer({

  quizId,interface QuizQuestion {  Clock,   quiz: any

  courseId,

  quizTitle,  id: string;

  passingScore = 80,

  timeLimit,  question: string;  AlertCircle,   onComplete?: (score: number) => void

  maxAttempts = 3,

  onComplete,  question_type: 'multiple_choice' | 'true_false';

}: QuizPlayerProps) {

  const router = useRouter();  answers: string[];  Flag,}

  const timerRef = useRef<NodeJS.Timeout>();

  correct_answer: number;

  const [questions, setQuestions] = useState<QuizQuestion[]>([]);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);  explanation?: string;  ChevronLeft,

  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});

  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<string>>(new Set());  points: number;

  const [loading, setLoading] = useState(true);

  const [submitting, setSubmitting] = useState(false);  order_index: number;  ChevronRightexport default function QuizPlayer({ quiz, onComplete }: QuizPlayerProps) {

  const [attemptId, setAttemptId] = useState<string | null>(null);

  const [remainingAttempts, setRemainingAttempts] = useState(maxAttempts);}

  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);

  const [quizStarted, setQuizStarted] = useState(false);} from 'lucide-react';  const [currentQuestion, setCurrentQuestion] = useState(0)



  useEffect(() => {interface QuizPlayerProps {

    checkAttempts();

    // eslint-disable-next-line react-hooks/exhaustive-deps  quizId: string;import toast from 'react-hot-toast';  const [answers, setAnswers] = useState<Record<number, string>>({})

  }, [quizId]);

  courseId: string;

  useEffect(() => {

    if (quizStarted && timeLimit && timeRemaining !== null) {  quizTitle: string;  const [showResults, setShowResults] = useState(false)

      timerRef.current = setInterval(() => {

        setTimeRemaining((prev) => {  passingScore: number;

          if (prev === null || prev <= 0) {

            handleAutoSubmit();  timeLimit?: number; // minutesinterface QuizQuestion {  const [score, setScore] = useState(0)

            return 0;

          }  maxAttempts?: number;



          if (prev === 300) {  onComplete?: (passed: boolean, score: number) => void;  id: string;  const [timeLeft, setTimeLeft] = useState(quiz.time_limit_minutes * 60)

            toast('⏰ 5 minutes remaining!', { duration: 5000 });

          }}



          if (prev === 60) {  question: string;  const supabase = createClientComponentClient()

            toast.error('⏰ 1 minute remaining!', { duration: 5000 });

          }export default function QuizPlayer({



          return prev - 1;  quizId,  question_type: 'multiple_choice' | 'true_false';

        });

      }, 1000);  courseId,

    }

  quizTitle,  answers: string[];  const handleSubmit = useCallback(async () => {

    return () => {

      if (timerRef.current) {  passingScore = 80,

        clearInterval(timerRef.current);

      }  timeLimit,  correct_answer: number;    let correctAnswers = 0

    };

    // eslint-disable-next-line react-hooks/exhaustive-deps  maxAttempts = 3,

  }, [quizStarted, timeLimit]);

  onComplete,  explanation?: string;    quiz.questions.forEach((q: any, index: number) => {

  const checkAttempts = async () => {

    try {}: QuizPlayerProps) {

      const response = await fetch(`/api/quiz/attempts?quizId=${quizId}`);

      if (response.ok) {  const router = useRouter();  points: number;      if (answers[index] === q.correct_answer) {

        const data = await response.json();

        const attempts = data.attempts || [];  const timerRef = useRef<NodeJS.Timeout>();

        setRemainingAttempts(maxAttempts - attempts.length);

  order_index: number;        correctAnswers++

        if (attempts.length > 0) {

          const lastAttempt = attempts[attempts.length - 1];  const [questions, setQuestions] = useState<QuizQuestion[]>([]);

          if (lastAttempt.completed_at) {

            const lastAttemptTime = new Date(lastAttempt.completed_at).getTime();  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);}      }

            const now = Date.now();

            const hoursSinceLastAttempt = (now - lastAttemptTime) / (1000 * 60 * 60);  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});



            if (hoursSinceLastAttempt < 24 && attempts.length >= maxAttempts) {  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<string>>(new Set());    })

              const hoursRemaining = Math.ceil(24 - hoursSinceLastAttempt);

              toast.error(`Please wait ${hoursRemaining} hours before retaking this quiz.`);  const [loading, setLoading] = useState(true);

              router.back();

              return;  const [submitting, setSubmitting] = useState(false);interface QuizPlayerProps {

            }

          }  const [attemptId, setAttemptId] = useState<string | null>(null);

        }

  const [remainingAttempts, setRemainingAttempts] = useState(maxAttempts);  quizId: string;    const finalScore = (correctAnswers / quiz.questions.length) * 100

        if (remainingAttempts <= 0) {

          toast.error('You have used all available attempts for this quiz.');  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);

          router.back();

          return;  const [quizStarted, setQuizStarted] = useState(false);  courseId: string;

        }

      }

    } catch (error) {

      console.error('Failed to check attempts:', error);  useEffect(() => {  quizTitle: string;    const { data: { user } } = await supabase.auth.getUser()

    } finally {

      setLoading(false);    checkAttempts();

    }

  };    // eslint-disable-next-line react-hooks/exhaustive-deps  passingScore: number;    if (user) {



  const startQuiz = async () => {  }, [quizId]);

    try {

      const questionsResponse = await fetch(`/api/quiz/questions?quizId=${quizId}`);  timeLimit?: number; // minutes      await supabase.from('quiz_attempts').insert({

      if (!questionsResponse.ok) throw new Error('Failed to load questions');

  useEffect(() => {

      const questionsData = await questionsResponse.json();

      const shuffledQuestions = shuffleArray([...questionsData.questions]);    if (quizStarted && timeLimit && timeRemaining !== null) {  maxAttempts?: number;        quiz_id: quiz.id,

      setQuestions(shuffledQuestions);

      timerRef.current = setInterval(() => {

      const attemptResponse = await fetch('/api/quiz/attempt', {

        method: 'POST',        setTimeRemaining((prev) => {  onComplete?: (passed: boolean, score: number) => void;        user_id: user.id,

        headers: { 'Content-Type': 'application/json' },

        body: JSON.stringify({ quizId, courseId }),          if (prev === null || prev <= 0) {

      });

            handleAutoSubmit();}        score: finalScore,

      if (!attemptResponse.ok) throw new Error('Failed to start quiz');

            return 0;

      const attemptData = await attemptResponse.json();

      setAttemptId(attemptData.attempt.id);          }        answers: answers,

      

      if (timeLimit) {

        setTimeRemaining(timeLimit * 60);

      }          if (prev === 300) {export default function QuizPlayer({        completed_at: new Date().toISOString()



      setQuizStarted(true);            toast('⏰ 5 minutes remaining!', { duration: 5000 });

      toast.success('Quiz started! Good luck!');

    } catch (error) {          }  quizId,      })

      console.error('Failed to start quiz:', error);

      toast.error('Failed to start quiz');

    }

  };          if (prev === 60) {  courseId,    }



  const shuffleArray = <T,>(array: T[]): T[] => {            toast.error('⏰ 1 minute remaining!', { duration: 5000 });

    const shuffled = [...array];

    for (let i = shuffled.length - 1; i > 0; i--) {          }  quizTitle,

      const j = Math.floor(Math.random() * (i + 1));

      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];

    }

    return shuffled;          return prev - 1;  passingScore = 80,    setScore(finalScore)

  };

        });

  const handleAnswerSelect = (questionId: string, answerIndex: number) => {

    setUserAnswers({ ...userAnswers, [questionId]: answerIndex });      }, 1000);  timeLimit,    setShowResults(true)

  };

    }

  const toggleFlag = (questionId: string) => {

    const newFlagged = new Set(flaggedQuestions);  maxAttempts = 3,    onComplete?.(finalScore)

    if (newFlagged.has(questionId)) {

      newFlagged.delete(questionId);    return () => {

    } else {

      newFlagged.add(questionId);      if (timerRef.current) {  onComplete,

    }

    setFlaggedQuestions(newFlagged);        clearInterval(timerRef.current);

  };

      }}: QuizPlayerProps) {    // If passed, mark enrollment complete and trigger certificate generation

  const handleAutoSubmit = async () => {

    toast.error('Time is up! Submitting quiz automatically...');    };

    await handleSubmit();

  };    // eslint-disable-next-line react-hooks/exhaustive-deps  const router = useRouter();    try {



  const handleSubmit = async () => {  }, [quizStarted, timeLimit]);

    const unansweredCount = questions.filter((q) => userAnswers[q.id] === undefined).length;

      const timerRef = useRef<NodeJS.Timeout>();      if (finalScore >= (quiz.passing_score ?? 70)) {

    if (unansweredCount > 0) {

      const confirmed = confirm(`You have ${unansweredCount} unanswered question(s). Submit anyway?`);  const checkAttempts = async () => {

      if (!confirmed) return;

    }    try {        const { data: { user: u } } = await supabase.auth.getUser()



    setSubmitting(true);      const response = await fetch(`/api/quiz/attempts?quizId=${quizId}`);



    try {      if (response.ok) {  const [questions, setQuestions] = useState<QuizQuestion[]>([]);        if (u) {

      let correctAnswers = 0;

      const answers = questions.map((q) => ({        const data = await response.json();

        question_id: q.id,

        user_answer: userAnswers[q.id] ?? -1,        const attempts = data.attempts || [];  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);          // Find enrollment for this course

        is_correct: userAnswers[q.id] === q.correct_answer,

      }));        setRemainingAttempts(maxAttempts - attempts.length);



      correctAnswers = answers.filter((a) => a.is_correct).length;  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});          const { data: enr } = await supabase

      const score = Math.round((correctAnswers / questions.length) * 100);

      const passed = score >= passingScore;        if (attempts.length > 0) {



      const response = await fetch('/api/quiz/submit', {          const lastAttempt = attempts[attempts.length - 1];  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<string>>(new Set());            .from('enrollments')

        method: 'POST',

        headers: { 'Content-Type': 'application/json' },          if (lastAttempt.completed_at) {

        body: JSON.stringify({ attemptId, quizId, courseId, answers, score, passed }),

      });            const lastAttemptTime = new Date(lastAttempt.completed_at).getTime();  const [loading, setLoading] = useState(true);            .select('id')



      if (!response.ok) throw new Error('Failed to submit quiz');            const now = Date.now();



      const data = await response.json();            const hoursSinceLastAttempt = (now - lastAttemptTime) / (1000 * 60 * 60);  const [submitting, setSubmitting] = useState(false);            .eq('user_id', u.id)



      if (timerRef.current) {

        clearInterval(timerRef.current);

      }            if (hoursSinceLastAttempt < 24 && attempts.length >= maxAttempts) {  const [attemptId, setAttemptId] = useState<string | null>(null);            .eq('course_id', quiz.course_id)



      router.push(`/quiz/${quizId}/results/${data.attempt.id}`);              const hoursRemaining = Math.ceil(24 - hoursSinceLastAttempt);



      if (onComplete) {              toast.error(`Please wait ${hoursRemaining} hours before retaking this quiz.`);  const [remainingAttempts, setRemainingAttempts] = useState(maxAttempts);            .maybeSingle()

        onComplete(passed, score);

      }              router.back();

    } catch (error) {

      console.error('Failed to submit quiz:', error);              return;  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);          if (enr?.id) {

      toast.error('Failed to submit quiz');

    } finally {            }

      setSubmitting(false);

    }          }  const [quizStarted, setQuizStarted] = useState(false);            await supabase

  };

        }

  const formatTime = (seconds: number): string => {

    const mins = Math.floor(seconds / 60);              .from('enrollments')

    const secs = seconds % 60;

    return `${mins}:${secs.toString().padStart(2, '0')}`;        if (remainingAttempts <= 0) {

  };

          toast.error('You have used all available attempts for this quiz.');  useEffect(() => {              .update({ status: 'completed', progress: 100, completed_at: new Date().toISOString() })

  const currentQuestion = questions[currentQuestionIndex];

  const progress = questions.length > 0 ? ((currentQuestionIndex + 1) / questions.length) * 100 : 0;          router.back();

  const answeredCount = Object.keys(userAnswers).length;

          return;    checkAttempts();              .eq('id', enr.id)

  if (loading) {

    return (        }

      <Card className="p-12 text-center">

        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>      }    // eslint-disable-next-line react-hooks/exhaustive-deps            // Fire-and-forget certificate generation

        <p className="mt-4 text-gray-600">Loading quiz...</p>

      </Card>    } catch (error) {

    );

  }      console.error('Failed to check attempts:', error);  }, [quizId]);            fetch('/api/certificates/generate', {



  if (!quizStarted) {    } finally {

    return (

      <Card className="p-8 max-w-2xl mx-auto">      setLoading(false);              method: 'POST',

        <h2 className="text-2xl font-bold text-gray-900 mb-6">{quizTitle}</h2>

            }

        <div className="space-y-4 mb-8">

          <div className="flex items-start space-x-3">  };  useEffect(() => {              headers: { 'Content-Type': 'application/json' },

            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />

            <div>

              <p className="font-medium text-gray-900">Passing Score</p>

              <p className="text-gray-600">{passingScore}% or higher required to pass</p>  const startQuiz = async () => {    if (quizStarted && timeLimit && timeRemaining !== null) {              body: JSON.stringify({ enrollmentId: enr.id }),

            </div>

          </div>    try {



          {timeLimit && (      const questionsResponse = await fetch(`/api/quiz/questions?quizId=${quizId}`);      timerRef.current = setInterval(() => {            }).catch(() => {})

            <div className="flex items-start space-x-3">

              <Clock className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />      if (!questionsResponse.ok) throw new Error('Failed to load questions');

              <div>

                <p className="font-medium text-gray-900">Time Limit</p>        setTimeRemaining((prev) => {          }

                <p className="text-gray-600">{timeLimit} minutes</p>

              </div>      const questionsData = await questionsResponse.json();

            </div>

          )}      const shuffledQuestions = shuffleArray([...questionsData.questions]);          if (prev === null || prev <= 0) {        }



          <div className="flex items-start space-x-3">      setQuestions(shuffledQuestions);

            <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />

            <div>            handleAutoSubmit();      }

              <p className="font-medium text-gray-900">Attempts Remaining</p>

              <p className="text-gray-600">{remainingAttempts} of {maxAttempts} attempts remaining</p>      const attemptResponse = await fetch('/api/quiz/attempt', {

            </div>

          </div>        method: 'POST',            return 0;    } catch (e) {

        </div>

        headers: { 'Content-Type': 'application/json' },

        <Button onClick={startQuiz} className="w-full">Start Quiz</Button>

      </Card>        body: JSON.stringify({ quizId, courseId }),          }      // eslint-disable-next-line no-console

    );

  }      });



  return (      console.error('Post-quiz completion handling failed', e)

    <div className="max-w-4xl mx-auto space-y-6">

      <Card className="p-4">      if (!attemptResponse.ok) throw new Error('Failed to start quiz');

        <div className="flex items-center justify-between">

          <div>          if (prev === 300) {    }

            <h2 className="text-xl font-bold text-gray-900">{quizTitle}</h2>

            <p className="text-sm text-gray-600">      const attemptData = await attemptResponse.json();

              Question {currentQuestionIndex + 1} of {questions.length} • {answeredCount} answered

            </p>      setAttemptId(attemptData.attempt.id);            toast('⏰ 5 minutes remaining!', { duration: 5000 });  }, [quiz, answers, supabase, onComplete])

          </div>

      

          {timeRemaining !== null && (

            <div className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${      if (timeLimit) {          }

              timeRemaining < 300 ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'

            }`}>        setTimeRemaining(timeLimit * 60);

              <Clock className="w-5 h-5" />

              <span className="font-mono font-semibold text-lg">{formatTime(timeRemaining)}</span>      }  useEffect(() => {

            </div>

          )}

        </div>

        <Progress value={progress} className="mt-4 h-2" />      setQuizStarted(true);          if (prev === 60) {    if (timeLeft <= 0 && !showResults) {

      </Card>

      toast.success('Quiz started! Good luck!');

      {currentQuestion && (

        <Card className="p-8">    } catch (error) {            toast.error('⏰ 1 minute remaining!', { duration: 5000 });      handleSubmit()

          <div className="flex items-start justify-between mb-6">

            <h3 className="text-lg font-medium text-gray-900 flex-1">{currentQuestion.question}</h3>      console.error('Failed to start quiz:', error);

            <button

              onClick={() => toggleFlag(currentQuestion.id)}      toast.error('Failed to start quiz');          }      return

              className={`ml-4 p-2 rounded-lg transition-colors ${

                flaggedQuestions.has(currentQuestion.id)    }

                  ? 'bg-yellow-100 text-yellow-600'

                  : 'bg-gray-100 text-gray-400 hover:text-gray-600'  };    }

              }`}

            >

              <Flag className="w-5 h-5" />

            </button>  const shuffleArray = <T,>(array: T[]): T[] => {          return prev - 1;

          </div>

    const shuffled = [...array];

          <div className="space-y-3">

            {currentQuestion.answers.map((answer, index) => {    for (let i = shuffled.length - 1; i > 0; i--) {        });    const timer = setInterval(() => {

              const isSelected = userAnswers[currentQuestion.id] === index;

                    const j = Math.floor(Math.random() * (i + 1));

              return (

                <button      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];      }, 1000);      setTimeLeft(prev => prev - 1)

                  key={index}

                  onClick={() => handleAnswerSelect(currentQuestion.id, index)}    }

                  className={`w-full text-left p-4 rounded-lg border-2 transition-all ${

                    isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300 bg-white'    return shuffled;    }    }, 1000)

                  }`}

                >  };

                  <div className="flex items-center space-x-3">

                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${

                      isSelected ? 'border-blue-500 bg-blue-500' : 'border-gray-300'

                    }`}>  const handleAnswerSelect = (questionId: string, answerIndex: number) => {

                      {isSelected && <div className="w-3 h-3 rounded-full bg-white"></div>}

                    </div>    setUserAnswers({ ...userAnswers, [questionId]: answerIndex });    return () => {    return () => clearInterval(timer)

                    <span className={isSelected ? 'font-medium text-gray-900' : 'text-gray-700'}>{answer}</span>

                  </div>  };

                </button>

              );      if (timerRef.current) {  }, [timeLeft, showResults, handleSubmit])

            })}

          </div>  const toggleFlag = (questionId: string) => {

        </Card>

      )}    const newFlagged = new Set(flaggedQuestions);        clearInterval(timerRef.current);



      <Card className="p-4">    if (newFlagged.has(questionId)) {

        <div className="flex items-center justify-between">

          <Button      newFlagged.delete(questionId);      }  const handleAnswer = (answer: string) => {

            onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}

            disabled={currentQuestionIndex === 0}    } else {

            variant="outline"

          >      newFlagged.add(questionId);    };    setAnswers({ ...answers, [currentQuestion]: answer })

            <ChevronLeft className="w-4 h-4 mr-2" />

            Previous    }

          </Button>

    setFlaggedQuestions(newFlagged);    // eslint-disable-next-line react-hooks/exhaustive-deps  }

          {currentQuestionIndex === questions.length - 1 ? (

            <Button onClick={handleSubmit} disabled={submitting} className="bg-green-600 hover:bg-green-700">  };

              {submitting ? 'Submitting...' : 'Submit Quiz'}

            </Button>  }, [quizStarted, timeLimit]);

          ) : (

            <Button onClick={() => setCurrentQuestionIndex(Math.min(questions.length - 1, currentQuestionIndex + 1))}>  const handleAutoSubmit = async () => {

              Next <ChevronRight className="w-4 h-4 ml-2" />

            </Button>    toast.error('Time is up! Submitting quiz automatically...');  const nextQuestion = () => {

          )}

        </div>    await handleSubmit();



        <div className="mt-4 pt-4 border-t">  };  const checkAttempts = async () => {    if (currentQuestion < quiz.questions.length - 1) {

          <p className="text-sm text-gray-600 mb-3">Jump to question:</p>

          <div className="grid grid-cols-10 gap-2">

            {questions.map((q, index) => {

              const isAnswered = userAnswers[q.id] !== undefined;  const handleSubmit = async () => {    try {      setCurrentQuestion(currentQuestion + 1)

              const isCurrent = index === currentQuestionIndex;

    const unansweredCount = questions.filter((q) => userAnswers[q.id] === undefined).length;

              return (

                <button          const response = await fetch(`/api/quiz/attempts?quizId=${quizId}`);    }

                  key={q.id}

                  onClick={() => setCurrentQuestionIndex(index)}    if (unansweredCount > 0) {

                  className={`aspect-square rounded-lg text-sm font-medium transition-all ${

                    isCurrent      const confirmed = confirm(`You have ${unansweredCount} unanswered question(s). Submit anyway?`);      if (response.ok) {  }

                      ? 'bg-blue-600 text-white'

                      : isAnswered      if (!confirmed) return;

                      ? 'bg-green-100 text-green-700 hover:bg-green-200'

                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'    }        const data = await response.json();

                  }`}

                >

                  {index + 1}

                </button>    setSubmitting(true);        const attempts = data.attempts || [];  const previousQuestion = () => {

              );

            })}

          </div>

        </div>    try {        setRemainingAttempts(maxAttempts - attempts.length);    if (currentQuestion > 0) {

      </Card>

    </div>      let correctAnswers = 0;

  );

}      const answers = questions.map((q) => ({      setCurrentQuestion(currentQuestion - 1)


        question_id: q.id,

        user_answer: userAnswers[q.id] ?? -1,        if (attempts.length > 0) {    }

        is_correct: userAnswers[q.id] === q.correct_answer,

      }));          const lastAttempt = attempts[attempts.length - 1];  }



      correctAnswers = answers.filter((a) => a.is_correct).length;          if (lastAttempt.completed_at) {

      const score = Math.round((correctAnswers / questions.length) * 100);

      const passed = score >= passingScore;            const lastAttemptTime = new Date(lastAttempt.completed_at).getTime();  if (showResults) {



      const response = await fetch('/api/quiz/submit', {            const now = Date.now();    return (

        method: 'POST',

        headers: { 'Content-Type': 'application/json' },            const hoursSinceLastAttempt = (now - lastAttemptTime) / (1000 * 60 * 60);      <Card className="p-8 text-center">

        body: JSON.stringify({ attemptId, quizId, courseId, answers, score, passed }),

      });        <h2 className="text-2xl font-bold mb-4">Quiz Complete!</h2>



      if (!response.ok) throw new Error('Failed to submit quiz');            if (hoursSinceLastAttempt < 24 && attempts.length >= maxAttempts) {        <p className="text-xl mb-4">Your Score: {score.toFixed(1)}%</p>



      const data = await response.json();              const hoursRemaining = Math.ceil(24 - hoursSinceLastAttempt);        <p className="text-gray-600">



      if (timerRef.current) {              toast.error(`Please wait ${hoursRemaining} hours before retaking this quiz.`);          {score >= quiz.passing_score ? 'Congratulations! You passed!' : 'Keep studying and try again.'}

        clearInterval(timerRef.current);

      }              router.back();        </p>



      router.push(`/quiz/${quizId}/results/${data.attempt.id}`);              return;      </Card>



      if (onComplete) {            }    )

        onComplete(passed, score);

      }          }  }

    } catch (error) {

      console.error('Failed to submit quiz:', error);        }

      toast.error('Failed to submit quiz');

    } finally {  const question = quiz.questions[currentQuestion]

      setSubmitting(false);

    }        if (remainingAttempts <= 0) {

  };

          toast.error('You have used all available attempts for this quiz.');  return (

  const formatTime = (seconds: number): string => {

    const mins = Math.floor(seconds / 60);          router.back();    <div className="max-w-3xl mx-auto p-6">

    const secs = seconds % 60;

    return `${mins}:${secs.toString().padStart(2, '0')}`;          return;      <div className="mb-6 flex justify-between items-center">

  };

        }        <h2 className="text-2xl font-bold">{quiz.title}</h2>

  const currentQuestion = questions[currentQuestionIndex];

  const progress = questions.length > 0 ? ((currentQuestionIndex + 1) / questions.length) * 100 : 0;      }        <div className="text-lg">

  const answeredCount = Object.keys(userAnswers).length;

    } catch (error) {          Time: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}

  if (loading) {

    return (      console.error('Failed to check attempts:', error);        </div>

      <Card className="p-12 text-center">

        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>    } finally {      </div>

        <p className="mt-4 text-gray-600">Loading quiz...</p>

      </Card>      setLoading(false);

    );

  }    }      <Card className="p-6 mb-6">



  if (!quizStarted) {  };        <div className="mb-4">

    return (

      <Card className="p-8 max-w-2xl mx-auto">          <span className="text-sm text-gray-500">

        <h2 className="text-2xl font-bold text-gray-900 mb-6">{quizTitle}</h2>

          const startQuiz = async () => {            Question {currentQuestion + 1} of {quiz.questions.length}

        <div className="space-y-4 mb-8">

          <div className="flex items-start space-x-3">    try {          </span>

            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />

            <div>      const questionsResponse = await fetch(`/api/quiz/questions?quizId=${quizId}`);        </div>

              <p className="font-medium text-gray-900">Passing Score</p>

              <p className="text-gray-600">{passingScore}% or higher required to pass</p>      if (!questionsResponse.ok) throw new Error('Failed to load questions');        

            </div>

          </div>        <h3 className="text-xl font-semibold mb-4">{question.question_text}</h3>



          {timeLimit && (      const questionsData = await questionsResponse.json();

            <div className="flex items-start space-x-3">

              <Clock className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />      const shuffledQuestions = shuffleArray([...questionsData.questions]);        <div className="space-y-3">

              <div>

                <p className="font-medium text-gray-900">Time Limit</p>      setQuestions(shuffledQuestions);          {question.options.map((option: string, index: number) => (

                <p className="text-gray-600">{timeLimit} minutes</p>

              </div>            <button

            </div>

          )}      const attemptResponse = await fetch('/api/quiz/attempt', {              key={index}



          <div className="flex items-start space-x-3">        method: 'POST',              onClick={() => handleAnswer(option)}

            <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />

            <div>        headers: { 'Content-Type': 'application/json' },              className={`w-full p-4 text-left rounded-lg border-2 transition-colors ${

              <p className="font-medium text-gray-900">Attempts Remaining</p>

              <p className="text-gray-600">{remainingAttempts} of {maxAttempts} attempts remaining</p>        body: JSON.stringify({ quizId, courseId }),                answers[currentQuestion] === option

            </div>

          </div>      });                  ? 'border-blue-500 bg-blue-50'

        </div>

                  : 'border-gray-200 hover:border-gray-300'

        <Button onClick={startQuiz} className="w-full">Start Quiz</Button>

      </Card>      if (!attemptResponse.ok) throw new Error('Failed to start quiz');              }`}

    );

  }            >



  return (      const attemptData = await attemptResponse.json();              {option}

    <div className="max-w-4xl mx-auto space-y-6">

      <Card className="p-4">      setAttemptId(attemptData.attempt.id);            </button>

        <div className="flex items-center justify-between">

          <div>                ))}

            <h2 className="text-xl font-bold text-gray-900">{quizTitle}</h2>

            <p className="text-sm text-gray-600">      if (timeLimit) {        </div>

              Question {currentQuestionIndex + 1} of {questions.length} • {answeredCount} answered

            </p>        setTimeRemaining(timeLimit * 60);      </Card>

          </div>

      }

          {timeRemaining !== null && (

            <div className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${      <div className="flex justify-between">

              timeRemaining < 300 ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'

            }`}>      setQuizStarted(true);        <Button

              <Clock className="w-5 h-5" />

              <span className="font-mono font-semibold text-lg">{formatTime(timeRemaining)}</span>      toast.success('Quiz started! Good luck!');          onClick={previousQuestion}

            </div>

          )}    } catch (error) {          disabled={currentQuestion === 0}

        </div>

        <Progress value={progress} className="mt-4 h-2" />      console.error('Failed to start quiz:', error);          variant="outline"

      </Card>

      toast.error('Failed to start quiz');        >

      {currentQuestion && (

        <Card className="p-8">    }          Previous

          <div className="flex items-start justify-between mb-6">

            <h3 className="text-lg font-medium text-gray-900 flex-1">{currentQuestion.question}</h3>  };        </Button>

            <button

              onClick={() => toggleFlag(currentQuestion.id)}

              className={`ml-4 p-2 rounded-lg transition-colors ${

                flaggedQuestions.has(currentQuestion.id)  const shuffleArray = <T,>(array: T[]): T[] => {        {currentQuestion === quiz.questions.length - 1 ? (

                  ? 'bg-yellow-100 text-yellow-600'

                  : 'bg-gray-100 text-gray-400 hover:text-gray-600'    const shuffled = [...array];          <Button onClick={handleSubmit}>Submit Quiz</Button>

              }`}

            >    for (let i = shuffled.length - 1; i > 0; i--) {        ) : (

              <Flag className="w-5 h-5" />

            </button>      const j = Math.floor(Math.random() * (i + 1));          <Button onClick={nextQuestion}>Next</Button>

          </div>

      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];        )}

          <div className="space-y-3">

            {currentQuestion.answers.map((answer, index) => {    }      </div>

              const isSelected = userAnswers[currentQuestion.id] === index;

                  return shuffled;    </div>

              return (

                <button  };  )

                  key={index}

                  onClick={() => handleAnswerSelect(currentQuestion.id, index)}}

                  className={`w-full text-left p-4 rounded-lg border-2 transition-all ${

                    isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300 bg-white'  const handleAnswerSelect = (questionId: string, answerIndex: number) => {

                  }`}    setUserAnswers({ ...userAnswers, [questionId]: answerIndex });

                >  };

                  <div className="flex items-center space-x-3">

                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${  const toggleFlag = (questionId: string) => {

                      isSelected ? 'border-blue-500 bg-blue-500' : 'border-gray-300'    const newFlagged = new Set(flaggedQuestions);

                    }`}>    if (newFlagged.has(questionId)) {

                      {isSelected && <div className="w-3 h-3 rounded-full bg-white"></div>}      newFlagged.delete(questionId);

                    </div>    } else {

                    <span className={isSelected ? 'font-medium text-gray-900' : 'text-gray-700'}>{answer}</span>      newFlagged.add(questionId);

                  </div>    }

                </button>    setFlaggedQuestions(newFlagged);

              );  };

            })}

          </div>  const handleAutoSubmit = async () => {

        </Card>    toast.error('Time is up! Submitting quiz automatically...');

      )}    await handleSubmit();

  };

      <Card className="p-4">

        <div className="flex items-center justify-between">  const handleSubmit = async () => {

          <Button    const unansweredCount = questions.filter((q) => userAnswers[q.id] === undefined).length;

            onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}    

            disabled={currentQuestionIndex === 0}    if (unansweredCount > 0) {

            variant="outline"      const confirmed = confirm(`You have ${unansweredCount} unanswered question(s). Submit anyway?`);

          >      if (!confirmed) return;

            <ChevronLeft className="w-4 h-4 mr-2" />    }

            Previous

          </Button>    setSubmitting(true);



          {currentQuestionIndex === questions.length - 1 ? (    try {

            <Button onClick={handleSubmit} disabled={submitting} className="bg-green-600 hover:bg-green-700">      let correctAnswers = 0;

              {submitting ? 'Submitting...' : 'Submit Quiz'}      const answers = questions.map((q) => ({

            </Button>        question_id: q.id,

          ) : (        user_answer: userAnswers[q.id] ?? -1,

            <Button onClick={() => setCurrentQuestionIndex(Math.min(questions.length - 1, currentQuestionIndex + 1))}>        is_correct: userAnswers[q.id] === q.correct_answer,

              Next <ChevronRight className="w-4 h-4 ml-2" />      }));

            </Button>

          )}      correctAnswers = answers.filter((a) => a.is_correct).length;

        </div>      const score = Math.round((correctAnswers / questions.length) * 100);

      const passed = score >= passingScore;

        <div className="mt-4 pt-4 border-t">

          <p className="text-sm text-gray-600 mb-3">Jump to question:</p>      const response = await fetch('/api/quiz/submit', {

          <div className="grid grid-cols-10 gap-2">        method: 'POST',

            {questions.map((q, index) => {        headers: { 'Content-Type': 'application/json' },

              const isAnswered = userAnswers[q.id] !== undefined;        body: JSON.stringify({ attemptId, quizId, courseId, answers, score, passed }),

              const isCurrent = index === currentQuestionIndex;      });



              return (      if (!response.ok) throw new Error('Failed to submit quiz');

                <button

                  key={q.id}      const data = await response.json();

                  onClick={() => setCurrentQuestionIndex(index)}

                  className={`aspect-square rounded-lg text-sm font-medium transition-all ${      if (timerRef.current) {

                    isCurrent        clearInterval(timerRef.current);

                      ? 'bg-blue-600 text-white'      }

                      : isAnswered

                      ? 'bg-green-100 text-green-700 hover:bg-green-200'      router.push(`/quiz/${quizId}/results/${data.attempt.id}`);

                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'

                  }`}      if (onComplete) {

                >        onComplete(passed, score);

                  {index + 1}      }

                </button>    } catch (error) {

              );      console.error('Failed to submit quiz:', error);

            })}      toast.error('Failed to submit quiz');

          </div>    } finally {

        </div>      setSubmitting(false);

      </Card>    }

    </div>  };

  );

}  const formatTime = (seconds: number): string => {

    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const currentQuestion = questions[currentQuestionIndex];
  const progress = questions.length > 0 ? ((currentQuestionIndex + 1) / questions.length) * 100 : 0;
  const answeredCount = Object.keys(userAnswers).length;

  if (loading) {
    return (
      <Card className="p-12 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading quiz...</p>
      </Card>
    );
  }

  if (!quizStarted) {
    return (
      <Card className="p-8 max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">{quizTitle}</h2>
        
        <div className="space-y-4 mb-8">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-gray-900">Passing Score</p>
              <p className="text-gray-600">{passingScore}% or higher required to pass</p>
            </div>
          </div>

          {timeLimit && (
            <div className="flex items-start space-x-3">
              <Clock className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900">Time Limit</p>
                <p className="text-gray-600">{timeLimit} minutes</p>
              </div>
            </div>
          )}

          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-gray-900">Attempts Remaining</p>
              <p className="text-gray-600">{remainingAttempts} of {maxAttempts} attempts remaining</p>
            </div>
          </div>
        </div>

        <Button onClick={startQuiz} className="w-full">Start Quiz</Button>
      </Card>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{quizTitle}</h2>
            <p className="text-sm text-gray-600">
              Question {currentQuestionIndex + 1} of {questions.length} • {answeredCount} answered
            </p>
          </div>

          {timeRemaining !== null && (
            <div className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
              timeRemaining < 300 ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
            }`}>
              <Clock className="w-5 h-5" />
              <span className="font-mono font-semibold text-lg">{formatTime(timeRemaining)}</span>
            </div>
          )}
        </div>
        <Progress value={progress} className="mt-4 h-2" />
      </Card>

      {currentQuestion && (
        <Card className="p-8">
          <div className="flex items-start justify-between mb-6">
            <h3 className="text-lg font-medium text-gray-900 flex-1">{currentQuestion.question}</h3>
            <button
              onClick={() => toggleFlag(currentQuestion.id)}
              className={`ml-4 p-2 rounded-lg transition-colors ${
                flaggedQuestions.has(currentQuestion.id)
                  ? 'bg-yellow-100 text-yellow-600'
                  : 'bg-gray-100 text-gray-400 hover:text-gray-600'
              }`}
            >
              <Flag className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-3">
            {currentQuestion.answers.map((answer, index) => {
              const isSelected = userAnswers[currentQuestion.id] === index;
              
              return (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(currentQuestion.id, index)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                    isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      isSelected ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
                    }`}>
                      {isSelected && <div className="w-3 h-3 rounded-full bg-white"></div>}
                    </div>
                    <span className={isSelected ? 'font-medium text-gray-900' : 'text-gray-700'}>{answer}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </Card>
      )}

      <Card className="p-4">
        <div className="flex items-center justify-between">
          <Button
            onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
            disabled={currentQuestionIndex === 0}
            variant="outline"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          {currentQuestionIndex === questions.length - 1 ? (
            <Button onClick={handleSubmit} disabled={submitting} className="bg-green-600 hover:bg-green-700">
              {submitting ? 'Submitting...' : 'Submit Quiz'}
            </Button>
          ) : (
            <Button onClick={() => setCurrentQuestionIndex(Math.min(questions.length - 1, currentQuestionIndex + 1))}>
              Next <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>

        <div className="mt-4 pt-4 border-t">
          <p className="text-sm text-gray-600 mb-3">Jump to question:</p>
          <div className="grid grid-cols-10 gap-2">
            {questions.map((q, index) => {
              const isAnswered = userAnswers[q.id] !== undefined;
              const isCurrent = index === currentQuestionIndex;

              return (
                <button
                  key={q.id}
                  onClick={() => setCurrentQuestionIndex(index)}
                  className={`aspect-square rounded-lg text-sm font-medium transition-all ${
                    isCurrent
                      ? 'bg-blue-600 text-white'
                      : isAnswered
                      ? 'bg-green-100 text-green-700 hover:bg-green-200'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {index + 1}
                </button>
              );
            })}
          </div>
        </div>
      </Card>
    </div>
  );
}
