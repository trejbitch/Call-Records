src/components/ui/call-player.tsx






"use client"

import * as React from "react"
import { Play, Pause } from "lucide-react"
import { Button } from "@/components/ui/button"

export function CallPlayer() {
  const [isPlaying, setIsPlaying] = React.useState(false)
  const [progress, setProgress] = React.useState(0)
  const [isDragging, setIsDragging] = React.useState(false)

  const handleMouseDown = () => setIsDragging(true)
  const handleMouseUp = () => setIsDragging(false)
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging) {
      const rect = e.currentTarget.getBoundingClientRect()
      const newProgress = Math.min(Math.max(((e.clientX - rect.left) / rect.width) * 100, 0), 100)
      setProgress(newProgress)
    }
  }

  React.useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null
    let resetTimeoutId: NodeJS.Timeout | null = null

    if (isPlaying) {
      intervalId = setInterval(() => {
        setProgress((prevProgress) => {
          if (prevProgress >= 100) {
            setIsPlaying(false)
            resetTimeoutId = setTimeout(() => {
              setProgress(0)
            }, 3000) // Reset after 3 seconds
            return 100
          }
          return prevProgress + 0.25 // Slower progress for demonstration
        })
      }, 10) // Update more frequently for smoother animation
    }

    return () => {
      if (intervalId) clearInterval(intervalId)
      if (resetTimeoutId) clearTimeout(resetTimeoutId)
    }
  }, [isPlaying])

  const formatTime = (seconds: number) => {
    if (seconds === 0 && !isPlaying) return "0:00"
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="bg-white rounded-[20px] border border-[#dddddd] relative z-10 p-6">
      <div className="space-y-2">
        {" "}
        {/* Adjusted spacing */}
        <div className="flex items-center gap-4">
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 p-0.5"
            onClick={() => {
              setIsPlaying(!isPlaying)
              if (!isPlaying && progress === 100) {
                setProgress(0)
              }
            }}
          >
            {isPlaying ? <Pause className="h-4 w-4 text-purple-600" /> : <Play className="h-4 w-4 text-purple-600" />}
          </Button>
          <div className="flex flex-1 items-center gap-3">
            <span className="text-xs text-slate-500 min-w-[32px]">
              {formatTime((progress / 100) * 4)} {/* Assuming 4 seconds total duration */}
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
            <span className="text-xs text-slate-500 min-w-[32px]">0:04</span>
          </div>
        </div>
      </div>
    </div>
  )
}
