src/components/ui/language-analysis.tsx







import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, ChevronDown, ChevronUp } from "lucide-react"
import { useState } from "react"

const mostUsedPhrases = ["market value", "opportunity", "your needs", "understand", "help you"]
const fillerWordPercentage = 3.2

export function LanguageAnalysis() {
  const [showTips, setShowTips] = useState(false)

  return (
    <Card className="border-none shadow-lg relative z-10 rounded-[20px] md:col-span-2 overflow-hidden transition-all duration-300 hover:shadow-xl">
      <CardHeader className="pb-2 bg-white">
        <CardTitle className="text-base font-bold text-[#5b06be]">Language Analysis</CardTitle>
      </CardHeader>
      <CardContent className="pt-2 bg-white rounded-b-[20px] px-6">
        <div className="space-y-6">
          {/* Talk Ratio Section */}
          <div className="bg-white rounded-[20px] p-6 relative z-10 shadow-md hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[15px] font-bold text-[#5b06be]">Talk Ratio</h3>
              <div className="flex items-center gap-2">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </span>
                <span className="text-sm font-medium text-red-600">Action Needed</span>
              </div>
            </div>
            <div className="space-y-6">
              <div className="flex items-center justify-center gap-8 text-3xl font-bold">
                <div className="text-center transition-transform duration-300 hover:scale-110 cursor-pointer">
                  <span className="text-indigo-600">54%</span>
                  <p className="text-xs text-gray-500 font-normal mt-1">YOU</p>
                </div>
                <div className="text-center px-4 py-2 rounded-full bg-white/50 backdrop-blur-sm">
                  <span className="text-gray-500 text-xl">vs</span>
                </div>
                <div className="text-center transition-transform duration-300 hover:scale-110 cursor-pointer">
                  <span className="text-purple-600">46%</span>
                  <p className="text-xs text-gray-500 font-normal mt-1">PROSPECT</p>
                </div>
              </div>

              <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="absolute left-0 top-0 h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500 hover:opacity-90"
                  style={{ width: "54%" }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"></div>
                </div>
              </div>

              <p className="text-sm text-gray-600 bg-white/50 rounded-full py-2 px-4 inline-block backdrop-blur-sm">
                Target: <span className="font-semibold text-indigo-600">35% You</span> |{" "}
                <span className="font-semibold text-purple-600">65% Prospect</span>
              </p>

              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: "Monologues", value: "45s", status: "Above target (30s)", isWarning: true },
                  { label: "Response Time", value: "1.8s", status: "Within target", isSuccess: true },
                  { label: "Turn Switches", value: "24", status: "Good engagement", isSuccess: true },
                ].map((metric) => (
                  <div
                    key={metric.label}
                    className="text-center p-4 rounded-xl bg-white/50 backdrop-blur-sm transition-all duration-300 hover:bg-white/70 hover:shadow-sm cursor-pointer"
                  >
                    <p className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent hover:scale-110 transition-transform duration-300">
                      {metric.value}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">{metric.label}</p>
                    <p className={`text-xs ${metric.isWarning ? "text-red-500" : "text-green-500"} mt-1`}>
                      {metric.status}
                    </p>
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
                    <p className="text-sm text-indigo-900">
                      <span className="font-semibold">💡 Pro Tips:</span>
                    </p>
                    <ul className="list-disc list-inside text-sm text-gray-700 mt-2 space-y-2">
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
          <div className="bg-white rounded-[20px] p-4 relative z-10 shadow-md hover:shadow-lg transition-shadow duration-300">
            <h3 className="text-[15px] font-bold text-[#5b06be] mb-3">Most Used Phrases</h3>
            <div className="flex flex-wrap gap-2">
              {mostUsedPhrases.map((phrase) => (
                <span
                  key={phrase}
                  className="bg-[#fef8eb] text-yellow-700 px-3 py-1 rounded-full text-sm font-medium transition-all duration-300 hover:bg-[#fde8b9] hover:shadow-sm cursor-pointer transform hover:scale-105 border border-yellow-200"
                >
                  {phrase}
                </span>
              ))}
            </div>
          </div>

          {/* Speaking Pace Section */}
          <div className="bg-white rounded-[20px] p-4 relative z-10 shadow-md hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[15px] font-bold text-[#5b06be]">Speaking Pace</h3>
              <span className="text-sm font-medium text-green-600 animate-pulse">Optimal</span>
            </div>
            <div className="relative pt-1">
              <div className="flex mb-2 items-center justify-between">
                <div>
                  <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-green-600 bg-green-200">
                    85%
                  </span>
                </div>
              </div>
              <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-green-200">
                <div
                  style={{ width: "85%" }}
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500"
                ></div>
              </div>
            </div>
            <div className="space-y-2 mt-3">
              <p className="text-sm text-gray-600">
                Your average speaking pace: <span className="font-semibold">150 words per minute</span>
              </p>
              <p className="text-sm text-gray-600">Ideal range for clear communication: 120-160 words per minute</p>
              <div className="bg-green-100 p-3 rounded-md">
                <p className="text-sm text-green-700">
                  <span className="font-semibold">Tip:</span> Maintain this pace for optimal engagement. Slow down
                  slightly when explaining complex concepts or emphasizing key points.
                </p>
              </div>
            </div>
          </div>

          {/* Sentence Length Section */}
          <div className="bg-white rounded-[20px] p-4 relative z-10 shadow-md hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[15px] font-bold text-[#5b06be]">Sentence Length</h3>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span className="text-sm font-medium text-green-600">Good</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="relative h-2 rounded-full overflow-hidden bg-gradient-to-r from-red-500 via-green-500 to-red-500 transition-all duration-300 hover:opacity-80">
                <div className="absolute left-[15%] top-1/2 -translate-y-1/2 h-4 w-1 bg-black rounded-full transition-all duration-300 hover:scale-110"></div>
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>&lt;6</span>
                <span className="text-center">7-30 words</span>
                <span>&gt;43</span>
              </div>
              <p className="text-sm text-gray-700">Your average sentence length is 8 words</p>
              <p className="text-sm text-gray-500">
                Keep your sentences 7-30 words long to make your point faster and more accurate.
              </p>
            </div>
          </div>

          {/* Filler Words Section */}
          <div className="bg-white rounded-[20px] p-4 relative z-10 shadow-md hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[15px] font-bold text-[#5b06be]">Filler Words</h3>
              <span className="text-sm font-medium text-green-600">Below target (5%)</span>
            </div>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-3xl font-bold text-purple-600 transition-all duration-300 hover:scale-110 cursor-pointer">
                {fillerWordPercentage}%
              </span>
              <span className="text-sm text-gray-600">of total words</span>
            </div>
            <p className="text-sm text-gray-600 mb-3">Common filler words used: um, uh, like, you know</p>

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
