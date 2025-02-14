src/components/ui/charts-section.tsx






"use client"

import { useState, useEffect } from "react"
import { ChevronUp, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ChartCard } from "./chart-card"
import { cn } from "@/lib/utils"
import { LoadingSpinner } from "@/components/ui/chart-loading"

function formatCategoryName(key: string): string {
  // First split the camelCase into words
  const words = key.replace(/([A-Z])/g, ' $1').trim().split(' ')
  // Capitalize first letter of each word
  return words.map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
}

function processCallHistory(calls: any[]) {
  const categories = [
    "Engagement",
    "Objection Handling",
    "Information Gathering",
    "Program Explanation",
    "Closing Skills",
    "Effectiveness",
  ]

  const processedData = categories.reduce(
    (acc, category) => {
      const categoryKey = category.replace(/\s+/g, '')
      const categoryScores = calls.map((call) => call.scores[category])
      const averageScore = categoryScores.reduce((sum, score) => sum + score, 0) / calls.length
      acc[categoryKey] = calls.map((call, index) => ({
        name: `Call ${call.callNumber}`,
        value: call.scores[category],
      }))
      return acc
    },
    {} as Record<string, { name: string; value: number }[]>,
  )

  processedData.overall = calls.map((call) => ({
    name: `Call ${call.callNumber}`,
    value: Math.round(Object.values(call.scores).reduce((sum, score) => sum + score, 0) / categories.length),
  }))

  return processedData
}

