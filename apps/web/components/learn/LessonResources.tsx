'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, FileText, File, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';

interface Resource {
  id: string;
  title: string;
  description?: string;
  file_url: string;
  file_type: string;
  file_size?: number;
  downloadable: boolean;
}

interface LessonResourcesProps {
  lessonId: string;
  courseId: string;
}

export default function LessonResources({ lessonId, courseId }: LessonResourcesProps) {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadResources();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lessonId]);

  const loadResources = async () => {
    try {
      const response = await fetch(`/api/resources?lessonId=${lessonId}`);
      if (response.ok) {
        const data = await response.json();
        setResources(data.resources || []);
      }
    } catch (error) {
      console.error('Failed to load resources:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (resource: Resource) => {
    try {
      // Track download
      await fetch('/api/resources/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resourceId: resource.id,
          lessonId,
          courseId,
        }),
      });

      // Download file
      const link = document.createElement('a');
      link.href = resource.file_url;
      link.download = resource.title;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success('Download started!');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download resource');
    }
  };

  const handleView = (resource: Resource) => {
    window.open(resource.file_url, '_blank');
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.includes('pdf')) {
      return <FileText className="w-8 h-8 text-red-500" />;
    } else if (fileType.includes('doc')) {
      return <FileText className="w-8 h-8 text-blue-500" />;
    } else if (fileType.includes('xls') || fileType.includes('sheet')) {
      return <FileText className="w-8 h-8 text-green-500" />;
    } else if (fileType.includes('image')) {
      return <File className="w-8 h-8 text-purple-500" />;
    }
    return <File className="w-8 h-8 text-gray-500" />;
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'Unknown size';
    
    const kb = bytes / 1024;
    if (kb < 1024) {
      return `${kb.toFixed(1)} KB`;
    }
    
    const mb = kb / 1024;
    return `${mb.toFixed(1)} MB`;
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

  if (resources.length === 0) {
    return (
      <Card className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          Course Resources
        </h3>
        <div className="text-center py-12 text-gray-500">
          <FileText className="w-12 h-12 mx-auto mb-3 text-gray-400" />
          <p>No resources available for this lesson</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">
        Course Resources
      </h3>

      <div className="space-y-4">
        {resources.map((resource) => (
          <div
            key={resource.id}
            className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {/* File Icon */}
            <div className="flex-shrink-0">
              {getFileIcon(resource.file_type)}
            </div>

            {/* Resource Info */}
            <div className="flex-grow min-w-0">
              <h4 className="text-base font-medium text-gray-900 truncate">
                {resource.title}
              </h4>
              
              {resource.description && (
                <p className="text-sm text-gray-600 mt-1">
                  {resource.description}
                </p>
              )}
              
              <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                <span className="uppercase">{resource.file_type}</span>
                <span>•</span>
                <span>{formatFileSize(resource.file_size)}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex-shrink-0 flex items-center space-x-2">
              <Button
                onClick={() => handleView(resource)}
                variant="outline"
                size="sm"
                className="whitespace-nowrap"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                View
              </Button>
              
              {resource.downloadable && (
                <Button
                  onClick={() => handleDownload(resource)}
                  size="sm"
                  className="whitespace-nowrap"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Download All Button */}
      {resources.length > 1 && resources.some((r) => r.downloadable) && (
        <div className="mt-6 pt-6 border-t">
          <Button
            onClick={() => {
              resources.forEach((resource) => {
                if (resource.downloadable) {
                  handleDownload(resource);
                }
              });
            }}
            variant="outline"
            className="w-full"
          >
            <Download className="w-4 h-4 mr-2" />
            Download All Resources
          </Button>
        </div>
      )}
    </Card>
  );
}
