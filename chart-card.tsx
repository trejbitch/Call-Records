src/components/ui/chart-card.tsx





"use client"

import { useState, useRef, useEffect } from "react"
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type React from "react"

interface ChartCardProps {
  title: string
  score: number
  icon?: React.ReactNode
  data: Array<{
    callNumber: number
    scores: {
      Engagement: number
      "Objection Handling": number
      "Information Gathering": number
      "Program Explanation": number
      "Closing Skills": number
      Effectiveness: number
    }
  }>
  isInteractive?: boolean
  className?: string
}

const getScoreFromData = (data: ChartCardProps["data"], title: string) => {
  return data
    .map((call) => {
      switch (title) {
        case "Overall Performance":
          return Object.values(call.scores).reduce((sum, score) => sum + score, 0) / Object.keys(call.scores).length
        case "Engagement":
          return call.scores.Engagement
        case "Objection Handling":
          return call.scores["Objection Handling"]
        case "Information Gathering":
          return call.scores["Information Gathering"]
        case "Program Explanation":
          return call.scores["Program Explanation"]
        case "Closing Skills":
          return call.scores["Closing Skills"]
        case "Effectiveness":
          return call.scores.Effectiveness
        default:
          return 0
      }
    })
    .reverse()
}

const getColorForScore = (score: number) => {
  if (score >= 95) {
    return {
      line: "#19a34a",
      background: "#effdf4",
      gradient: {
        start: "#19a34a",
        end: "#86efac"
      }
    }
  } else if (score >= 70) {
    return {
      line: "#2563eb",
      background: "#eff6ff",
      gradient: {
        start: "#2563eb",
        end: "#93c5fd"
      }
    }
  } else if (score >= 40) {
    return {
      line: "#f97317",
      background: "#ffede5",
      gradient: {
        start: "#f97317",
        end: "#fdba74"
      }
    }
  } else {
    return {
      line: "#ef4444",
      background: "#ffe8e8",
      gradient: {
        start: "#ef4444",
        end: "#fca5a5"
      }
    }
  }
}