export function ChartsSection({ calls }: { calls: any[] }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)
    return () => clearTimeout(timer)
  }, [])

  const metrics = [
    { 
      title: "Overall Performance", 
      icon: <img src="https://res.cloudinary.com/drkudvyog/image/upload/v1739386701/Average_Success_ip5jtc.png" alt="Overall Performance" className="w-10 h-10" />
    },
    { 
      title: "Engagement", 
      icon: <img src="https://res.cloudinary.com/drkudvyog/image/upload/v1739386701/Engagement_za1bae.png" alt="Engagement" className="w-10 h-10" />
    },
    { 
      title: "Objection Handling", 
      icon: <img src="https://res.cloudinary.com/drkudvyog/image/upload/v1739386702/Objection_Handling_m2xnou.png" alt="Objection Handling" className="w-10 h-10" />
    },
    { 
      title: "Information Gathering", 
      icon: <img src="https://res.cloudinary.com/drkudvyog/image/upload/v1739386701/Information_Gathering_m178u1.png" alt="Information Gathering" className="w-10 h-10" />
    },
    { 
      title: "Program Explanation", 
      icon: <img src="https://res.cloudinary.com/drkudvyog/image/upload/v1739386702/Program_Explanation_xglm24.png" alt="Program Explanation" className="w-10 h-10" />
    },
    { 
      title: "Closing Skills", 
      icon: <img src="https://res.cloudinary.com/drkudvyog/image/upload/v1739386701/Closing_Skills_il6npz.png" alt="Closing Skills" className="w-10 h-10" />
    },
    { 
      title: "Effectiveness", 
      icon: <img src="https://res.cloudinary.com/drkudvyog/image/upload/v1739386701/Overall_Effectiveness_ofsbpm.png" alt="Effectiveness" className="w-10 h-10" />
    },
  ]

  const getAverageScore = (metric: string) => {
    if (metric === "Overall Performance") {
      return Math.round(
        calls.reduce((sum, call) => {
          const scores = Object.values(call.scores)
          return sum + scores.reduce((a, b) => a + b, 0) / scores.length
        }, 0) / calls.length,
      )
    }
    return Math.round(
      calls.reduce((sum, call) => sum + call.scores[metric], 0) / calls.length,
    )
  }

  const chartData = processCallHistory(calls)

  return (
    <div
      className={`space-y-4 w-full mx-auto bg-white rounded-[30px] px-6 pt-4 ${
        isExpanded ? "pb-4 mb-8" : "pb-2"
      } shadow-[0_0_30px_rgba(0,0,0,0.1)]`}
    >
      <div className="space-y-1">
        <h2 className="text-2xl font-bold" style={{ color: "#5b06be" }}>Performance Analytics</h2>
        <p className="text-base text-black">
          Analyze your call performance across various metrics. Click to expand and view detailed charts.
        </p>
      </div>

      <Button
        variant="outline"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full bg-white justify-center text-black hover:text-black hover:bg-gray-100 rounded-[15px] transition-all duration-300 py-2 px-4"
      >
        {isExpanded ? (
          <>
            Hide Charts
            <ChevronUp className="ml-2 h-5 w-4" />
          </>
        ) : (
          <>
            View Charts
            <ChevronDown className="ml-2 h-5 w-4" />
          </>
        )}
      </Button>

      <div
        className={cn(
          "grid gap-4 transition-all duration-500 ease-in-out",
          isExpanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
        )}
      >
        <div className="overflow-hidden">
          <div className="space-y-4 pt-0 pb-4 px-2 w-full">
            {isLoading ? (
              <LoadingSpinner />
            ) : (
              isExpanded && (
                <div className="space-y-6">
                  {/* Performance Summary */}
                  <div className="bg-white rounded-[30px] p-6 shadow-lg relative z-10 transition-all duration-300 hover:shadow-xl mb-6">
                    <h3 className="text-[15px] font-bold text-[#5b06be] mb-4">Performance Summary</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      {[
                        { label: "Total Calls", value: calls.length },
                        {
                          label: "Average Score",
                          value: Math.round(
                            chartData.overall.reduce((sum, item) => sum + item.value, 0) / chartData.overall.length,
                          ),
                        },
                        {
                          label: "Best Category",
                          value: formatCategoryName(Object.entries(chartData)
                            .filter(([key]) => key !== "overall")
                            .sort(
                              ([, a], [, b]) =>
                                b.reduce((sum, item) => sum + item.value, 0) -
                                a.reduce((sum, item) => sum + item.value, 0),
                            )[0][0])
                        },
                        {
                          label: "Needs Improvement",
                          value: formatCategoryName(Object.entries(chartData)
                            .filter(([key]) => key !== "overall")
                            .sort(
                              ([, a], [, b]) =>
                                a.reduce((sum, item) => sum + item.value, 0) -
                                b.reduce((sum, item) => sum + item.value, 0),
                            )[0][0])
                        },
                      ].map((item, index) => (
                        <div
                          key={item.label}
                          className="text-center p-3 rounded-[20px] bg-white shadow-lg relative z-10 transition-all duration-300 hover:shadow-xl cursor-pointer"
                        >
                          <p className="text-xs font-semibold text-gray-600 mb-1">{item.label}</p>
                          <p
                            className={`text-sm font-extrabold ${
                              index === 2 ? "text-green-600" : 
                              index === 3 ? "text-amber-600" : 
                              (item.label === "Total Calls" || item.label === "Average Score") ? "text-[#5b06be]" : "text-purple-600"
                            }`}
                          >
                            {item.value}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Charts */}
                  <div>
                    {/* First chart spans full width */}
                    <div className="w-full mb-4">
                      <ChartCard
                        key={metrics[0].title}
                        title={metrics[0].title}
                        score={getAverageScore(metrics[0].title)}
                        data={calls}
                        icon={metrics[0].icon}
                        isInteractive={true}
                        className="shadow-[0_2px_10px_rgba(0,0,0,0.05)]"
                      />
                    </div>
                    {/* Rest of the charts in 3x2 grid */}
                    <div className="grid gap-4 md:grid-cols-3 w-full relative">
                      {metrics.slice(1).map((metric) => (
                        <ChartCard
                          key={metric.title}
                          title={metric.title}
                          score={getAverageScore(metric.title)}
                          data={calls}
                          icon={metric.icon}
                          isInteractive={true}
                          className="shadow-[0_2px_10px_rgba(0,0,0,0.05)]"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </div>
      {isExpanded && (
        <Button
          variant="outline"
          onClick={() => setIsExpanded(false)}
          className="w-full mt-4 bg-white justify-center text-black hover:text-black hover:bg-gray-100 rounded-[15px] transition-all duration-300 py-2 px-4"
        >
          Hide Charts
          <ChevronUp className="ml-2 h-5 w-4" />
        </Button>
      )}
    </div>
  )
}
