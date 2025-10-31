'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, FileText, Globe } from 'lucide-react';
import toast from 'react-hot-toast';

interface Transcript {
  id: string;
  language_code: string;
  language_name: string;
  transcript_text: string;
  transcript_url?: string;
}

interface LessonTranscriptProps {
  lessonId: string;
  lessonTitle: string;
}

export default function LessonTranscript({ lessonId, lessonTitle }: LessonTranscriptProps) {
  const [transcripts, setTranscripts] = useState<Transcript[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('en');

  useEffect(() => {
    loadTranscripts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lessonId]);

  const loadTranscripts = async () => {
    try {
      const response = await fetch(`/api/transcripts?lessonId=${lessonId}`);
      if (response.ok) {
        const data = await response.json();
        setTranscripts(data.transcripts || []);
        if (data.transcripts && data.transcripts.length > 0) {
          setSelectedLanguage(data.transcripts[0].language_code);
        }
      }
    } catch (error) {
      console.error('Failed to load transcripts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (transcript: Transcript, format: 'txt' | 'pdf') => {
    try {
      if (format === 'txt') {
        // Download as TXT
        const blob = new Blob([transcript.transcript_text], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${lessonTitle}-transcript-${transcript.language_code}.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        toast.success('Transcript downloaded!');
      } else if (format === 'pdf' && transcript.transcript_url) {
        // Download PDF if available
        const link = document.createElement('a');
        link.href = transcript.transcript_url;
        link.download = `${lessonTitle}-transcript-${transcript.language_code}.pdf`;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success('Transcript downloaded!');
      }
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download transcript');
    }
  };

  const selectedTranscript = transcripts.find((t) => t.language_code === selectedLanguage);

  if (loading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </Card>
    );
  }

  if (transcripts.length === 0) {
    return (
      <Card className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          Transcript
        </h3>
        <div className="text-center py-12 text-gray-500">
          <FileText className="w-12 h-12 mx-auto mb-3 text-gray-400" />
          <p>No transcript available for this lesson</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900">Transcript</h3>
        
        <div className="flex items-center space-x-3">
          {/* Language Selector */}
          {transcripts.length > 1 && (
            <div className="flex items-center space-x-2">
              <Globe className="w-4 h-4 text-gray-500" />
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {transcripts.map((transcript) => (
                  <option key={transcript.id} value={transcript.language_code}>
                    {transcript.language_name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Download Buttons */}
          {selectedTranscript && (
            <>
              <Button
                onClick={() => handleDownload(selectedTranscript, 'txt')}
                size="sm"
                variant="outline"
              >
                <Download className="w-4 h-4 mr-2" />
                Download TXT
              </Button>
              
              {selectedTranscript.transcript_url && (
                <Button
                  onClick={() => handleDownload(selectedTranscript, 'pdf')}
                  size="sm"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF
                </Button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Transcript Text */}
      {selectedTranscript && (
        <div className="bg-gray-50 rounded-lg p-6 max-h-[600px] overflow-y-auto">
          <div className="prose max-w-none">
            <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
              {selectedTranscript.transcript_text}
            </p>
          </div>
        </div>
      )}
    </Card>
  );
}
