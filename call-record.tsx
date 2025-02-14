src/components/ui/call-record.tsx






"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ChevronDown, ChevronUp } from "lucide-react"
import { ScoreCard } from "./call-score-card"
import { CallDetails } from "./call-details"
import { cn } from "@/lib/utils"

interface CallRecordProps {
  name: string
  callNumber: number
  date: string
  duration: string
  avatar: string
  scores: Record<string, number>
}

export function CallRecord({ name, callNumber, date, duration, avatar, scores }: CallRecordProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  const categories = [
    { title: "Engagement", score: scores.Engagement },
    { title: "Objection Handling", score: scores["Objection Handling"] },
    { title: "Information Gathering", score: scores["Information Gathering"] },
    { title: "Program Explanation", score: scores["Program Explanation"] },
    { title: "Closing Skills", score: scores["Closing Skills"] },
    { title: "Effectiveness", score: scores.Effectiveness },
  ]

  // Calculate overall score
  const overallScore = Math.round(
    Object.values(scores).reduce((sum, score) => sum + score, 0) / Object.values(scores).length,
  )

  return (
    <div
      className={cn(
        "rounded-[30px] bg-white px-4 pt-2 pb-4 shadow-[0_4px_20px_rgb(0,0,0,0.08)] border border-gray-100 my-2",
        isExpanded ? "pb-4" : "pb-3",
      )}
    >
      {/* Call Header */}
      <div className="grid grid-cols-3 items-center gap-2 px-3 pt-1 pb-2 rounded-[20px] bg-white">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 ring-2 ring-purple-100">
            <AvatarImage src={avatar} />
            <AvatarFallback>{name[0]}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col justify-between h-full py-0.5">
            <p className="text-base font-semibold text-gray-900">{name}</p>
            <p className="text-xs text-gray-500">Call #{callNumber}</p>
          </div>
        </div>
        <div className="flex items-center justify-center">
          <div className="flex flex-col items-center justify-center bg-purple-50 px-4 py-1.5 rounded-lg shadow-md w-full max-w-[120px]">
            <p className="text-[10px] font-bold text-[#5b06be] mb-0.5 leading-none">Average Score</p>
            <div className="flex items-baseline">
              <span className="text-2xl font-extrabold text-[#5b06be] leading-none">{overallScore}</span>
              <span className="text-sm font-bold text-[#5b06be] ml-1">/100</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-center h-full text-right space-y-0.5">
          <p className="text-xs font-medium text-gray-700">{date}</p>
          <p className="text-xs text-gray-500">{duration}</p>
        </div>
      </div>

      {/* Score Categories */}
      <div className="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-6 pt-2 pb-2">
        {categories.map((category) => (
          <ScoreCard
            key={category.title}
            title={category.title}
            score={category.score}
            total={100}
            hoverEffect="scale-105 shadow-md"
            compact={true}
          />
        ))}
      </div>

      {/* Call Details Button */}
      <div className="flex items-center justify-center mt-2">
        <span
          onClick={() => {
            setIsAnimating(true)
            setIsExpanded(!isExpanded)
            setTimeout(() => setIsAnimating(false), 300)
          }}
          className={cn(
            "text-black hover:text-[#5b06be] cursor-pointer text-sm transition-colors duration-300",
            `${isAnimating ? "animate-pulse" : ""}`,
          )}
        >
          {isExpanded ? "Hide Details" : "Call Details"}
          {isExpanded ? (
            <ChevronUp className="inline-block ml-2 h-4 w-4" />
          ) : (
            <ChevronDown className="inline-block ml-2 h-4 w-4" />
          )}
        </span>
      </div>

      {/* Expandable Details Section */}
      <div className={cn("grid transition-all duration-300", isExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}>
        <div className="overflow-hidden">
          <div className="space-y-6 pb-4">
            <CallDetails />
          </div>
        </div>
      </div>
      {isExpanded && (
        <div className="flex items-center justify-center mt-4">
          <span
            onClick={() => {
              setIsAnimating(true)
              setIsExpanded(false)
              setTimeout(() => setIsAnimating(false), 300)
            }}
            className={cn(
              "text-black hover:text-[#5b06be] cursor-pointer text-sm transition-colors duration-300",
              `${isAnimating ? "animate-pulse" : ""}`,
            )}
          >
            Hide Details
            <ChevronUp className="inline-block ml-2 h-4 w-4" />
          </span>
        </div>
      )}
    </div>
  )
}
