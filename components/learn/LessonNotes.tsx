'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Edit2, Trash2, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

interface Note {
  id: string;
  content: string;
  timestamp: number;
  created_at: string;
  updated_at: string;
}

interface LessonNotesProps {
  lessonId: string;
  courseId: string;
  currentVideoTime?: number;
  onSeekTo?: (time: number) => void;
}

export default function LessonNotes({
  lessonId,
  courseId,
  currentVideoTime = 0,
  onSeekTo,
}: LessonNotesProps) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingNote, setEditingNote] = useState<string | null>(null);
  const [noteContent, setNoteContent] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    loadNotes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lessonId]);

  const loadNotes = async () => {
    try {
      const response = await fetch(`/api/notes?lessonId=${lessonId}`);
      if (response.ok) {
        const data = await response.json();
        setNotes(data.notes || []);
      }
    } catch (error) {
      console.error('Failed to load notes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddNote = async () => {
    if (!noteContent.trim()) {
      toast.error('Note content cannot be empty');
      return;
    }

    try {
      const response = await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lessonId,
          courseId,
          content: noteContent,
          timestamp: Math.floor(currentVideoTime),
        }),
      });

      if (!response.ok) throw new Error('Failed to add note');

      const { note } = await response.json();
      setNotes([...notes, note]);
      setNoteContent('');
      setIsAdding(false);
      toast.success('Note added!');
    } catch (error) {
      console.error('Failed to add note:', error);
      toast.error('Failed to add note');
    }
  };

  const handleUpdateNote = async (noteId: string) => {
    if (!noteContent.trim()) {
      toast.error('Note content cannot be empty');
      return;
    }

    try {
      const response = await fetch('/api/notes', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          noteId,
          content: noteContent,
        }),
      });

      if (!response.ok) throw new Error('Failed to update note');

      const { note } = await response.json();
      setNotes(notes.map((n) => (n.id === noteId ? note : n)));
      setEditingNote(null);
      setNoteContent('');
      toast.success('Note updated!');
    } catch (error) {
      console.error('Failed to update note:', error);
      toast.error('Failed to update note');
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    if (!confirm('Are you sure you want to delete this note?')) return;

    try {
      const response = await fetch(`/api/notes?noteId=${noteId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete note');

      setNotes(notes.filter((n) => n.id !== noteId));
      toast.success('Note deleted!');
    } catch (error) {
      console.error('Failed to delete note:', error);
      toast.error('Failed to delete note');
    }
  };

  const startEditing = (note: Note) => {
    setEditingNote(note.id);
    setNoteContent(note.content);
    setIsAdding(false);
  };

  const cancelEditing = () => {
    setEditingNote(null);
    setNoteContent('');
    setIsAdding(false);
  };

  const formatTimestamp = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hours > 0) {
      return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-20 bg-gray-200 rounded"></div>
          <div className="h-20 bg-gray-200 rounded"></div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900">My Notes</h3>
        {!isAdding && !editingNote && (
          <Button onClick={() => setIsAdding(true)} size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Note
          </Button>
        )}
      </div>

      {/* Add/Edit Note Form */}
      {(isAdding || editingNote) && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <textarea
            value={noteContent}
            onChange={(e) => setNoteContent(e.target.value)}
            placeholder="Write your note here..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows={4}
            autoFocus
          />
          
          {isAdding && (
            <div className="flex items-center text-sm text-gray-600 mt-2 mb-3">
              <Clock className="w-4 h-4 mr-1" />
              Note will be timestamped at {formatTimestamp(currentVideoTime)}
            </div>
          )}

          <div className="flex items-center space-x-2 mt-3">
            <Button
              onClick={() => {
                if (editingNote) {
                  handleUpdateNote(editingNote);
                } else {
                  handleAddNote();
                }
              }}
              size="sm"
            >
              {editingNote ? 'Update' : 'Save'}
            </Button>
            <Button onClick={cancelEditing} variant="outline" size="sm">
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Notes List */}
      {notes.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p>No notes yet. Add your first note to remember key points!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {notes
            .sort((a, b) => a.timestamp - b.timestamp)
            .map((note) => (
              <div
                key={note.id}
                className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <button
                    onClick={() => onSeekTo && onSeekTo(note.timestamp)}
                    className="flex items-center text-blue-600 hover:text-blue-700 font-medium text-sm"
                  >
                    <Clock className="w-4 h-4 mr-1" />
                    {formatTimestamp(note.timestamp)}
                  </button>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => startEditing(note)}
                      className="text-gray-500 hover:text-blue-600 transition"
                      aria-label="Edit note"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteNote(note.id)}
                      className="text-gray-500 hover:text-red-600 transition"
                      aria-label="Delete note"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <p className="text-gray-700 whitespace-pre-wrap">{note.content}</p>
                
                <div className="mt-2 text-xs text-gray-500">
                  {new Date(note.created_at).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                  {note.updated_at !== note.created_at && ' (edited)'}
                </div>
              </div>
            ))}
        </div>
      )}
    </Card>
  );
}
