src/components/ui/key-moments.tsx






import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, ArrowUpCircle } from "lucide-react"

const keyWins = [
  "Strong rapport building with personal connection",
  "Effective handling of price objection with market data",
  "Professional and confident communication style",
]

const areasForGrowth = [
  "Deeper exploration of seller motivation needed",
  "More assertive closing approach recommended",
  "Could use more social proof and success stories",
]

export function KeyMoments() {
  return (
    <Card className="border-none shadow-sm relative z-10 rounded-[20px] md:col-span-2 overflow-hidden transition-all duration-300 hover:shadow-md">
      <CardHeader className="pb-2 bg-white">
        <CardTitle className="text-base font-bold text-[#5b06be]">Key Moments & Insights</CardTitle>
      </CardHeader>
      <CardContent className="pt-2 px-6 pb-6">
        <div className="grid grid-cols-1 gap-6">
          {/* Power Moment */}
          <div className="bg-purple-50 rounded-[20px] p-6 shadow-sm">
            <h3 className="text-lg font-bold text-purple-800 mb-4 flex items-center gap-2">
              <span className="text-yellow-500 text-2xl">⚡</span>
              Power Moment
            </h3>
            <div className="bg-white p-4 rounded-lg shadow-sm transition-all duration-300 hover:shadow-md hover:translate-x-1 group">
              <div>
                <h4 className="font-bold text-[#5b06be] group-hover:text-purple-700 transition-colors duration-300">
                  Excellent objection handling
                </h4>
                <p className="text-sm font-semibold text-gray-600 mt-1">
                  When the client expressed concerns about the market conditions, you provided data-driven insights that
                  effectively addressed their worries.
                </p>
              </div>
            </div>
          </div>

          {/* Key Wins */}
          <div className="bg-green-100 rounded-[20px] p-6 shadow-sm border border-green-200 transition-all duration-300 hover:shadow-md hover:border-green-300">
            <h3 className="text-lg font-bold text-green-800 mb-4">Key Wins</h3>
            <ul className="space-y-3">
              {keyWins.map((win, index) => (
                <li key={index} className="flex items-start gap-2 group">
                  <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                  <span className="text-sm font-semibold text-green-700">{win}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Areas for Growth */}
          <div className="bg-[#fef8eb] rounded-[20px] p-6 shadow-sm border border-yellow-100 transition-all duration-300 hover:shadow-md hover:border-yellow-200">
            <h3 className="text-lg font-bold text-yellow-800 mb-4">Areas for Growth</h3>
            <ul className="space-y-3">
              {areasForGrowth.map((area, index) => (
                <li key={index} className="flex items-start gap-2 group">
                  <ArrowUpCircle className="h-5 w-5 text-yellow-600 shrink-0 mt-0.5" />
                  <span className="text-sm font-semibold text-yellow-700">{area}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
