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

export function CallDetails() {
  const [isSaved, setIsSaved] = useState(false)

  useEffect(() => {
    if (isSaved) {
      const timer = setTimeout(() => setIsSaved(false), 2000)
      return () => clearTimeout(timer)
    }
  }, [isSaved])

  return (
    <div className="space-y-4 px-4 pt-8">
      <h2 className="text-xl font-bold text-[#5b06be] mb-2">Call Details</h2>

      {/* Key Moments Card */}
      <Card className="border border-[#dddddd] relative z-10 rounded-[20px] overflow-hidden transition-all duration-300">
        <KeyMoments />
      </Card>

      {/* Call Notes and Manager's Feedback */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Call Notes Card */}
        <Card className="border border-[#dddddd] relative z-10 rounded-[20px] overflow-hidden transition-all duration-300 h-[280px]">
          <CardHeader className="pb-2 bg-white">
            <CardTitle className="text-base font-bold text-[#5b06be]">Call Notes</CardTitle>
          </CardHeader>
          <CardContent className="pt-2 px-6 pb-6 h-[calc(100%-60px)] flex flex-col">
            <div className="space-y-4 flex-grow overflow-y-auto">
              <div className="h-full flex flex-col">
                <Textarea
                  placeholder="Add your call notes here..."
                  className="resize-none rounded-[15px] border-gray-200 placeholder:text-gray-400 outline-none ring-0 focus:ring-0 focus:border-[#5b06be] focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 flex-grow p-4 hover:border-gray-200"
                />
              </div>
            </div>
            <Button
              className={`w-full mt-4 rounded-[15px] transition-all duration-300 ${
                isSaved ? "bg-green-500 hover:bg-green-600" : "bg-[#5b06be] hover:bg-[#6c17cf]"
              } text-white font-medium py-2 flex items-center justify-center`}
              onClick={() => setIsSaved(true)}
            >
              {isSaved ? "Saved!" : "Save"}
            </Button>
          </CardContent>
        </Card>

        {/* Manager's Feedback Card */}
        <Card className="!shadow-none border border-[#dddddd] relative z-10 rounded-[20px] overflow-hidden transition-all duration-300 h-[280px]">
          <CardHeader className="pb-2 bg-white">
            <CardTitle className="text-base font-bold text-[#5b06be]">Manager's Feedback</CardTitle>
          </CardHeader>
          <CardContent className="pt-2 px-6 pb-6 h-[calc(100%-60px)] flex flex-col">
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
          </CardContent>
        </Card>
      </div>

      {/* Call Recording Card */}
      <Card className="border border-[#dddddd] relative z-10 rounded-[20px] overflow-hidden transition-all duration-300">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-bold text-[#5b06be]">Call Recording</CardTitle>
        </CardHeader>
        <CardContent className="pt-2 px-6 pb-6">
          <CallPlayer />
        </CardContent>
      </Card>

      {/* Call Transcript Card */}
      <Card className="border border-[#dddddd] relative z-10 rounded-[20px] overflow-hidden transition-all duration-300">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-bold text-[#5b06be]">Call Transcript</CardTitle>
        </CardHeader>
        <CardContent className="pt-2 px-6 pb-6">
          <CallTranscript />
        </CardContent>
      </Card>

      {/* Language Analysis Card */}
      <Card className="border border-[#dddddd] relative z-10 rounded-[20px] overflow-hidden transition-all duration-300">
        <LanguageAnalysis />
      </Card>

      {/* Listening Skills Card */}
      <Card className="border border-[#dddddd] relative z-10 rounded-[20px] overflow-hidden transition-all duration-300">
        <CardHeader className="pb-2 bg-white">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-bold text-[#5b06be]">
              Listening Skills
            </CardTitle>
            <div className="flex items-center gap-2 bg-white px-3 py-1 rounded-full shadow-sm">
              <span className="text-sm font-medium text-gray-600">Score:</span>
              <span className="text-lg font-semibold text-[#5b06be]">80/100</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-2 px-6 pb-6">
          <div className="space-y-6">
            {/* Analysis */}
            <div className="border border-[#dddddd] rounded-[20px] p-6">
              <h4 className="text-[15px] font-bold text-[#5b06be] mb-3">Analysis</h4>
              <p className="text-gray-700">
                You did not fully address the homeowner's concerns about the property's market value. When the homeowner
                mentioned recent renovations, you missed an opportunity to gather more detailed information about these
                improvements. It's crucial to actively listen and ask follow-up questions to gain a comprehensive
                understanding of the property's condition and potential value.
              </p>
            </div>

            {/* Key Listening Skills to Focus On */}
            <div className="bg-[#f3f0ff] rounded-[20px] p-4 shadow-sm">
              <h4 className="text-[15px] font-bold text-[#5b06be] mb-3">Key Listening Skills to Focus On</h4>
              <ul className="grid grid-cols-2 gap-4">
                {["Active Listening", "Empathy", "Clarifying Questions", "Paraphrasing"].map((skill) => (
                  <li
                    key={skill}
                    className="flex items-center gap-3 bg-white p-3 rounded-lg shadow-sm transition-all duration-300 hover:shadow-md hover:translate-x-1 group"
                  >
                    <div className="bg-[#f3f0ff] rounded-full p-2 group-hover:bg-[#ebe5ff] transition-colors duration-300">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
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
                    <span className="font-medium text-gray-700 group-hover:text-[#5b06be] transition-colors duration-300">
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
