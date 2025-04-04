src/components/ui/call-record.tsx






"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ChevronDown, ChevronUp } from "lucide-react"
import { ScoreCard } from "./call-score-card"
import { CallDetails } from "./call-details"
import { cn } from "@/lib/utils"
import { updateManagerFeedback, updateCallNotes } from "@/hooks/use-call-records-av"

interface CallRecordProps {
  name: string
  callNumber: number
  date: string
  duration: string
  avatar: string
  scores: Record<string, number>
  isEmpty?: boolean
  isPending?: boolean
  sessionId?: string
  memberId?: string
  onFeedbackSaved?: () => void
  onExpandToggle?: (expanded: boolean) => void
  
  // Add properties for text descriptions
  scoreDescriptions?: {
    engagement_text?: string;
    objection_handling_text?: string;
    information_gathering_text?: string;
    program_explanation_text?: string;
    closing_skills_text?: string;
    effectiveness_text?: string;
  };
  powerMoment?: string;
  keyWins?: string;
  areasForGrowth?: string;
  callNotes?: string;
  callTranscript?: string;
  callRecording?: string;
  botName?: string;
  botPicture?: string;
  userTalkPercentage?: number;
  botTalkPercentage?: number;
  monologuesTime?: string;
  responseTime?: string;
  turnSwitches?: number;
  mostUsedPhrases?: string;
  speakingPace?: number;
  averageSentenceLength?: number;
  fillerWordsPercentage?: number;
  fillerWordsUsed?: string;
  listeningSkillsAnalysis?: string;
  notesScore?: number;
  listeningSkillsScore?: number;
  userPicture?: string;
  userName?: string;
  managers_feedback?: string;
}

