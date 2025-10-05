"use client";
import { useState } from 'react';

interface Question {
  id: string;
  question: string;
  type: 'multiple_choice';
  answers: string[];
  correct: number;
  explanation: string;
  points: number;
}

interface EnhancedQuizBuilderProps {
  quiz: Question[];
  onUpdate: (quiz: Question[]) => void;
}

export function EnhancedQuizBuilder({ quiz, onUpdate }: EnhancedQuizBuilderProps) {
  const [validationError, setValidationError] = useState<string>('');

  const addQuestion = () => {
    const newQuestion: Question = {
      id: crypto.randomUUID(),
      question: '',
      type: 'multiple_choice',
      answers: ['', '', '', ''],
      correct: 0,
      explanation: '',
      points: 1
    };
    onUpdate([...quiz, newQuestion]);
  };

  const updateQuestion = (id: string, updates: Partial<Question>) => {
    onUpdate(quiz.map(q => q.id === id ? { ...q, ...updates } : q));
  };

  const validateQuiz = () => {
    if (quiz.length < 10) {
      setValidationError('CE courses require minimum 10 questions');
      return false;
    }
    
    for (const q of quiz) {
      if (!q.question || q.answers.some(a => !a)) {
        setValidationError('All questions must be complete');
        return false;
      }
    }
    
    setValidationError('');
    return true;
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">
          Quiz Questions ({quiz.length}/10 minimum)
        </h3>
        <button onClick={addQuestion} className="button">
          Add Question
        </button>
      </div>
      
      {validationError && (
        <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm">
          {validationError}
        </div>
      )}
      
      <div className="space-y-4">
        {quiz.map((q, idx) => (
          <div key={q.id} className="card">
            <div className="mb-3">
              <label className="text-sm font-medium">Question {idx + 1}</label>
              <input
                className="input mt-1"
                value={q.question}
                onChange={(e) => updateQuestion(q.id, { question: e.target.value })}
                placeholder="Enter question..."
              />
            </div>
            
            <div className="grid md:grid-cols-2 gap-2">
              {q.answers.map((answer, ansIdx) => (
                <div key={ansIdx} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name={`correct-${q.id}`}
                    checked={q.correct === ansIdx}
                    onChange={() => updateQuestion(q.id, { correct: ansIdx })}
                  />
                  <input
                    className="input"
                    value={answer}
                    onChange={(e) => {
                      const newAnswers = [...q.answers];
                      newAnswers[ansIdx] = e.target.value;
                      updateQuestion(q.id, { answers: newAnswers });
                    }}
                    placeholder={`Answer ${ansIdx + 1}`}
                  />
                </div>
              ))}
            </div>
            
            <div className="mt-3">
              <label className="text-sm font-medium">Explanation (optional)</label>
              <textarea
                className="input mt-1 h-20"
                value={q.explanation}
                onChange={(e) => updateQuestion(q.id, { explanation: e.target.value })}
                placeholder="Explain why this answer is correct..."
              />
            </div>
          </div>
        ))}
      </div>
      
      <button 
        onClick={validateQuiz}
        className="button w-full"
      >
        Validate Quiz for CE Compliance
      </button>
    </div>
  );
}
