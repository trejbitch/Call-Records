src/components/ui/call-transcript.tsx






"use client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

interface Message {
  timestamp: string
  speaker: "Agent" | "Owner"
  content: string
  avatar?: string
}

const messages: Message[] = [
  {
    timestamp: "0:00",
    speaker: "Agent",
    content: "Hello, this is Jessica from Premier Real Estate Solutions. Am I speaking with Mr. Anderson?",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    timestamp: "0:05",
    speaker: "Owner",
    content: "Yes, this is Robert Anderson speaking.",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    timestamp: "0:10",
    speaker: "Agent",
    content:
      "Great to connect with you, Mr. Anderson. I noticed your property on Oak Street and wanted to discuss some exciting opportunities in today's market. Would now be a good time to chat?",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    timestamp: "0:20",
    speaker: "Owner",
    content: "Yes, I have a few minutes. What kind of opportunities are you referring to?",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    timestamp: "0:25",
    speaker: "Agent",
    content: "What's your timeline for selling the property?",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    timestamp: "0:35",
    speaker: "Owner",
    content: "Well, we're thinking about downsizing since the kids moved out. Maybe within the next 6 months or so.",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    timestamp: "0:45",
    speaker: "Agent",
    content: "I understand. Have you made any upgrades to the property in the last few years?",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    timestamp: "0:55",
    speaker: "Owner",
    content: "Yes, we renovated the kitchen last year and installed new windows throughout the house.",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    timestamp: "1:05",
    speaker: "Agent",
    content:
      "Those are valuable improvements! Based on recent sales in your area, updated kitchens are a major selling point. Would you be interested in a comprehensive market analysis to see how these upgrades impact your home's current value?",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    timestamp: "1:20",
    speaker: "Owner",
    content: "That would be helpful. What's involved in the analysis?",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    timestamp: "1:25",
    speaker: "Agent",
    content: "Let me tell you about our market analysis process.",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    timestamp: "1:35",
    speaker: "Owner",
    content: "A weekend would work better for us. Could you do Saturday morning?",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    timestamp: "1:40",
    speaker: "Agent",
    content:
      "Perfect! I have this Saturday at 10 AM or 11:30 AM available. Which time works better for you and your spouse?",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    timestamp: "1:45",
    speaker: "Owner",
    content: "10 AM would work well for us.",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    timestamp: "1:50",
    speaker: "Agent",
    content:
      "Excellent! I'll send you a calendar invite with all the details. Before we wrap up, do you have any specific questions about the market or our services that I can address now?",
    avatar: "/placeholder.svg?height=40&width=40",
  },
]

export function CallTranscript() {
  return (
    <div className="bg-white relative z-10 h-full overflow-y-auto w-full">
      <div className="max-h-[400px] pr-2 custom-purple-scrollbar">
        {messages.map((message, index) => (
          <div
            key={index}
            className={cn("flex items-start gap-3", message.speaker === "Owner" ? "flex-row-reverse" : "flex-row")}
          >
            <Avatar className="w-10 h-10 mt-1">
              <AvatarImage src={message.avatar} alt={message.speaker} />
              <AvatarFallback>{message.speaker[0]}</AvatarFallback>
            </Avatar>
            <div className={cn("flex flex-col max-w-[80%]", message.speaker === "Owner" ? "items-end" : "items-start")}>
              <span className="text-sm font-medium mb-1">{message.speaker === "Agent" ? "You" : "Homeowner"}</span>
              <div
                className={cn(
                  "rounded-[20px] p-4 border transition-all duration-300 hover:shadow-md",
                  message.speaker === "Owner"
                    ? "bg-[#fef8eb] text-yellow-700 border-yellow-200 hover:border-yellow-300"
                    : "bg-[#f3f0ff] text-purple-700 border-purple-200 hover:border-purple-300",
                )}
              >
                <p className="text-sm">{message.content}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <style jsx>{`
        .custom-purple-scrollbar {
          overflow-y: auto;
          scrollbar-width: thin;
          scrollbar-color: #8b5cf6 #f1f1f1;
        }
        .custom-purple-scrollbar::-webkit-scrollbar {
          width: 8px;
          display: none;
        }
        .custom-purple-scrollbar:hover::-webkit-scrollbar {
          display: block;
        }
      `}</style>
    </div>
  )
}
