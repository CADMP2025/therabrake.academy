'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Minimize,
  Settings,
  SkipForward,
  SkipBack,
  Subtitles,
  PictureInPicture,
  Gauge
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from '@/components/ui/dropdown-menu';
import toast from 'react-hot-toast';

interface EnhancedVideoPlayerProps {
  videoUrl: string;
  lessonId: string;
  courseId: string;
  subtitles?: Array<{
    label: string;
    src: string;
    srclang: string;
  }>;
  onProgress?: (progress: number) => void;
  onComplete?: () => void;
  autoAdvance?: boolean;
}

const PLAYBACK_SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];
const SKIP_SECONDS = 10;

export default function EnhancedVideoPlayer({
  videoUrl,
  lessonId,
  courseId,
  subtitles = [],
  onProgress,
  onComplete,
  autoAdvance = false,
}: EnhancedVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout>();
  const inactivityTimerRef = useRef<NodeJS.Timeout>();

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [progress, setProgress] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeSubtitle, setActiveSubtitle] = useState<number | null>(null);
  const [quality, setQuality] = useState('auto');
  const [loading, setLoading] = useState(true);
  const [isSeeking, setIsSeeking] = useState(false);
  const [lastSavedPosition, setLastSavedPosition] = useState(0);

  // Load saved progress on mount
  useEffect(() => {
    loadSavedProgress();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lessonId]);

  // Load saved progress
  const loadSavedProgress = async () => {
    try {
      const response = await fetch(`/api/progress/video?lessonId=${lessonId}`);
      if (response.ok) {
        const data = await response.json();
        if (data.lastPosition > 0 && videoRef.current) {
          videoRef.current.currentTime = data.lastPosition;
          setLastSavedPosition(data.lastPosition);
          
          // Show toast asking if user wants to resume
          if (data.lastPosition > 30) {
            toast((t) => (
              <div className="flex items-center gap-3">
                <span>Resume from where you left off?</span>
                <Button
                  size="sm"
                  onClick={() => {
                    if (videoRef.current) {
                      videoRef.current.currentTime = data.lastPosition;
                    }
                    toast.dismiss(t.id);
                  }}
                >
                  Resume
                </Button>
              </div>
            ), { duration: 5000 });
          }
        }
      }
    } catch (error) {
      console.error('Failed to load saved progress:', error);
    }
  };

  // Save progress periodically
  useEffect(() => {
    if (isPlaying) {
      progressIntervalRef.current = setInterval(() => {
        saveProgress();
      }, 10000); // Save every 10 seconds
    }

    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying, currentTime]);

  // Save progress function
  const saveProgress = async () => {
    if (Math.abs(currentTime - lastSavedPosition) < 5) return; // Only save if moved significantly

    try {
      await fetch('/api/progress/video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lessonId,
          courseId,
          lastPosition: Math.floor(currentTime),
          timeSpent: Math.floor(currentTime),
          progress: Math.floor((currentTime / duration) * 100),
        }),
      });
      setLastSavedPosition(currentTime);
    } catch (error) {
      console.error('Failed to save progress:', error);
    }
  };

  // Video event handlers
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      const progressPercent = (video.currentTime / video.duration) * 100;
      setProgress(progressPercent);
      
      if (onProgress) {
        onProgress(progressPercent);
      }

      // Check if video is nearly complete (98%)
      if (progressPercent >= 98 && !isSeeking) {
        handleVideoComplete();
      }
    };

    const handleDurationChange = () => {
      setDuration(video.duration);
      setLoading(false);
    };

    const handleProgress = () => {
      if (video.buffered.length > 0) {
        const bufferedEnd = video.buffered.end(video.buffered.length - 1);
        const bufferedPercent = (bufferedEnd / video.duration) * 100;
        setBuffered(bufferedPercent);
      }
    };

    const handleLoadStart = () => setLoading(true);
    const handleCanPlay = () => setLoading(false);
    const handleWaiting = () => setLoading(true);
    const handlePlaying = () => setLoading(false);

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('durationchange', handleDurationChange);
    video.addEventListener('progress', handleProgress);
    video.addEventListener('loadstart', handleLoadStart);
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('waiting', handleWaiting);
    video.addEventListener('playing', handlePlaying);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('durationchange', handleDurationChange);
      video.removeEventListener('progress', handleProgress);
      video.removeEventListener('loadstart', handleLoadStart);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('waiting', handleWaiting);
      video.removeEventListener('playing', handlePlaying);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [duration, isSeeking]);

  // Handle video completion
  const handleVideoComplete = useCallback(async () => {
    try {
      await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lessonId,
          courseId,
          completed: true,
          timeSpent: Math.floor(duration),
        }),
      });

      if (onComplete) {
        onComplete();
      }

      if (autoAdvance) {
        toast.success('Lesson completed! Moving to next lesson...');
      } else {
        toast.success('Lesson completed!');
      }
    } catch (error) {
      console.error('Failed to mark video complete:', error);
    }
  }, [lessonId, courseId, duration, onComplete, autoAdvance]);

  // Fullscreen handling
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!videoRef.current) return;

      // Don't trigger if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (e.key.toLowerCase()) {
        case ' ':
        case 'k':
          e.preventDefault();
          togglePlay();
          break;
        case 'f':
          e.preventDefault();
          toggleFullscreen();
          break;
        case 'm':
          e.preventDefault();
          toggleMute();
          break;
        case 'arrowleft':
          e.preventDefault();
          skipBackward();
          break;
        case 'arrowright':
          e.preventDefault();
          skipForward();
          break;
        case 'arrowup':
          e.preventDefault();
          adjustVolume(0.1);
          break;
        case 'arrowdown':
          e.preventDefault();
          adjustVolume(-0.1);
          break;
        case 'j':
          e.preventDefault();
          skipBackward();
          break;
        case 'l':
          e.preventDefault();
          skipForward();
          break;
        case ',':
          if (videoRef.current.paused) {
            e.preventDefault();
            frameBackward();
          }
          break;
        case '.':
          if (videoRef.current.paused) {
            e.preventDefault();
            frameForward();
          }
          break;
        case '>':
          e.preventDefault();
          increaseSpeed();
          break;
        case '<':
          e.preventDefault();
          decreaseSpeed();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying, volume, playbackSpeed]);

  // Auto-hide controls
  useEffect(() => {
    const resetInactivityTimer = () => {
      setShowControls(true);
      
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }

      if (isPlaying && isFullscreen) {
        inactivityTimerRef.current = setTimeout(() => {
          setShowControls(false);
        }, 3000);
      }
    };

    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('mousemove', resetInactivityTimer);
    container.addEventListener('touchstart', resetInactivityTimer);

    return () => {
      container.removeEventListener('mousemove', resetInactivityTimer);
      container.removeEventListener('touchstart', resetInactivityTimer);
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }
    };
  }, [isPlaying, isFullscreen]);

  // Control functions
  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
      saveProgress(); // Save when pausing
    } else {
      video.play();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const adjustVolume = (delta: number) => {
    const video = videoRef.current;
    if (!video) return;

    const newVolume = Math.max(0, Math.min(1, volume + delta));
    video.volume = newVolume;
    setVolume(newVolume);
    
    if (newVolume === 0) {
      setIsMuted(true);
    } else if (isMuted) {
      setIsMuted(false);
      video.muted = false;
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    const video = videoRef.current;
    if (!video) return;

    video.volume = newVolume;
    setVolume(newVolume);
    
    if (newVolume === 0) {
      setIsMuted(true);
    } else if (isMuted) {
      setIsMuted(false);
      video.muted = false;
    }
  };

  const toggleFullscreen = async () => {
    const container = containerRef.current;
    if (!container) return;

    try {
      if (!document.fullscreenElement) {
        await container.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (error) {
      console.error('Fullscreen error:', error);
      toast.error('Fullscreen not supported');
    }
  };

  const togglePictureInPicture = async () => {
    const video = videoRef.current;
    if (!video) return;

    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      } else {
        await video.requestPictureInPicture();
      }
    } catch (error) {
      console.error('Picture-in-picture error:', error);
      toast.error('Picture-in-picture not supported');
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;

    const newTime = (parseFloat(e.target.value) / 100) * duration;
    video.currentTime = newTime;
    setProgress(parseFloat(e.target.value));
    setIsSeeking(false);
  };

  const handleSeekStart = () => {
    setIsSeeking(true);
  };

  const skipForward = () => {
    const video = videoRef.current;
    if (!video) return;

    video.currentTime = Math.min(video.duration, video.currentTime + SKIP_SECONDS);
    toast(`+${SKIP_SECONDS}s`, { duration: 800, icon: '⏩' });
  };

  const skipBackward = () => {
    const video = videoRef.current;
    if (!video) return;

    video.currentTime = Math.max(0, video.currentTime - SKIP_SECONDS);
    toast(`-${SKIP_SECONDS}s`, { duration: 800, icon: '⏪' });
  };

  const frameForward = () => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = Math.min(video.duration, video.currentTime + 1/30);
  };

  const frameBackward = () => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = Math.max(0, video.currentTime - 1/30);
  };

  const changePlaybackSpeed = (speed: number) => {
    const video = videoRef.current;
    if (!video) return;

    video.playbackRate = speed;
    setPlaybackSpeed(speed);
    toast(`Speed: ${speed}x`, { duration: 1000, icon: <Gauge className="w-4 h-4" /> });
  };

  const increaseSpeed = () => {
    const currentIndex = PLAYBACK_SPEEDS.indexOf(playbackSpeed);
    if (currentIndex < PLAYBACK_SPEEDS.length - 1) {
      changePlaybackSpeed(PLAYBACK_SPEEDS[currentIndex + 1]);
    }
  };

  const decreaseSpeed = () => {
    const currentIndex = PLAYBACK_SPEEDS.indexOf(playbackSpeed);
    if (currentIndex > 0) {
      changePlaybackSpeed(PLAYBACK_SPEEDS[currentIndex - 1]);
    }
  };

  const toggleSubtitle = (index: number) => {
    const video = videoRef.current;
    if (!video) return;

    const tracks = video.textTracks;
    
    // Disable all tracks first
    for (let i = 0; i < tracks.length; i++) {
      tracks[i].mode = 'hidden';
    }

    // Enable selected track
    if (activeSubtitle === index) {
      setActiveSubtitle(null);
    } else {
      tracks[index].mode = 'showing';
      setActiveSubtitle(index);
    }
  };

  const formatTime = (seconds: number) => {
    if (!isFinite(seconds)) return '0:00';
    
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hours > 0) {
      return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div 
      ref={containerRef}
      className={`relative bg-black rounded-lg overflow-hidden group ${
        isFullscreen ? 'w-screen h-screen' : 'w-full aspect-video'
      }`}
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        src={videoUrl}
        className="w-full h-full"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onClick={togglePlay}
        playsInline
      >
        {subtitles.map((subtitle, index) => (
          <track
            key={index}
            kind="subtitles"
            src={subtitle.src}
            srcLang={subtitle.srclang}
            label={subtitle.label}
          />
        ))}
      </video>

      {/* Loading Spinner */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white"></div>
        </div>
      )}

      {/* Center Play Button */}
      {!isPlaying && !loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <button
            onClick={togglePlay}
            className="bg-white/20 hover:bg-white/30 rounded-full p-6 transition-all transform hover:scale-110"
          >
            <Play className="w-16 h-16 text-white" fill="white" />
          </button>
        </div>
      )}

      {/* Controls Overlay */}
      <div 
        className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent transition-opacity duration-300 ${
          showControls || !isPlaying ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {/* Progress Bar */}
        <div className="px-4 pt-6">
          <div className="relative group/progress">
            {/* Buffered Progress */}
            <div className="absolute w-full h-1 bg-white/20 rounded-full">
              <div 
                className="h-full bg-white/40 rounded-full transition-all"
                style={{ width: `${buffered}%` }}
              />
            </div>
            
            {/* Seek Bar */}
            <input
              type="range"
              min="0"
              max="100"
              value={progress}
              onChange={handleSeek}
              onMouseDown={handleSeekStart}
              onTouchStart={handleSeekStart}
              className="relative w-full h-1 cursor-pointer appearance-none bg-transparent
                [&::-webkit-slider-thumb]:appearance-none
                [&::-webkit-slider-thumb]:w-3
                [&::-webkit-slider-thumb]:h-3
                [&::-webkit-slider-thumb]:rounded-full
                [&::-webkit-slider-thumb]:bg-blue-500
                [&::-webkit-slider-thumb]:opacity-0
                group-hover/progress:[&::-webkit-slider-thumb]:opacity-100
                [&::-webkit-slider-thumb]:transition-opacity
                [&::-moz-range-thumb]:w-3
                [&::-moz-range-thumb]:h-3
                [&::-moz-range-thumb]:rounded-full
                [&::-moz-range-thumb]:bg-blue-500
                [&::-moz-range-thumb]:border-0
                [&::-moz-range-thumb]:opacity-0
                group-hover/progress:[&::-moz-range-thumb]:opacity-100
              "
              style={{
                background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${progress}%, transparent ${progress}%, transparent 100%)`
              }}
            />
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex items-center justify-between text-white px-4 py-3">
          <div className="flex items-center space-x-3">
            {/* Play/Pause */}
            <button 
              onClick={togglePlay} 
              className="hover:text-blue-400 transition"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <Pause className="w-6 h-6" />
              ) : (
                <Play className="w-6 h-6" fill="currentColor" />
              )}
            </button>

            {/* Skip Backward */}
            <button 
              onClick={skipBackward}
              className="hover:text-blue-400 transition"
              aria-label="Skip backward 10 seconds"
            >
              <SkipBack className="w-5 h-5" />
            </button>

            {/* Skip Forward */}
            <button 
              onClick={skipForward}
              className="hover:text-blue-400 transition"
              aria-label="Skip forward 10 seconds"
            >
              <SkipForward className="w-5 h-5" />
            </button>

            {/* Volume */}
            <div className="flex items-center space-x-2 group/volume">
              <button 
                onClick={toggleMute}
                className="hover:text-blue-400 transition"
                aria-label={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="w-6 h-6" />
                ) : (
                  <Volume2 className="w-6 h-6" />
                )}
              </button>
              
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={handleVolumeChange}
                className="w-0 group-hover/volume:w-20 transition-all cursor-pointer appearance-none h-1 bg-white/20 rounded-full
                  [&::-webkit-slider-thumb]:appearance-none
                  [&::-webkit-slider-thumb]:w-3
                  [&::-webkit-slider-thumb]:h-3
                  [&::-webkit-slider-thumb]:rounded-full
                  [&::-webkit-slider-thumb]:bg-white
                  [&::-moz-range-thumb]:w-3
                  [&::-moz-range-thumb]:h-3
                  [&::-moz-range-thumb]:rounded-full
                  [&::-moz-range-thumb]:bg-white
                  [&::-moz-range-thumb]:border-0
                "
              />
            </div>

            {/* Time Display */}
            <span className="text-sm tabular-nums">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          <div className="flex items-center space-x-3">
            {/* Subtitles */}
            {subtitles.length > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button 
                    className="hover:text-blue-400 transition"
                    aria-label="Subtitles"
                  >
                    <Subtitles className="w-5 h-5" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setActiveSubtitle(null)}>
                    Off
                  </DropdownMenuItem>
                  {subtitles.map((subtitle, index) => (
                    <DropdownMenuItem
                      key={index}
                      onClick={() => toggleSubtitle(index)}
                      className={activeSubtitle === index ? 'bg-blue-500/20' : ''}
                    >
                      {subtitle.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* Settings (Speed, Quality) */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button 
                  className="hover:text-blue-400 transition"
                  aria-label="Settings"
                >
                  <Settings className="w-5 h-5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {/* Playback Speed */}
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    Speed: {playbackSpeed}x
                  </DropdownMenuSubTrigger>
                  <DropdownMenuSubContent>
                    {PLAYBACK_SPEEDS.map((speed) => (
                      <DropdownMenuItem
                        key={speed}
                        onClick={() => changePlaybackSpeed(speed)}
                        className={playbackSpeed === speed ? 'bg-blue-500/20' : ''}
                      >
                        {speed}x {speed === 1 && '(Normal)'}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuSubContent>
                </DropdownMenuSub>

                {/* Quality */}
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    Quality: {quality}
                  </DropdownMenuSubTrigger>
                  <DropdownMenuSubContent>
                    <DropdownMenuItem
                      onClick={() => setQuality('auto')}
                      className={quality === 'auto' ? 'bg-blue-500/20' : ''}
                    >
                      Auto
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setQuality('1080p')}
                      className={quality === '1080p' ? 'bg-blue-500/20' : ''}
                    >
                      1080p
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setQuality('720p')}
                      className={quality === '720p' ? 'bg-blue-500/20' : ''}
                    >
                      720p
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setQuality('480p')}
                      className={quality === '480p' ? 'bg-blue-500/20' : ''}
                    >
                      480p
                    </DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Picture-in-Picture */}
            <button 
              onClick={togglePictureInPicture}
              className="hover:text-blue-400 transition"
              aria-label="Picture-in-picture"
            >
              <PictureInPicture className="w-5 h-5" />
            </button>

            {/* Fullscreen */}
            <button 
              onClick={toggleFullscreen}
              className="hover:text-blue-400 transition"
              aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
            >
              {isFullscreen ? (
                <Minimize className="w-5 h-5" />
              ) : (
                <Maximize className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Keyboard Shortcuts Help (Show on hover in bottom right) */}
      <div className="absolute bottom-20 right-4 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        <div className="bg-black/80 text-white text-xs p-3 rounded-lg space-y-1 max-w-xs">
          <div className="font-semibold mb-2">Keyboard Shortcuts</div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1">
            <span>Space/K:</span><span>Play/Pause</span>
            <span>←/J:</span><span>-10s</span>
            <span>→/L:</span><span>+10s</span>
            <span>↑:</span><span>Volume Up</span>
            <span>↓:</span><span>Volume Down</span>
            <span>F:</span><span>Fullscreen</span>
            <span>M:</span><span>Mute</span>
            <span>&gt;/&lt;:</span><span>Speed</span>
          </div>
        </div>
      </div>
    </div>
  );
}
