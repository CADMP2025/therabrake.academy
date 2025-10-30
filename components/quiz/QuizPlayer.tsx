"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Clock, AlertCircle, Flag, ChevronLeft, ChevronRight } from "lucide-react";
import toast from "react-hot-toast";

type QuizQuestion = {
  id: string;
  question: string;
  question_type: "multiple_choice" | "true_false";
  answers: string[];
  correct_answer: number;
};

type QuizPlayerProps = {
  quizId: string;
  courseId: string;
  quizTitle: string;
  passingScore: number;
  timeLimit?: number; // minutes
  maxAttempts?: number;
};

export default function QuizPlayer({
  quizId,
  courseId,
  quizTitle,
  passingScore = 80,
  timeLimit,
  maxAttempts = 3,
}: QuizPlayerProps) {
  const router = useRouter();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [flagged, setFlagged] = useState<Record<string, boolean>>({});
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [remainingAttempts, setRemainingAttempts] = useState<number>(maxAttempts);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [quizStarted, setQuizStarted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // Check attempts left
    (async () => {
      try {
        const res = await fetch(`/api/quiz/attempts?quizId=${quizId}`);
        if (res.ok) {
          const data = await res.json();
          const used = (data.attempts || []).length;
          setRemainingAttempts(Math.max(0, maxAttempts - used));
        }
      } catch (e) {
        // ignore
      } finally {
        setLoading(false);
      }
    })();
  }, [quizId, maxAttempts]);

  useEffect(() => {
    if (!quizStarted || !timeLimit) return;
    setTimeRemaining(timeLimit * 60);
    timerRef.current && clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev === null) return prev;
        if (prev <= 0) return 0;
        const next = prev - 1;
        if (next === 300) toast("⏰ 5 minutes remaining!", { duration: 5000 });
        if (next === 60) toast.error("⏰ 1 minute remaining!", { duration: 5000 });
        if (next <= 0) {
          void handleAutoSubmit();
          return 0;
        }
        return next;
      });
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quizStarted, timeLimit]);

  const startQuiz = async () => {
    if (remainingAttempts <= 0) {
      toast.error("No attempts remaining.");
      return;
    }
    try {
      // Load questions
      const qRes = await fetch(`/api/quiz/questions?quizId=${quizId}`);
      if (!qRes.ok) throw new Error("Failed to load questions");
      const qData = await qRes.json();
      setQuestions(qData.questions || []);

      // Start attempt
      const aRes = await fetch("/api/quiz/attempt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quizId, courseId }),
      });
      if (!aRes.ok) throw new Error("Failed to start attempt");
      const aData = await aRes.json();
      setAttemptId(aData.attempt.id);

      setQuizStarted(true);
      toast.success("Quiz started! Good luck!");
    } catch (e) {
      toast.error("Failed to start quiz");
    }
  };

  const handleAnswerSelect = (questionId: string, answerIndex: number) => {
    setUserAnswers((prev) => ({ ...prev, [questionId]: answerIndex }));
  };

  const toggleFlag = (questionId: string) => {
    setFlagged((prev) => ({ ...prev, [questionId]: !prev[questionId] }));
  };

  const handleAutoSubmit = async () => {
    toast.error("Time is up! Submitting quiz...");
    await handleSubmit();
  };

  const handleSubmit = async () => {
    if (!attemptId) return;
    const unanswered = questions.filter((q) => userAnswers[q.id] === undefined).length;
    if (unanswered > 0) {
      const confirmed = window.confirm(
        `You have ${unanswered} unanswered question(s). Submit anyway?`
      );
      if (!confirmed) return;
    }

    setSubmitting(true);
    try {
      const answers = questions.map((q) => ({
        question_id: q.id,
        user_answer: userAnswers[q.id] ?? -1,
        is_correct: userAnswers[q.id] === q.correct_answer,
      }));
      const correct = answers.filter((a) => a.is_correct).length;
      const score = Math.round((correct / Math.max(1, questions.length)) * 100);
      const passed = score >= passingScore;

      const res = await fetch("/api/quiz/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ attemptId, quizId, courseId, answers, score, passed }),
      });
      if (!res.ok) throw new Error("Submit failed");
      const data = await res.json();
      if (timerRef.current) clearInterval(timerRef.current);
      router.push(`/quiz/${quizId}/results/${data.attempt.id}`);
    } catch (e) {
      toast.error("Failed to submit quiz");
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const current = questions[currentQuestionIndex];
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
            <div className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${timeRemaining < 300 ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-700"}`}>
              <Clock className="w-5 h-5" />
              <span className="font-mono font-semibold text-lg">{formatTime(timeRemaining)}</span>
            </div>
          )}
        </div>
        <Progress value={progress} className="mt-4 h-2" />
      </Card>

      {current && (
        <Card className="p-8">
          <div className="flex items-start justify-between mb-6">
            <h3 className="text-lg font-medium text-gray-900 flex-1">{current.question}</h3>
            <button
              onClick={() => toggleFlag(current.id)}
              className={`ml-4 p-2 rounded-lg transition-colors ${flagged[current.id] ? "bg-yellow-100 text-yellow-600" : "bg-gray-100 text-gray-400 hover:text-gray-600"}`}
            >
              <Flag className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-3">
            {current.answers.map((answer, index) => {
              const isSelected = userAnswers[current.id] === index;
              return (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(current.id, index)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all ${isSelected ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300 bg-white"}`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${isSelected ? "border-blue-500 bg-blue-500" : "border-gray-300"}`}>
                      {isSelected && <div className="w-3 h-3 rounded-full bg-white"></div>}
                    </div>
                    <span className={isSelected ? "font-medium text-gray-900" : "text-gray-700"}>{answer}</span>
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
              {submitting ? "Submitting..." : "Submit Quiz"}
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
                    isCurrent ? "bg-blue-600 text-white" : isAnswered ? "bg-green-100 text-green-700 hover:bg-green-200" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
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

