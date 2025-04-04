src/components/ui/call-details.tsx





import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Sparkles, Headphones } from "lucide-react"
import { useState, useEffect } from "react"
import { LanguageAnalysis } from "./language-analysis"
import { KeyMoments } from "./key-moments"
import { CallPlayer } from "./call-player"
import { CallTranscript } from "./call-transcript"

// Score color utility function
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

interface CallDetailsProps {
  sessionId?: string;
  memberId?: string;
  onSaveFeedback?: (feedback: string) => Promise<void>;
  isLoading?: boolean;
  powerMoment?: string;
  keyWins?: string;
  areasForGrowth?: string;
  callNotes?: string;
  callTranscript?: string;
  callScore?: number;
  callRecording?: string; // Add call recording URL
  userName?: string; // Bot name
  userPicture?: string; // Bot picture
  botName?: string; // Bot name
  botPicture?: string; // Bot picture 
  callLength?: string;
  callDate?: string;
  // Language analysis data
  botTalkPercentage?: number;
  userTalkPercentage?: number;
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
  managersFeedback?: string; // Add manager feedback
}

export function CallDetails({ 
  sessionId, 
  memberId,
  onSaveFeedback,
  isLoading = false,
  powerMoment,
  keyWins,
  areasForGrowth,
  callNotes = "",
  callTranscript = "",
  callScore = 75, // Default score if none provided
  callRecording = "",
  userName = "User",
  userPicture = "/placeholder.svg",
  botName = "Bot",
  botPicture = "/placeholder.svg",
  callLength = "",
  callDate = "",
  // Language analysis data
  botTalkPercentage = 54,
  userTalkPercentage = 46,
  monologuesTime = "45s",
  responseTime = "1.8s",
  turnSwitches = 24,
  mostUsedPhrases = "market value|opportunity|your needs|understand|help you",
  speakingPace = 150,
  averageSentenceLength = 8,
  fillerWordsPercentage = 3.2,
  fillerWordsUsed = "um|uh|like|you know",
  listeningSkillsAnalysis = "You did not fully address the homeowner's concerns about the property's market value. When the homeowner mentioned recent renovations, you missed an opportunity to gather more detailed information about these improvements. It's crucial to actively listen and ask follow-up questions to gain a comprehensive understanding of the property's condition and potential value.",
  notesScore = 80,
  listeningSkillsScore = 80,
  managersFeedback = ""
}: CallDetailsProps) {
  const [isSaved, setIsSaved] = useState(false)
  const [feedbackText, setFeedbackText] = useState(managersFeedback || "")
  const [userCallNotes, setUserCallNotes] = useState(callNotes)
  const scoreColors = getScoreColors(callScore)
  const notesScoreColors = getScoreColors(notesScore)
  const listeningScoreColors = getScoreColors(listeningSkillsScore)

  // Update call notes when props change
  useEffect(() => {
    setUserCallNotes(callNotes);
  }, [callNotes]);
  
  // Update manager feedback when props change
  useEffect(() => {
    if (managersFeedback) {
      setFeedbackText(managersFeedback);
    }
  }, [managersFeedback]);
  
  // If we have saved feedback, fetch it and populate the textarea
  useEffect(() => {
    if (sessionId && memberId && !managersFeedback) {
      // Fetch existing feedback when the component mounts
      const fetchFeedback = async () => {
        try {
          const response = await fetch(`/api/team-logs-av?memberId=${memberId}&session_id=${sessionId}`);
          if (response.ok) {
            const data = await response.json();
            if (data && data.length > 0 && data[0].manager_feedback) {
              setFeedbackText(data[0].manager_feedback);
            }
          }
        } catch (error) {
          console.error("Error fetching feedback:", error);
        }
      };
      
      fetchFeedback();
    }
  }, [sessionId, memberId, managersFeedback])

  useEffect(() => {
    if (isSaved) {
      const timer = setTimeout(() => setIsSaved(false), 2000)
      return () => clearTimeout(timer)
    }
  }, [isSaved])

  const handleSaveFeedback = async () => {
    if (onSaveFeedback) {
      try {
        await onSaveFeedback(feedbackText)
        setIsSaved(true)
      } catch (error) {
        console.error("Error saving feedback:", error)
      }
    }
  }
  
  // New handler for saving call notes
  const handleSaveCallNotes = async () => {
    // Implement API call to save call notes
    try {
      setIsSaved(true)
      // Update the API to save call notes
      // For now, just simulate a successful save
      setTimeout(() => setIsSaved(false), 2000)
    } catch (error) {
      console.error("Error saving call notes:", error)
    }
  }

  // Parse most used phrases
  const parsedPhrases = mostUsedPhrases ? mostUsedPhrases.split('|') : [];
  // Parse filler words
  const parsedFillerWords = fillerWordsUsed ? fillerWordsUsed.split('|') : [];

  return (
    <div className="space-y-4 px-4 pt-8">
      <h2 className="text-xl font-bold text-[#5b06be] mb-2">Call Details</h2>

      {/* Key Moments Card */}
      <Card className="border border-[#dddddd] relative z-10 rounded-[20px] overflow-hidden transition-all duration-300">
        <KeyMoments 
          powerMoment={powerMoment}
          keyWins={keyWins}
          areasForGrowth={areasForGrowth}
        />
      </Card>

      {/* Call Notes and Manager's Feedback */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Call Notes Card */}
        <Card className="border border-[#dddddd] relative z-10 rounded-[20px] overflow-hidden transition-all duration-300 h-[280px]">
          <div className="flex items-center justify-between pb-2 bg-white px-6 pt-6">
            <CardTitle className="text-base font-bold text-[#5b06be]">Call Notes</CardTitle>
            <div className={`flex items-center gap-1.5 ${notesScoreColors.background} px-3.5 py-1 rounded-full`}>
              <span className="text-xs font-bold text-black">Score:</span>
              <span className={`text-base font-bold ${notesScoreColors.text}`}>{notesScore}/100</span>
            </div>
          </div>
          <CardContent className="pt-2 px-6 pb-6 h-[calc(100%-60px)] flex flex-col">
            <div className="space-y-4 flex-grow overflow-y-auto">
              <div className="h-full flex flex-col">
                <Textarea
                  placeholder="Add your call notes here..."
                  className="resize-none rounded-[15px] border-gray-200 placeholder:text-gray-400 outline-none ring-0 focus:ring-0 focus:border-[#5b06be] focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 flex-grow p-4 hover:border-gray-200"
                  value={userCallNotes}
                  onChange={(e) => setUserCallNotes(e.target.value)}
                />
                <Button
                  className={`w-full mt-4 rounded-[15px] transition-all duration-300 ${
                    isSaved ? "bg-green-500 hover:bg-green-600" : "bg-[#5b06be] hover:bg-[#6c17cf]"
                  } text-white font-medium py-2 flex items-center justify-center`}
                  onClick={handleSaveCallNotes}
                  disabled={isLoading || isSaved}
                >
                  {isLoading ? (
                    <>
                      <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent"></span>
                      Saving...
                    </>
                  ) : isSaved ? (
                    "Saved!"
                  ) : (
                    "Save"
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Manager's Feedback Card */}
        <Card className="!shadow-none border border-[#dddddd] relative z-10 rounded-[20px] overflow-hidden transition-all duration-300 h-[280px]">
          <CardHeader className="pb-2 bg-white">
            <CardTitle className="text-base font-bold text-[#5b06be]">Manager's Feedback</CardTitle>
          </CardHeader>
          <CardContent className="pt-2 px-6 pb-6 h-[calc(100%-60px)] flex flex-col">
            {feedbackText ? (
              <div className="h-full overflow-auto rounded-[15px] bg-white p-4 border border-gray-200">
                <p className="text-sm text-gray-900 placeholder:text-gray-400">{feedbackText}</p>
              </div>
            ) : (
              <div className="h-full rounded-[15px] bg-white p-4 text-gray-600 flex flex-col items-center justify-center space-y-1 border border-gray-200">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 text-[#5b06be]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <p className="font-medium">No manager feedback yet</p>
                <p className="text-sm text-gray-500">Check back later for insights!</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Call Player */}
      <Card className="border border-[#dddddd] relative z-10 rounded-[20px] overflow-hidden transition-all duration-300">
        <div className="p-6">
          <h3 className="text-[15px] font-bold text-[#5b06be] mb-4">Call Recording</h3>
          <CallPlayer
            recordingUrl={callRecording || ""}
            callLength={callLength}
          />
        </div>
      </Card>

      {/* Call Transcript Card */}
      <Card className="border border-[#dddddd] relative z-10 rounded-[20px] overflow-hidden transition-all duration-300">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-bold text-[#5b06be]">Call Transcript</CardTitle>
        </CardHeader>
        <CardContent className="pt-2 px-6 pb-6">
          <CallTranscript 
            transcript={callTranscript}
            userName={userName}
            userPicture={userPicture}
            botName={botName}
            botPicture={botPicture}
          />
        </CardContent>
      </Card>

      {/* Language Analysis Card */}
      <Card className="border border-[#dddddd] relative z-10 rounded-[20px] overflow-hidden transition-all duration-300">
        <LanguageAnalysis 
          botTalkPercentage={botTalkPercentage}
          userTalkPercentage={userTalkPercentage}
          monologuesTime={monologuesTime}
          responseTime={responseTime}
          turnSwitches={turnSwitches}
          mostUsedPhrases={parsedPhrases}
          speakingPace={speakingPace}
          averageSentenceLength={averageSentenceLength}
          fillerWordsPercentage={fillerWordsPercentage}
          fillerWordsUsed={parsedFillerWords}
        />
      </Card>

      {/* Listening Skills Card with Edit button */}
      <Card className="border border-[#dddddd] relative z-10 rounded-[20px] overflow-hidden transition-all duration-300">
        <CardHeader className="pb-2 bg-white">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-bold text-[#5b06be]">
              Listening Skills
            </CardTitle>
            <div className={`flex items-center gap-1.5 ${listeningScoreColors.background} px-3.5 py-1 rounded-full`}>
              <span className="text-xs font-bold text-black">Score:</span>
              <span className={`text-base font-bold ${listeningScoreColors.text}`}>{listeningSkillsScore}/100</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-2 px-6 pb-6">
          <div className="space-y-6">
            {/* Analysis */}
            <div className="border border-[#dddddd] rounded-[20px] p-6">
              <h4 className="text-[13px] font-bold text-[#5b06be] mb-2">Analysis</h4>
              <p className="text-sm text-gray-700">
                {listeningSkillsAnalysis}
              </p>
            </div>

            {/* Key Listening Skills to Focus On */}
            <div className="bg-[#f3f0ff] rounded-[20px] p-4 shadow-sm">
              <h4 className="text-[13px] font-bold text-[#5b06be] mb-2">Key Listening Skills to Focus On</h4>
              <ul className="grid grid-cols-2 gap-3">
                {["Active Listening", "Empathy", "Clarifying Questions", "Paraphrasing"].map((skill) => (
                  <li
                    key={skill}
                    className="flex items-center gap-2 bg-white p-2.5 rounded-lg shadow-sm transition-all duration-300 hover:shadow-md hover:translate-x-1 group"
                  >
                    <div className="bg-[#f3f0ff] rounded-full p-1.5 group-hover:bg-[#ebe5ff] transition-colors duration-300">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-[#5b06be]"
                      >
                        <polyline points="9 11 12 14 22 4"></polyline>
                        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
                      </svg>
                    </div>
                    <span className="text-sm font-medium text-black group-hover:text-[#5b06be] transition-colors duration-300">
                      {skill}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Improvement Tip */}
            <div className="bg-[#fef8eb] p-3 rounded-md border border-yellow-200">
              <p className="text-sm text-yellow-700">
                <span className="font-bold">Tip:</span> In future calls, ensure you explore all relevant details the
                homeowner provides. This information is vital for accurate property valuation and building trust with
                potential sellers.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
