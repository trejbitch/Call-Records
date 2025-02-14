src/components/call-analysis-dashboard.tsx






"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { ChartsSection } from "@/components/ui/charts-section"
import { CallRecord } from "@/components/ui/call-record"
import { DateRangePicker } from "@/components/ui/date-range-picker"
import { EmptyState } from "@/components/ui/empty-state"
import { isDateInRange } from "@/utils/date"

const calls = [
  {
    name: "Jessica",
    callNumber: 11,
    date: "Jan 8, 2025, 06:33 PM",
    duration: "11 seconds",
    avatar: "/placeholder.svg",
    scores: {
      Engagement: 98,
      "Objection Handling": 95,
      "Information Gathering": 96,
      "Program Explanation": 97,
      "Closing Skills": 95,
      Effectiveness: 98,
    },
  },
  {
    name: "Linda",
    callNumber: 10,
    date: "Jan 5, 2025, 12:44 AM",
    duration: "3 seconds",
    avatar: "/placeholder.svg",
    scores: {
      Engagement: 85,
      "Objection Handling": 82,
      "Information Gathering": 88,
      "Program Explanation": 80,
      "Closing Skills": 85,
      Effectiveness: 84,
    },
  },
  {
    name: "Michael",
    callNumber: 9,
    date: "Jan 4, 2025, 03:15 PM",
    duration: "5 seconds",
    avatar: "/placeholder.svg",
    scores: {
      Engagement: 55,
      "Objection Handling": 45,
      "Information Gathering": 50,
      "Program Explanation": 60,
      "Closing Skills": 48,
      Effectiveness: 52,
    },
  },
  {
    name: "Sarah",
    callNumber: 8,
    date: "Jan 3, 2025, 11:20 AM",
    duration: "8 seconds",
    avatar: "/placeholder.svg",
    scores: {
      Engagement: 25,
      "Objection Handling": 30,
      "Information Gathering": 15,
      "Program Explanation": 20,
      "Closing Skills": 35,
      Effectiveness: 25,
    },
  },
  {
    name: "Robert",
    callNumber: 7,
    date: "Jan 2, 2025, 10:15 AM",
    duration: "7 seconds",
    avatar: "/placeholder.svg",
    scores: {
      Engagement: 92,
      "Objection Handling": 88,
      "Information Gathering": 90,
      "Program Explanation": 95,
      "Closing Skills": 89,
      Effectiveness: 91,
    },
  },
  {
    name: "Emily",
    callNumber: 6,
    date: "Jan 1, 2025, 09:30 AM",
    duration: "6 seconds",
    avatar: "/placeholder.svg",
    scores: {
      Engagement: 78,
      "Objection Handling": 75,
      "Information Gathering": 80,
      "Program Explanation": 82,
      "Closing Skills": 77,
      Effectiveness: 78,
    },
  },
  {
    name: "David",
    callNumber: 5,
    date: "Dec 31, 2024, 02:45 PM",
    duration: "9 seconds",
    avatar: "/placeholder.svg",
    scores: {
      Engagement: 88,
      "Objection Handling": 85,
      "Information Gathering": 87,
      "Program Explanation": 89,
      "Closing Skills": 86,
      Effectiveness: 87,
    },
  },
  {
    name: "Amanda",
    callNumber: 4,
    date: "Dec 30, 2024, 11:20 AM",
    duration: "4 seconds",
    avatar: "/placeholder.svg",
    scores: {
      Engagement: 95,
      "Objection Handling": 92,
      "Information Gathering": 93,
      "Program Explanation": 94,
      "Closing Skills": 91,
      Effectiveness: 93,
    },
  },
  {
    name: "James",
    callNumber: 3,
    date: "Dec 29, 2024, 03:15 PM",
    duration: "10 seconds",
    avatar: "/placeholder.svg",
    scores: {
      Engagement: 72,
      "Objection Handling": 70,
      "Information Gathering": 75,
      "Program Explanation": 73,
      "Closing Skills": 71,
      Effectiveness: 72,
    },
  },
  {
    name: "Sophie",
    callNumber: 2,
    date: "Dec 28, 2024, 01:30 PM",
    duration: "6 seconds",
    avatar: "/placeholder.svg",
    scores: {
      Engagement: 83,
      "Objection Handling": 80,
      "Information Gathering": 85,
      "Program Explanation": 82,
      "Closing Skills": 81,
      Effectiveness: 82,
    },
  },
  {
    name: "William",
    callNumber: 1,
    date: "Dec 27, 2024, 10:45 AM",
    duration: "7 seconds",
    avatar: "/placeholder.svg",
    scores: {
      Engagement: 68,
      "Objection Handling": 65,
      "Information Gathering": 70,
      "Program Explanation": 67,
      "Closing Skills": 66,
      Effectiveness: 67,
    },
  },
]

export default function CallAnalysisDashboard() {
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: new Date(0),
    to: new Date(),
  })
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  const filteredCalls = calls.filter((call) => isDateInRange(new Date(call.date), dateRange.from, dateRange.to))
  const totalPages = Math.ceil(filteredCalls.length / itemsPerPage)
  const paginatedCalls = filteredCalls.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  return (
    <div className="min-h-screen bg-[#f0f2f5]">
      <div className="container mx-auto py-8 px-4">
        <div className="bg-white rounded-[30px] shadow-xl border border-gray-200 p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h1 className="flex items-center gap-2 text-3xl font-bold text-gray-900">
              <img 
                src="https://res.cloudinary.com/drkudvyog/image/upload/v1739457048/Call_records_icon_duha_xziw0t.png" 
                alt="Charts" 
                className="w-8 h-8"
              /> 
              Charts
            </h1>
            <DateRangePicker onChange={setDateRange} />
          </div>

          {/* Charts Section */}
          <ChartsSection calls={calls} />

          <hr className="border-t border-gray-200 my-8" />

          {/* Call Records */}
          <div className="mt-8">
            <h2 className="mb-6 flex items-center gap-2 text-3xl font-bold text-gray-900">
              <img 
                src="https://res.cloudinary.com/drkudvyog/image/upload/v1739457048/Call_Records_duha_axwqva.png" 
                alt="Call Records" 
                className="w-8 h-8"
              /> 
              Call Records
            </h2>

            {filteredCalls.length > 0 ? (
              <div>
                <div className="space-y-6">
                  {paginatedCalls.map((call) => (
                    <CallRecord
                      key={call.callNumber}
                      name={call.name}
                      callNumber={call.callNumber}
                      date={call.date}
                      duration={call.duration}
                      avatar={call.avatar}
                      scores={call.scores}
                    />
                  ))}
                </div>

                {/* Pagination Controls */}
                <div className="mt-8 flex items-center justify-between border-t border-gray-200 pt-4">
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-gray-700">
                      Displaying calls {(currentPage - 1) * itemsPerPage + 1} -{" "}
                      {Math.min(currentPage * itemsPerPage, filteredCalls.length)} of {filteredCalls.length}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="h-8 w-8 p-0"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                        className={`h-8 w-8 p-0 ${
                          currentPage === page ? "bg-[#5b06be] text-white hover:bg-[#5b06be]/90" : ""
                        }`}
                      >
                        {page}
                      </Button>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="h-8 w-8 p-0"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <EmptyState />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
