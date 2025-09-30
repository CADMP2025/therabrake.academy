"use client";
import { useState, useEffect } from "react";

export default function CourseBuilder() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [ceHours, setCeHours] = useState<number>(0);
  
  // Auto-save to localStorage
  useEffect(() => {
    const interval = setInterval(() => {
      localStorage.setItem('course-draft', JSON.stringify({
        title, description, content, ceHours
      }));
    }, 30000);
    return () => clearInterval(interval);
  }, [title, description, content, ceHours]);

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <section className="card space-y-3">
        <h2 className="text-xl font-semibold">Course Details</h2>
        <input 
          className="input" 
          placeholder="Course Title" 
          value={title} 
          onChange={e => setTitle(e.target.value)} 
        />
        <textarea 
          className="input h-32" 
          placeholder="Description" 
          value={description} 
          onChange={e => setDescription(e.target.value)} 
        />
        <input 
          className="input" 
          type="number" 
          step="0.5" 
          placeholder="CE Hours" 
          value={ceHours} 
          onChange={e => setCeHours(Number(e.target.value))} 
        />
      </section>
      
      <section className="card space-y-3">
        <h2 className="text-xl font-semibold">Paste Content</h2>
        <textarea 
          className="input h-64" 
          placeholder="Paste your course content here..."
          value={content} 
          onChange={e => setContent(e.target.value)} 
        />
        <button className="button">Save Course</button>
      </section>
    </div>
  );
}
