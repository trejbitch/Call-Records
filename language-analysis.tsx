src/components/ui/language-analysis.tsx






import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, ChevronDown, ChevronUp, Info } from "lucide-react"
import { useState } from "react"

interface LanguageAnalysisProps {
  botTalkPercentage?: number;
  userTalkPercentage?: number;
  monologuesTime?: string;
  responseTime?: string;
  turnSwitches?: number;
  mostUsedPhrases?: string[];
  speakingPace?: number;
  averageSentenceLength?: number;
  fillerWordsPercentage?: number;
  fillerWordsUsed?: string[];
}

export function LanguageAnalysis({
  botTalkPercentage = 54,
  userTalkPercentage = 46,
  monologuesTime = "45s",
  responseTime = "1.8s",
  turnSwitches = 24,
  mostUsedPhrases = ["market value", "opportunity", "your needs", "understand", "help you"],
  speakingPace = 150,
  averageSentenceLength = 8,
  fillerWordsPercentage = 3.2,
  fillerWordsUsed = ["um", "uh", "like", "you know"]
}: LanguageAnalysisProps) {
  const [showTips, setShowTips] = useState(false)
  const [activePopup, setActivePopup] = useState<string | null>(null)
  
  // Calculate if any warnings exist that require action
  const calculateWarnings = () => {
    // Parse monologues time
    let monologueSeconds = 0;
    if (monologuesTime) {
      const parts = monologuesTime.split(' ');
      for (const part of parts) {
        if (part.endsWith('m')) {
          monologueSeconds += parseInt(part) * 60;
        } else if (part.endsWith('s')) {
          monologueSeconds += parseInt(part);
        }
      }
    }
    
    // Parse response time
    let responseSeconds = 0;
    if (responseTime) {
      responseSeconds = parseFloat(responseTime.replace('s', ''));
    }
    
    // Check talk ratio (target is 35% You, 65% Prospect)
    const talkRatioWarning = userTalkPercentage > 40; // Warning if "You" talk more than 40%
    
    // Check monologues (target is < 30s)
    const monologuesWarning = monologueSeconds >= 30;
    
    // Check response time (target is < 3s)
    const responseTimeWarning = responseSeconds >= 3;
    
    // Check speaking pace (target is 120-160 words per minute)
    const speakingPaceWarning = speakingPace < 120 || speakingPace > 160;
    
    // Check sentence length (target is 7-30 words)
    const sentenceLengthWarning = averageSentenceLength < 7 || averageSentenceLength > 30;
    
    // Check filler words (target is < 5%)
    const fillerWordsWarning = fillerWordsPercentage >= 5;
    
    return {
      hasWarnings: talkRatioWarning || monologuesWarning || responseTimeWarning || speakingPaceWarning || sentenceLengthWarning || fillerWordsWarning,
      warnings: {
        talkRatio: talkRatioWarning,
        monologues: monologuesWarning,
        responseTime: responseTimeWarning,
        speakingPace: speakingPaceWarning,
        sentenceLength: sentenceLengthWarning,
        fillerWords: fillerWordsWarning
      }
    };
  };
  
  const warnings = calculateWarnings();

  return (
    <Card className="border-none shadow-lg relative z-10 rounded-[20px] md:col-span-2 overflow-hidden transition-all duration-300 hover:shadow-xl">
      <CardHeader className="pb-2 bg-white">
        <CardTitle className="text-base font-bold text-[#5b06be]">Language Analysis</CardTitle>
      </CardHeader>
      <CardContent className="pt-2 bg-white rounded-b-[20px] px-6">
        <div className="space-y-6">
          {/* Talk Ratio Section */}
          <div className="bg-white border border-[#dddddd] rounded-[20px] p-6 relative z-10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[15px] font-bold text-[#5b06be]">Talk Ratio</h3>
              {warnings.hasWarnings && (
                <div className="flex items-center gap-2">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                  </span>
                  <span className="text-sm font-medium text-red-600">Action Needed</span>
                </div>
              )}
            </div>
            <div className="space-y-6">
              <div className="flex items-center justify-center gap-8 text-3xl font-bold">
                <div className="text-center transition-transform duration-300 hover:scale-110 cursor-pointer">
                  <span className="text-indigo-600">{userTalkPercentage}%</span>
                  <p className="text-xs text-gray-500 font-normal mt-1">YOU</p>
                </div>
                <div className="text-center px-4 py-2 rounded-full bg-white/50 backdrop-blur-sm">
                  <span className="text-gray-500 text-xl">vs</span>
                </div>
                <div className="text-center transition-transform duration-300 hover:scale-110 cursor-pointer">
                  <span className="text-purple-600">{botTalkPercentage}%</span>
                  <p className="text-xs text-gray-500 font-normal mt-1">PROSPECT</p>
                </div>
              </div>

              <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="absolute left-0 top-0 h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500 hover:opacity-90"
                  style={{ width: `${userTalkPercentage}%` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"></div>
                </div>
              </div>

              <p className="text-sm text-gray-600 bg-white/50 rounded-full py-2 px-4 inline-block backdrop-blur-sm">
                Target: <span className="font-semibold text-indigo-600">35% You</span> |{" "}
                <span className="font-semibold text-purple-600">65% Prospect</span>
              </p>

              <div className="grid grid-cols-3 gap-4">
                {/* Use previously calculated warnings for consistency */}
                {(() => {
                  // Use the warnings already calculated
                  const monologueStatus = warnings.warnings.monologues
                    ? { text: "Above target (30s)", isWarning: true } 
                    : { text: "Within target", isWarning: false };
                    
                  const responseStatus = warnings.warnings.responseTime
                    ? { text: "Above target (3s)", isWarning: true } 
                    : { text: "Within target", isWarning: false };
                    
                  // Default turn switches status
                  const turnSwitchesStatus = { 
                    text: "Good engagement", 
                    isWarning: false 
                  };
                    
                  return [
                    { 
                      label: "Monologues", 
                      value: monologuesTime, 
                      status: monologueStatus.text, 
                      isWarning: monologueStatus.isWarning,
                      isSuccess: !monologueStatus.isWarning,
                      explanation: "Monologues measure how long you speak without interruption. Aim to keep your monologues under our recommended maximum of 30 seconds to maintain engagement."
                    },
                    { 
                      label: "Response Time", 
                      value: responseTime, 
                      status: responseStatus.text, 
                      isWarning: responseStatus.isWarning,
                      isSuccess: !responseStatus.isWarning,
                      explanation: "Response Time measures how quickly you reply after the prospect finishes speaking. An optimal response time is 1-3 seconds - quick enough to be engaged but giving you time to process what was said."
                    },
                    { 
                      label: "Turn Switches", 
                      value: turnSwitches.toString(), 
                      status: turnSwitchesStatus.text, 
                      isWarning: turnSwitchesStatus.isWarning,
                      isSuccess: !turnSwitchesStatus.isWarning,
                      explanation: "Turn Switches count how many times the conversation switches between you and the prospect. An optimal range of 20-30 switches indicates a balanced, interactive conversation with good back-and-forth dialogue."
                    },
                  ];
                })().map((metric) => (
                  <div
                    key={metric.label}
                    className="text-center p-4 rounded-xl bg-white/50 backdrop-blur-sm transition-all duration-300 hover:bg-white/70 relative"
                  >
                    <p className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent hover:scale-110 transition-transform duration-300">
                      {metric.value}
                    </p>
                    <div className="flex items-center justify-center gap-1 mt-1">
                      <p className="text-sm text-gray-600">{metric.label}</p>
                      <Info 
                        className="h-3.5 w-3.5 text-gray-400 cursor-pointer hover:text-gray-600 transition-colors duration-200" 
                        onClick={() => setActivePopup(activePopup === metric.label ? null : metric.label)}
                      />
                    </div>
                    <p className={`text-xs ${metric.isWarning ? "text-red-500" : "text-green-500"} mt-1`}>
                      {metric.status}
                    </p>
                    
                    <div className={`absolute z-20 left-0 right-0 top-full mt-1 p-2 bg-white rounded-lg shadow-lg border border-gray-200 text-left transition-opacity duration-200 ${activePopup === metric.label ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                      <p className="text-xs text-gray-700">{metric.explanation}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4">
                <button
                  onClick={() => setShowTips(!showTips)}
                  className="w-full bg-white justify-center text-gray-900 hover:text-gray-900 hover:bg-gray-100 rounded-[15px] py-2 px-4 transition-all duration-300 border border-gray-200 font-medium flex items-center"
                >
                  {showTips ? (
                    <>
                      Hide Tips
                      <ChevronUp className="ml-2 h-5 w-5" />
                    </>
                  ) : (
                    <>
                      Show Tips
                      <ChevronDown className="ml-2 h-5 w-5" />
                    </>
                  )}
                </button>
                {showTips && (
                  <div className="bg-white p-4 rounded-xl mt-4 transform transition-all duration-300 hover:scale-[1.02] hover:shadow-md">
                    <p className="text-xs text-indigo-900">
                      <span className="font-semibold">💡 Pro Tips:</span>
                    </p>
                    <ul className="list-disc list-inside text-xs text-gray-700 mt-2 space-y-2">
                      <li>Let the prospect speak more by using follow-up questions.</li>
                      <li>Maintain shorter responses to encourage prospect engagement.</li>
                      <li>Use the pause technique: wait 2-3 seconds after the prospect finishes speaking before responding.</li>
                      <li>Practice active listening to show you value the prospect's input.</li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Most Used Phrases Section */}
          <div className="bg-white border border-[#dddddd] rounded-[20px] p-4 relative z-10">
            <h3 className="text-[15px] font-bold text-[#5b06be] mb-3">Most Used Phrases</h3>
            <div className="flex flex-wrap gap-2">
              {mostUsedPhrases.flatMap((phrase) => 
                phrase.split(", ").map((word) => (
                  <span
                    key={word}
                    className="bg-[#fef8eb] text-yellow-700 px-3 py-1 rounded-full text-sm font-medium transition-all duration-300 hover:bg-[#fde8b9] hover:shadow-sm cursor-pointer transform hover:scale-105 border border-yellow-200"
                  >
                    {word}
                  </span>
                ))
              )}
            </div>
          </div>

          {/* Speaking Pace Section */}
          <div className="bg-white border border-[#dddddd] rounded-[20px] p-4 relative z-10">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[15px] font-bold text-[#5b06be]">Speaking Pace</h3>
              {warnings.warnings.speakingPace ? (
                <div className="flex items-center gap-2">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                  </span>
                  <span className="text-sm font-medium text-red-600">Action Needed</span>
                </div>
              ) : (
                <span className="text-sm font-bold text-green-600">Optimal</span>
              )}
            </div>
            <div className="space-y-2">
              <div className="relative h-2 rounded-full overflow-visible bg-gradient-to-r from-red-500 via-green-500 to-red-500 transition-all duration-300 hover:opacity-80">
                <div 
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-6 w-1.5 bg-[#4A0099] rounded-full shadow-md z-50"
                  style={{ 
                    left: `${Math.min(Math.max(((speakingPace - 100) / 80) * 100, 0), 100)}%` 
                  }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-3">
                <span>&lt;100 words per minute</span>
                <span>&gt;180 words per minute</span>
              </div>
              <p className="text-sm text-gray-700 font-semibold">Your average speaking pace: <span className="text-[#5b06be]">{speakingPace} words per minute</span></p>
              <p className="text-sm text-gray-500">Ideal range for clear communication: 120-160 words per minute</p>
              <div className={`p-3 rounded-md ${warnings.warnings.speakingPace ? 'bg-red-50' : 'bg-green-50'}`}>
                <p className={`text-sm ${warnings.warnings.speakingPace ? 'text-red-700' : 'text-green-700'}`}>
                  <span className="font-semibold">Tip:</span> {warnings.warnings.speakingPace 
                    ? `Aim for a speaking pace between 120-160 words per minute. ${speakingPace < 120 
                        ? 'Speaking too slowly can cause listeners to lose interest.' 
                        : 'Speaking too quickly can make it hard for listeners to follow along.'}`
                    : 'Maintain this pace for optimal engagement. Slow down slightly when explaining complex concepts or emphasizing key points.'}
                </p>
              </div>
            </div>
          </div>

          {/* Sentence Length Section */}
          <div className="bg-white border border-[#dddddd] rounded-[20px] p-4 relative z-10">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[15px] font-bold text-[#5b06be]">Sentence Length</h3>
              <div className="flex items-center gap-2">
                {warnings.warnings.sentenceLength ? (
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                    </span>
                    <span className="text-sm font-medium text-red-600">Action Needed</span>
                  </div>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <span className="text-sm font-bold text-green-600">Good</span>
                  </>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <div className="relative h-2 rounded-full overflow-visible bg-gradient-to-r from-red-500 via-green-500 to-red-500 transition-all duration-300">
                {/* Current value marker */}
                <div 
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-6 w-1.5 bg-[#4A0099] rounded-full shadow-md z-50"
                  style={{ 
                    left: `${Math.min(Math.max(((averageSentenceLength) / 40) * 100, 0), 100)}%` 
                  }}
                ></div>
              </div>
              <div className="flex justify-between items-center text-xs text-gray-500 mt-3">
                <span>0 words</span>
                <span>40+ words</span>
              </div>
              <p className="text-sm text-gray-700 font-semibold">Your average sentence length is <span className="text-[#5b06be]">{averageSentenceLength} words</span></p>
              <p className="text-sm text-gray-500">
                Keep your sentences 7-30 words long to make your point faster and more accurate.
              </p>
            </div>
          </div>

          {/* Filler Words Section */}
          <div className="bg-white border border-[#dddddd] rounded-[20px] p-4 relative z-10">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[15px] font-bold text-[#5b06be]">Filler Words</h3>
              {warnings.warnings.fillerWords ? (
                <div className="flex items-center gap-2">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                  </span>
                  <span className="text-sm font-medium text-red-600">Action Needed</span>
                </div>
              ) : (
                <span className="text-sm font-bold text-green-600">Below target (5%)</span>
              )}
            </div>
            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-3xl font-bold text-purple-600 transition-all duration-300 hover:scale-110 cursor-pointer">
                {fillerWordsPercentage}%
              </span>
              <span className="text-sm text-gray-600">of total words</span>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {fillerWordsUsed.map((word) => (
                <span
                  key={word}
                  className="bg-white text-purple-700 px-3 py-1 rounded-full text-sm font-medium transition-all duration-300 hover:bg-gray-50 hover:shadow-sm cursor-pointer transform hover:scale-105 border border-purple-200"
                >
                  {word}
                </span>
              ))}
            </div>

            <div className="mt-4 bg-purple-50 p-3 rounded-md border border-purple-200">
              <p className="text-sm text-purple-700">
                <span className="font-semibold">Tip:</span> To reduce filler words, try pausing briefly instead. This
                gives you time to gather your thoughts and can make you sound more confident and articulate.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