export function ChartCard({
  title,
  score,
  icon,
  data,
  isInteractive = false,
  className,
}: ChartCardProps) {
  const [showDetails, setShowDetails] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationProgress = useRef(0)
  const animationFrameRef = useRef<number>()

  useEffect(() => {
    if (!canvasRef.current || showDetails) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    ctx.scale(dpr, dpr)
    ctx.imageSmoothingEnabled = true
    ctx.imageSmoothingQuality = "high"

    const scores = getScoreFromData(data, title)
    const points = scores.map((score, i) => ({
      x: (rect.width * i) / (scores.length - 1),
      y: rect.height - Math.pow(score / 100, 2) * (rect.height * 0.95),
    }))

    const colors = getColorForScore(scores[scores.length - 1])

    const drawGraph = (progress: number) => {
      ctx.clearRect(0, 0, rect.width, rect.height)
      if (points.length === 0) return

      const gradient = ctx.createLinearGradient(0, 0, 0, rect.height)
      gradient.addColorStop(0, `${colors.gradient.start}20`)
      gradient.addColorStop(1, `${colors.gradient.end}05`)

      ctx.beginPath()
      ctx.moveTo(0, rect.height)
      if (points.length > 0) {
        ctx.lineTo(points[0].x, points[0].y)
        for (let i = 0; i < (points.length - 1) * progress; i++) {
          const currentPoint = points[Math.floor(i)]
          const nextPoint = points[Math.min(Math.ceil(i + 1), points.length - 1)]
          const midX = (currentPoint.x + nextPoint.x) / 2
          ctx.quadraticCurveTo(currentPoint.x, currentPoint.y, midX, (currentPoint.y + nextPoint.y) / 2)
        }
      }
      ctx.lineTo(rect.width * progress, rect.height)
      ctx.closePath()
      ctx.fillStyle = gradient
      ctx.fill()

      ctx.beginPath()
      if (points.length > 0) {
        ctx.moveTo(points[0].x, points[0].y)
        for (let i = 0; i < (points.length - 1) * progress; i++) {
          const currentPoint = points[Math.floor(i)]
          const nextPoint = points[Math.min(Math.ceil(i + 1), points.length - 1)]
          const midX = (currentPoint.x + nextPoint.x) / 2
          const midY = (currentPoint.y + nextPoint.y) / 2
          ctx.quadraticCurveTo(currentPoint.x, currentPoint.y, midX, midY)
        }
      }
      ctx.strokeStyle = colors.line
      ctx.lineWidth = 2
      ctx.lineCap = "round"
      ctx.lineJoin = "round"
      ctx.stroke()
    }

    const animate = () => {
      if (animationProgress.current < 1 && points.length > 0) {
        animationProgress.current += 0.08
        drawGraph(animationProgress.current)
        animationFrameRef.current = requestAnimationFrame(animate)
      }
    }

    if (points.length > 0) {
      animationFrameRef.current = requestAnimationFrame(animate)
    } else {
      drawGraph(1)
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      animationProgress.current = 0
      if (canvasRef.current) {
        const ctx = canvasRef.current.getContext("2d")
        if (ctx) {
          ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
        }
      }
    }
  }, [data, title, showDetails])

  return (
    <div className={cn(
      "bg-white rounded-[28px] p-6 shadow-lg relative z-10 transition-all duration-300 hover:shadow-xl h-[280px] overflow-hidden",
      className
    )}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="text-gray-800 flex items-center justify-center">{icon}</div>
          <h3 className="text-[15px] font-extrabold text-gray-900">{title}</h3>
        </div>
        {isInteractive && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowDetails(!showDetails)}
            className="h-7 px-3 rounded-full text-gray-600 hover:bg-gray-50 text-sm font-medium shadow-sm hover:shadow-md transition-all duration-300"
          >
            {showDetails ? "Back" : "Details"}
          </Button>
        )}
      </div>

      {!showDetails ? (
        <>
          <div className="absolute top-[45%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 text-center">
            <div
              className="text-[48px] font-extrabold leading-none tracking-tight mb-2"
              style={{
                color: getColorForScore(
                  Math.round(getScoreFromData(data, title)[getScoreFromData(data, title).length - 1]),
                ).line,
              }}
            >
              {Math.round(getScoreFromData(data, title)[getScoreFromData(data, title).length - 1])}
              <span className="text-[32px] font-bold">/100</span>
            </div>
            <div className="text-[15px] font-semibold text-gray-600">Average Score</div>
          </div>

          <div className="absolute inset-x-0 bottom-0 h-[160px] transition-all duration-300 opacity-100 scale-100">
            <canvas
              ref={canvasRef}
              className="w-full h-full"
              style={{ touchAction: "none" }}
            />
          </div>
        </>
      ) : (
        <div className="h-full flex flex-col">
          <div className="text-base font-bold text-gray-800 mb-2">Top Insights</div>
          <div className="h-[150px] overflow-auto">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-green-50 rounded-xl p-3 h-full">
                <h4 className="text-sm font-extrabold text-green-700 mb-2">Strong Points</h4>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1 shrink-0">•</span>
                    <span className="text-green-600 text-sm font-bold">Consistent greeting and introduction</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1 shrink-0">•</span>
                    <span className="text-green-600 text-sm font-bold">Good use of active listening</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1 shrink-0">•</span>
                    <span className="text-green-600 text-sm font-bold">Effective solution presentation</span>
                  </li>
                </ul>
              </div>
              <div className="bg-red-50 rounded-xl p-3 h-full">
                <h4 className="text-sm font-extrabold text-red-700 mb-2">Improvement Areas</h4>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 mt-1 shrink-0">•</span>
                    <span className="text-red-600 text-sm font-bold">More follow-up questions needed</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 mt-1 shrink-0">•</span>
                    <span className="text-red-600 text-sm font-bold">Improve call control</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 mt-1 shrink-0">•</span>
                    <span className="text-red-600 text-sm font-bold">Better objection handling</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="h-3"></div>
        </div>
      )}
    </div>
  )
}
