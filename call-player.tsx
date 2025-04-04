src/components/ui/call-player.tsx






"use client"

import * as React from "react"
import { Play, Pause, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"

interface CallPlayerProps {
  recordingUrl?: string;
  callLength: string;  // Format: "XXm YYs" (e.g. "18m 45s")
  onError?: (error: string) => void;
}

export function CallPlayer({ 
  recordingUrl = "", 
  callLength,
  onError
}: CallPlayerProps) {
  const [isPlaying, setIsPlaying] = React.useState(false)
  const [progress, setProgress] = React.useState(0)
  const [isDragging, setIsDragging] = React.useState(false)
  const [playbackRate, setPlaybackRate] = React.useState(1)
  const [duration, setDuration] = React.useState(4) // Default duration in seconds
  const [error, setError] = React.useState<string | null>(null)
  const audioRef = React.useRef<HTMLAudioElement | null>(null)

  // Parse duration in seconds from callLength (format: "15m 30s" or similar)
  React.useEffect(() => {
    if (callLength) {
      try {
        let totalSeconds = 0;
        // Parse format like "18m 45s"
        const parts = callLength.split(' ');
        for (const part of parts) {
          if (part.endsWith('m')) {
            totalSeconds += parseInt(part) * 60;
          } else if (part.endsWith('s')) {
            totalSeconds += parseInt(part);
          }
        }
        
        // If we got a valid duration, set it
        if (totalSeconds > 0) {
          setDuration(totalSeconds);
        }
      } catch (error) {
        console.error("Error parsing call length:", error);
      }
    }
  }, [callLength]);

  React.useEffect(() => {
    // Create audio element if we have a URL
    if (recordingUrl) {
      const audio = new Audio(recordingUrl);
      audioRef.current = audio;
      
      // Immediately set playback rate to match current state
      try {
        audio.playbackRate = playbackRate;
      } catch (error) {
        console.error("Error setting initial playback rate:", error);
      }
      
      const handleError = (e: Event) => {
        const audioElement = e.target as HTMLAudioElement;
        let errorMessage = 'Error loading audio';
        
        if (audioElement.error) {
          switch (audioElement.error.code) {
            case 1:
              errorMessage = 'Audio playback was aborted';
              break;
            case 2:
              errorMessage = 'Network error while loading audio';
              break;
            case 3:
              errorMessage = 'Audio decoding error';
              break;
            case 4:
              errorMessage = 'Audio format not supported';
              break;
          }
        }
        
        setError(errorMessage);
        onError?.(errorMessage);
        setIsPlaying(false);
      };
      
      // Add handler for rate change events
      const handleRateChange = () => {
        // Update state if the rate was changed externally
        if (audioRef.current && audioRef.current.playbackRate !== playbackRate) {
          console.log(`Playback rate changed externally to ${audioRef.current.playbackRate}x`);
          setPlaybackRate(audioRef.current.playbackRate);
        }
      };
      
      // Set up event listeners
      audio.addEventListener('loadedmetadata', () => {
        setError(null);
        setDuration(audio.duration);
        
        // Re-apply playback rate after metadata is loaded
        try {
          audio.playbackRate = playbackRate;
          console.log(`Audio loaded, playback rate set to ${playbackRate}x`);
        } catch (error) {
          console.error("Error setting playback rate after load:", error);
        }
      });
      
      audio.addEventListener('timeupdate', () => {
        if (!isDragging) {
          const percentage = (audio.currentTime / audio.duration) * 100;
          setProgress(percentage);
        }
      });
      
      audio.addEventListener('ended', () => {
        setIsPlaying(false);
        setProgress(100);
      });

      audio.addEventListener('error', handleError);
      
      // Listen for rate changes
      audio.addEventListener('ratechange', handleRateChange);
      
      return () => {
        // Clean up when component unmounts
        audio.pause();
        audio.removeEventListener('loadedmetadata', () => {});
        audio.removeEventListener('timeupdate', () => {});
        audio.removeEventListener('ended', () => {});
        audio.removeEventListener('error', handleError);
        audio.removeEventListener('ratechange', handleRateChange);
      };
    }
  }, [recordingUrl]);
  
  // Update playback rate when it changes
  React.useEffect(() => {
    if (audioRef.current) {
      const wasPlaying = !audioRef.current.paused;
      const currentTime = audioRef.current.currentTime;
      
      try {
        // Set the new playback rate
        audioRef.current.playbackRate = playbackRate;
        console.log(`Effect: Playback rate updated to ${playbackRate}x (playing: ${wasPlaying})`);
        
        // If the audio is currently playing, we need to ensure it remains playing
        if (wasPlaying && audioRef.current.paused) {
          audioRef.current.play().catch(error => {
            console.error("Error resuming playback after rate change:", error);
          });
        }
      } catch (error) {
        console.error("Error updating playback rate:", error);
        setError("Failed to change playback speed");
      }
    }
  }, [playbackRate]);

  const handleMouseDown = () => setIsDragging(true)
  
  const handleMouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging) {
      const rect = e.currentTarget.getBoundingClientRect();
      const newProgress = Math.min(Math.max(((e.clientX - rect.left) / rect.width) * 100, 0), 100);
      setProgress(newProgress);
      
      // Update audio position if we have audio
      if (audioRef.current) {
        audioRef.current.currentTime = (newProgress / 100) * audioRef.current.duration;
      }
    }
    setIsDragging(false);
  }
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging) {
      const rect = e.currentTarget.getBoundingClientRect();
      const newProgress = Math.min(Math.max(((e.clientX - rect.left) / rect.width) * 100, 0), 100);
      setProgress(newProgress);
    }
  }

  React.useEffect(() => {
    // Handle simulated playback when no audio is available
    let intervalId: NodeJS.Timeout | null = null;
    let resetTimeoutId: NodeJS.Timeout | null = null;

    // Only use this if there's no real audio
    if (!recordingUrl && isPlaying) {
      intervalId = setInterval(() => {
        setProgress((prevProgress) => {
          if (prevProgress >= 100) {
            setIsPlaying(false)
            resetTimeoutId = setTimeout(() => {
              setProgress(0)
            }, 3000) // Reset after 3 seconds
            return 100
          }
          return prevProgress + (0.25 * playbackRate) // Adjust progress based on playback rate
        })
      }, 10) // Update more frequently for smoother animation
    }

    return () => {
      if (intervalId) clearInterval(intervalId)
      if (resetTimeoutId) clearTimeout(resetTimeoutId)
    }
  }, [isPlaying, playbackRate, recordingUrl]);

  const formatTime = (seconds: number) => {
    if (seconds === 0 && !isPlaying && !recordingUrl) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const togglePlayPause = async () => {
    if (recordingUrl && audioRef.current) {
      try {
        if (isPlaying) {
          await audioRef.current.pause();
        } else {
          // If at the end, restart from beginning
          if (progress >= 100) {
            setProgress(0);
            audioRef.current.currentTime = 0;
          }
          
          // Re-apply playback rate before playing
          try {
            audioRef.current.playbackRate = playbackRate;
          } catch (error) {
            console.error("Error setting playback rate before play:", error);
          }
          
          await audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
      } catch (err) {
        const errorMessage = 'Error during playback';
        setError(errorMessage);
        onError?.(errorMessage);
        setIsPlaying(false);
      }
    } else {
      setIsPlaying(!isPlaying);
      
      // If we're at the end and starting again, reset progress
      if (!isPlaying && progress === 100) {
        setProgress(0);
      }
    }
  };

  // Add PlaybackSpeedSelector component
  function PlaybackSpeedSelector() {
    const speedOptions = [1, 1.25, 1.5, 1.75, 2]
    const [isOpen, setIsOpen] = React.useState(false)
    
    const handleSpeedChange = (speed: number) => {
      // Store current playing status and position
      const wasPlaying = isPlaying;
      let currentPosition = 0;
      
      if (audioRef.current) {
        currentPosition = audioRef.current.currentTime;
      }
      
      // Set the playback rate state
      setPlaybackRate(speed);
      
      // Apply to audio element if it exists
      if (audioRef.current) {
        try {
          // If audio is currently playing, we need to handle it carefully
          if (wasPlaying && !audioRef.current.paused) {
            // Set playback rate directly
            audioRef.current.playbackRate = speed;
            console.log(`Playback rate changed to ${speed}x while playing`);
          } else {
            // Not playing, simpler case
            audioRef.current.playbackRate = speed;
            console.log(`Playback rate set to ${speed}x`);
          }
        } catch (error) {
          console.error("Error setting playback rate:", error);
        }
      }
      
      setIsOpen(false);
    }
    
    return (
      <div className="relative">
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 flex items-center justify-center gap-1 text-purple-600 hover:bg-purple-50 transition-colors"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="font-bold text-purple-600">{playbackRate}x</span>
          <ChevronDown className="h-3 w-3" />
        </Button>
        
        {isOpen && (
          <>
            <div 
              className="fixed inset-0 z-[9999]" 
              onClick={() => setIsOpen(false)} 
            />
            <div 
              className="absolute z-[10000] left-1/2 -translate-x-1/2 bottom-full mb-1 w-[100px] bg-white rounded-xl shadow-md overflow-hidden border border-gray-200"
            >
              <div className="grid grid-cols-2 gap-0.5 p-1">
                {speedOptions.map((speed) => (
                  <button
                    key={speed}
                    className={`text-center px-1 py-1 font-bold text-xs rounded-lg transition-colors ${
                      playbackRate === speed 
                        ? "bg-[#f8b922] text-white" 
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                    onClick={() => handleSpeedChange(speed)}
                  >
                    {speed}x
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    )
  }

  // Calculate current time based on progress and duration
  const currentTime = (progress / 100) * duration;
  
  // Format the duration for display
  const formattedDuration = formatTime(duration);

  if (error) {
    return (
      <div className="bg-white rounded-[20px] border border-[#dddddd] relative z-10 p-6">
        <div className="text-red-500 text-sm flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
          </span>
          {error}
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-[20px] border border-[#dddddd] relative z-10 p-4">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <Button
            size="icon"
            variant="ghost"
            className="h-7 w-7 p-0.5"
            onClick={togglePlayPause}
          >
            {isPlaying ? <Pause className="h-4 w-4 text-purple-600" /> : <Play className="h-4 w-4 text-purple-600" />}
          </Button>
          <div className="flex flex-1 items-center gap-2">
            <span className="text-xs text-slate-500 min-w-[32px]">
              {formatTime(currentTime)}
            </span>
            <div
              className="relative flex-1"
              onMouseDown={handleMouseDown}
              onMouseUp={handleMouseUp}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseUp}
            >
              <div className="h-1.5 w-full rounded-full bg-[#f8b922]">
                <div
                  className="absolute left-0 top-0 h-1.5 rounded-full bg-purple-600 transition-all duration-100"
                  style={{ width: `${progress}%` }}
                />
                <div
                  className="absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-purple-600 bg-white shadow-sm transition-all duration-100"
                  style={{ left: `${progress}%` }}
                />
              </div>
            </div>
            <span className="text-xs text-slate-500 min-w-[32px]">
              {formattedDuration}
            </span>
          </div>
          <PlaybackSpeedSelector />
        </div>
        
        <div className="text-xs text-gray-400 italic text-center -mt-1">
          *To speed up the audio, please set the speed before starting playback.
        </div>
      </div>
      
      {/* Hidden audio element for actual playback */}
      {recordingUrl && (
        <audio
          src={recordingUrl}
          ref={(el) => {
            // When the ref is set, ensure the playback rate is applied
            if (el && !audioRef.current) {
              audioRef.current = el;
              try {
                el.playbackRate = playbackRate;
              } catch (error) {
                console.error("Error setting playback rate on audio element:", error);
              }
            }
          }}
          style={{ display: 'none' }}
          onRateChange={(e) => {
            const target = e.target as HTMLAudioElement;
            if (target.playbackRate !== playbackRate) {
              setPlaybackRate(target.playbackRate);
            }
          }}
        />
      )}
    </div>
  )
}
