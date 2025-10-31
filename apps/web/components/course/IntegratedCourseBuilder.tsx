"use client";
import { useState } from 'react';
import { TipTapEditor } from './TipTapEditor';
import { CERequirements } from './CERequirements';
import { EnhancedQuizBuilder } from './EnhancedQuizBuilder';
import { parseRichContent } from '@/lib/parsers/content-parser';

export function IntegratedCourseBuilder() {
  const [course, setCourse] = useState({
    title: '',
    description: '',
    ce_hours: 1,
    provider_number: '',
    requires_quiz: true,
    passing_score: 70
  });
  
  const [content, setContent] = useState('');
  const [modules, setModules] = useState<any[]>([]);
  const [quiz, setQuiz] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);
  
  const handleContentChange = ({ html }: { html: string; json: any }) => {
    setContent(html);
    const parsed = parseRichContent(html);
    setModules(parsed);
  };
  
  const updateCourse = (updates: any) => {
    setCourse(prev => ({ ...prev, ...updates }));
  };
  
  const saveCourse = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...course,
          content,
          modules,
          quiz
        })
      });
      
      if (response.ok) {
        const { courseId } = await response.json();
        alert(`Course created successfully! ID: ${courseId}`);
      }
    } catch (error) {
      console.error('Save error:', error);
      alert('Failed to save course');
    } finally {
      setSaving(false);
    }
  };
  
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Cut & Paste Course Builder</h1>
        <button 
          onClick={saveCourse} 
          disabled={saving}
          className="button"
        >
          {saving ? 'Saving...' : 'Save Course'}
        </button>
      </div>
      
      {/* Main Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left: Course Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Course Information</h2>
            <div className="space-y-3">
              <input
                className="input"
                placeholder="Course Title"
                value={course.title}
                onChange={(e) => updateCourse({ title: e.target.value })}
              />
              <textarea
                className="input h-32"
                placeholder="Course Description"
                value={course.description}
                onChange={(e) => updateCourse({ description: e.target.value })}
              />
            </div>
          </div>
          
          {/* Content Editor */}
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Course Content</h2>
            <TipTapEditor 
              content={content}
              onContentChange={handleContentChange}
            />
            
            {/* Parsed Modules Preview */}
            {modules.length > 0 && (
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium mb-2">Detected Modules:</p>
                <ul className="space-y-1">
                  {modules.map((m, idx) => (
                    <li key={idx} className="text-sm text-gray-600">
                      ✓ {m.title} ({m.lessons?.length || 0} lessons)
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
        
        {/* Right: CE Requirements */}
        <div className="space-y-6">
          <CERequirements 
            course={course}
            onUpdate={updateCourse}
          />
        </div>
      </div>
      
      {/* Quiz Builder */}
      <div className="card">
        <EnhancedQuizBuilder 
          quiz={quiz}
          onUpdate={setQuiz}
        />
      </div>
    </div>
  );
}