export function CallRecord({ 
  name, 
  callNumber, 
  date, 
  duration, 
  avatar, 
  scores, 
  isEmpty = false,
  isPending = false,
  sessionId,
  memberId,
  onFeedbackSaved,
  onExpandToggle,
  scoreDescriptions = {},
  powerMoment,
  keyWins,
  areasForGrowth,
  callNotes,
  callTranscript,
  callRecording,
  botName = "Real Estate Coach",
  botPicture = "/placeholder.svg",
  userTalkPercentage = 46,
  botTalkPercentage = 54,
  monologuesTime = "45s",
  responseTime = "1.8s",
  turnSwitches = 24,
  mostUsedPhrases = "market value|opportunity|your needs|understand|help you",
  speakingPace = 150,
  averageSentenceLength = 8,
  fillerWordsPercentage = 3.2,
  fillerWordsUsed = "um|uh|like|you know",
  listeningSkillsAnalysis = "",
  notesScore = 80,
  listeningSkillsScore = 80,
  userPicture,
  userName,
  managers_feedback
}: CallRecordProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const categories = [
    { 
      title: "Engagement", 
      score: scores.Engagement,
      description: scoreDescriptions.engagement_text
    },
    { 
      title: "Objection Handling", 
      score: scores["Objection Handling"],
      description: scoreDescriptions.objection_handling_text
    },
    { 
      title: "Information Gathering", 
      score: scores["Information Gathering"],
      description: scoreDescriptions.information_gathering_text
    },
    { 
      title: "Program Explanation", 
      score: scores["Program Explanation"],
      description: scoreDescriptions.program_explanation_text
    },
    { 
      title: "Closing Skills", 
      score: scores["Closing Skills"],
      description: scoreDescriptions.closing_skills_text
    },
    { 
      title: "Effectiveness", 
      score: scores.Effectiveness,
      description: scoreDescriptions.effectiveness_text
    },
  ]

  // Calculate overall score
  const overallScore = Math.round(
    Object.values(scores).reduce((sum, score) => sum + score, 0) / Object.values(scores).length,
  )

  // Handler for updating call notes
  const handleUpdateCallNotes = async (notes: string) => {
    if (!sessionId || !memberId) return
    
    try {
      setIsLoading(true)
      // Call API to update call notes
      await updateCallNotes({ 
        member_id: memberId, 
        session_id: sessionId, 
        call_notes: notes 
      });
      
      // Refresh data after saving
      if (onFeedbackSaved) {
        onFeedbackSaved()
      }
    } catch (error) {
      console.error("Error saving call notes:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Handler for saving feedback that will be used in the CallDetails component
  const handleSaveFeedback = async (feedback: string) => {
    if (!sessionId || !memberId) return
    
    try {
      setIsLoading(true)
      await updateManagerFeedback({
        member_id: memberId,
        session_id: sessionId,
        manager_feedback: feedback
      })
      
      // Refresh data after saving
      if (onFeedbackSaved) {
        onFeedbackSaved()
      }
    } catch (error) {
      console.error("Error saving feedback:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isEmpty) {
    return (
      <div className="w-full bg-white border border-[#ddd] rounded-[30px] p-4 opacity-50">
        <div className="grid grid-cols-3 items-center gap-2 px-3 pt-1 pb-2 rounded-[20px] bg-white">
          <div className="flex items-center gap-3">
            <Avatar className="rounded-[10px] bg-gray-100 border border-[#ddd]">
              <AvatarImage src={avatar} alt="Empty" />
              <AvatarFallback>-</AvatarFallback>
            </Avatar>
            <div className="flex flex-col justify-between h-full py-0.5">
              <p className="text-base font-semibold text-gray-900">-</p>
              <p className="text-xs text-gray-500">-</p>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="flex flex-col items-center justify-center bg-gray-50 px-4 py-1.5 rounded-lg shadow-md w-full max-w-[120px]">
              <p className="text-[10px] font-bold text-gray-400 mb-0.5 leading-none">Empty slot</p>
              <div className="flex items-baseline">
                <span className="text-2xl font-extrabold text-gray-400 leading-none">-</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col justify-center h-full text-right space-y-0.5">
            <p className="text-xs font-medium text-gray-400">-</p>
            <p className="text-xs text-gray-400">-</p>
          </div>
        </div>
      </div>
    );
  }

  // Special handling for pending calls
  if (isPending) {
    return (
      <div className="w-full bg-white border border-[#ddd] rounded-[30px] p-4 overflow-hidden">
        <style jsx>{`
          @keyframes pulse {
            0% { opacity: 0.6; }
            50% { opacity: 1; }
            100% { opacity: 0.6; }
          }
          .animate-custom-pulse {
            animation: pulse 1.5s ease-in-out infinite;
          }
        `}</style>
        
        <div className="grid grid-cols-3 items-center gap-2 px-3 py-3 rounded-[20px] bg-white">
          {/* Left: Call info with pulse indicator */}
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-[10px] bg-purple-50 border border-[#ddd]">
              <div className="h-4 w-4 rounded-full bg-[#5b06be] animate-custom-pulse"></div>
            </div>
            <div className="flex flex-col justify-center">
              <p className="text-base font-semibold text-gray-900">
                {name || botName || `Coach`}
              </p>
            </div>
          </div>

          {/* Center: Processing information */}
          <div className="flex items-center justify-center">
            <div className="bg-white flex items-center gap-3 px-5 py-2.5 rounded-full border border-purple-100 shadow-sm">
              <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-solid border-[#5b06be] border-r-transparent"></div>
              <div className="flex flex-col items-start">
                <p className="text-base font-medium text-[#5b06be]">Processing Call</p>
                <p className="text-xs text-gray-500">This may take a few moments</p>
              </div>
            </div>
          </div>

          {/* Right: Date information */}
          <div className="flex flex-col justify-center h-full text-right">
            <p className="text-xs font-medium text-gray-700">{date}</p>
            <p className="text-xs text-gray-500">In progress...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white border border-[#ddd] rounded-[30px] p-4">
      {/* Call Header */}
      <div className="grid grid-cols-3 items-center gap-2 px-3 pt-1 pb-2 rounded-[20px] bg-white">
        <div className="flex items-center gap-3">
          <Avatar className="rounded-[10px] bg-gray-100 border border-[#ddd]">
            <AvatarImage src={botPicture} alt={botName} />
            <AvatarFallback>{botName[0]}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col justify-between h-full py-0.5">
            <p className="text-base font-semibold text-gray-900">{botName}</p>
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
            description={category.description}
            hoverEffect="scale-105 shadow-md"
            compact={true}
          />
        ))}
      </div>

      {/* Call Details Button */}
      <div className="flex items-center justify-center mt-2">
        <span
          onClick={() => {
            const newExpandedState = !isExpanded;
            setIsExpanded(newExpandedState);
            // Notify parent component when expanded state changes
            if (onExpandToggle) {
              onExpandToggle(newExpandedState);
            }
          }}
          className="text-black hover:text-[#5b06be] cursor-pointer text-sm transition-colors duration-300"
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
            <CallDetails 
              sessionId={sessionId} 
              memberId={memberId}
              onSaveFeedback={handleSaveFeedback}
              isLoading={isLoading}
              powerMoment={powerMoment}
              keyWins={keyWins}
              areasForGrowth={areasForGrowth}
              callNotes={callNotes}
              callTranscript={callTranscript}
              callScore={overallScore}
              callRecording={callRecording}
              userName={userName || "You"}
              userPicture={userPicture || "/placeholder.svg"}
              botName={botName}
              botPicture={botPicture}
              callLength={duration}
              callDate={date}
              botTalkPercentage={botTalkPercentage}
              userTalkPercentage={userTalkPercentage}
              monologuesTime={monologuesTime}
              responseTime={responseTime}
              turnSwitches={turnSwitches}
              mostUsedPhrases={mostUsedPhrases}
              speakingPace={speakingPace}
              averageSentenceLength={averageSentenceLength}
              fillerWordsPercentage={fillerWordsPercentage}
              fillerWordsUsed={fillerWordsUsed}
              listeningSkillsAnalysis={listeningSkillsAnalysis}
              notesScore={notesScore}
              listeningSkillsScore={listeningSkillsScore}
              managersFeedback={managers_feedback}
            />
          </div>
        </div>
      </div>
      {isExpanded && (
        <div className="flex items-center justify-center mt-4">
          <span
            onClick={() => {
              setIsExpanded(false);
              // Notify parent component when expanded state changes
              if (onExpandToggle) {
                onExpandToggle(false);
              }
            }}
            className="text-black hover:text-[#5b06be] cursor-pointer text-sm transition-colors duration-300"
          >
            Hide Details
            <ChevronUp className="inline-block ml-2 h-4 w-4" />
          </span>
        </div>
      )}
    </div>
  );
}
