src/components/ui/call-score-card.tsx






import { InfoIcon } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

interface ScoreCardProps {
  title: string
  score: number
  total: number
  description?: string // Add optional description prop
  hoverEffect?: string
  compact?: boolean
}

const getScoreColors = (score: number) => {
  if (score >= 95) {
    return {
      background: "bg-green-50",
      text: "text-green-600",
      line: "#19a34a"
    }
  } else if (score >= 70) {
    return {
      background: "bg-blue-50",
      text: "text-blue-600",
      line: "#2563eb"
    }
  } else if (score >= 40) {
    return {
      background: "bg-[#ffede5]",
      text: "text-[#f97315]",
      line: "#f97317"
    }
  } else if (score === 0) {
    return {
      background: "bg-gray-50",
      text: "text-gray-400",
      line: "#9ca3af"
    }
  } else {
    return {
      background: "bg-[#ffe8e8]",
      text: "text-red-500",
      line: "#ef4444"
    }
  }
}

// Default descriptions as fallback
const categoryDescriptions = {
  Engagement: "How well the agent engaged with the prospect during the call.",
  "Objection Handling": "How effectively the agent addressed concerns and objections raised by the prospect.",
  "Information Gathering": "How effectively the agent collected relevant information from the prospect.",
  "Program Explanation": "How well the agent explained the program details and benefits.",
  "Closing Skills": "The agent's ability to guide the conversation towards a positive outcome.",
  Effectiveness: "The overall effectiveness of the call in achieving its objectives.",
}

export function ScoreCard({ title, score, total, description, hoverEffect, compact }: ScoreCardProps) {
  const colors = getScoreColors(score)
  
  // Use provided description or fall back to the default
  const displayDescription = description || categoryDescriptions[title as keyof typeof categoryDescriptions] || "";

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div
          className={cn(
            "flex-1 rounded-[20px] px-3 py-1.5 flex flex-col items-center justify-center h-[60px] relative overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer",
            colors.background,
          )}
        >
          <div className="flex items-center justify-center mb-1">
            <span className="text-xs font-bold text-black text-center leading-tight">{title}</span>
          </div>
          <div className="flex items-baseline items-center">
            <span className={cn(colors.text, "text-lg font-bold")}>{score}</span>
            <span className={cn(colors.text, "text-sm font-bold")}>/</span>
            <span className={cn(colors.text, "text-sm font-bold")}>{total}</span>
            <InfoIcon className="h-3.5 w-3.5 text-slate-400 ml-0.5" />
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200 rounded-b-[20px]" />
          <div
            className="absolute bottom-0 left-0 h-1 transition-all duration-300 ease-in-out"
            style={{
              width: `${score}%`,
              backgroundColor: colors.line,
              borderTopRightRadius: '2px',
              borderBottomRightRadius: '2px',
              boxShadow: `0 -1px 3px ${colors.line}40`
            }}
          />
        </div>
      </PopoverTrigger>
      <PopoverContent 
        className="w-80 p-4 z-[9999] bg-white rounded-[20px] shadow-lg border-[#e2e8f0]" 
        align="center" 
        side="bottom"
        sideOffset={5}
      >
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
          <p className="text-xs text-slate-600">{displayDescription}</p>
        </div>
      </PopoverContent>
    </Popover>
  )
}
