src/components/call-analysis-dashboard.tsx






"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { ChartsSection } from "@/components/ui/charts-section"
import { CallRecord } from "@/components/ui/call-record"
import { DateRangePicker } from "@/components/ui/date-range-picker"
import { isDateInRange } from "@/utils/date"
import { useCallRecords } from "@/hooks/use-call-records-av"
import { HeightReporter } from "@/components/ui/height-reporter"

// Template for pending calls
const pendingCallTemplate = {
  scores: {
    Engagement: 0,
    "Objection Handling": 0,
    "Information Gathering": 0,
    "Program Explanation": 0,
    "Closing Skills": 0,
    Effectiveness: 0,
  },
  avatar: "/placeholder.svg",
  isPending: true
}

interface CallAnalysisDashboardProps {
  memberId?: string;
  teamId?: string;
}

export default function CallAnalysisDashboard({ memberId = "test-member", teamId }: CallAnalysisDashboardProps) {
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: new Date(0),
    to: new Date(),
  })
  const [firstCallDate, setFirstCallDate] = useState<Date | null>(null);
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5
  // Track whether any details are expanded
  const [isAnyDetailExpanded, setIsAnyDetailExpanded] = useState(false)
  // Track if user is viewing charts
  const [isViewingCharts, setIsViewingCharts] = useState(true)
  // Track refresh state
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Fetch all call records (both pending and completed) using a single query
  const { 
    calls: allCalls, 
    isLoading,
    error, 
    refetch: refetchAllCalls
  } = useCallRecords({
    memberId,
    teamId,
    dateRange,
    status: 'all' // Fetch all records regardless of status
  })
  
  // After loading calls, determine the earliest call date
  useEffect(() => {
    if (!isLoading && !error && allCalls.length > 0) {
      // Find the date of the first call by sorting all dates
      const dates = allCalls
        .map(call => new Date(call.date || Date.now()))
        .filter(date => !isNaN(date.getTime())) // Filter out invalid dates
        .sort((a, b) => a.getTime() - b.getTime()); // Sort ascending
      
      if (dates.length > 0) {
        const earliestDate = dates[0];
        // Set the first call date for the date picker
        setFirstCallDate(earliestDate);
        
        // If our current from date is before the first call, update it
        if (dateRange.from < earliestDate) {
          console.log('Updating date range to start from first call:', earliestDate);
          setDateRange(prev => ({
            ...prev,
            from: earliestDate
          }));
        }
      }
    }
  }, [allCalls, isLoading, error]);

  // Process the calls to add any UI-specific properties
  const processedCalls = allCalls.map(call => {
    if (call.status === 'pending') {
      return {
        ...call,
        ...pendingCallTemplate,
        id: call.id,
        call_number: call.call_number,
        member_id: call.member_id,
        team_id: call.team_id,
        session_id: call.session_id,
        name: call.name || `Call #${call.call_number} (Processing...)`,
        date: new Date().toLocaleString(),
        duration: "Processing...",
        isPending: true,
        botName: call.bot_name || "Processing...",
        botPicture: call.bot_picture || "/placeholder.svg",
        user_talk_percentage: 46,
        bot_talk_percentage: 54,
        monologues_time: "0s",
        response_time: "0s",
        turn_switches: 0,
        most_used_phrases: "",
        speaking_pace: 0,
        average_sentence_length: 0,
        filler_words_percentage: 0,
        filler_words_used: "",
        listening_skills_analysis: "",
        notes_score: 0,
        listening_skills_score: 0
      };
    }
    // For completed records, ensure we have all required fields
    return {
      ...call,
      isPending: false,
      botName: call.bot_name || "Real Estate Coach",
      botPicture: call.bot_picture || "/placeholder.svg",
      name: call.name || `Call #${call.call_number}`,
      user_talk_percentage: parseFloat(String(call.user_talk_percentage)) || 46,
      bot_talk_percentage: parseFloat(String(call.bot_talk_percentage)) || 54,
      monologues_time: call.monologues_time || "0s",
      response_time: call.response_time || "0s",
      turn_switches: call.turn_switches || 0,
      most_used_phrases: call.most_used_phrases || "",
      speaking_pace: call.speaking_pace || 0,
      average_sentence_length: call.average_sentence_length || 0,
      filler_words_percentage: call.filler_words_percentage || 0,
      filler_words_used: call.filler_words_used || "",
      listening_skills_analysis: call.listening_skills_analysis || "",
      notes_score: call.notes_score ?? 0,
      listening_skills_score: call.listening_skills_score ?? 0
    };
  });

  // Handle manual refresh
  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    await refetchAllCalls();
    setIsRefreshing(false);
  };

  // Auto-refresh only when needed (not viewing charts, no expanded details)
  useEffect(() => {
    const hasPendingCalls = processedCalls.some(call => call.status === 'pending');
    
    // Only auto-refresh if there are pending calls AND user is not viewing details or charts
    if (hasPendingCalls && !isAnyDetailExpanded && !isViewingCharts) {
      const interval = setInterval(() => {
        refetchAllCalls();
      }, 30000); // Every 30 seconds
      
      return () => clearInterval(interval);
    }
  }, [processedCalls, isAnyDetailExpanded, isViewingCharts, refetchAllCalls]);

  // Handle details toggle
  const handleDetailsToggle = (expanded: boolean) => {
    setIsAnyDetailExpanded(expanded);
  }

  // IMPORTANT: First determine if we have any call data at all
  const hasAnyCallData = !isLoading && !error && allCalls.length > 0;
  
  // Then filter the calls by date range
  const filteredCalls = processedCalls.filter((call) => {
    if (!call.date) return false;
    
    // Ensure we're parsing the date correctly - some dates might be in different formats
    let callDate;
    try {
      callDate = new Date(call.date);
      // Check if the date is valid
      if (isNaN(callDate.getTime())) {
        console.log('Invalid date found:', call.date);
        return false;
      }
    } catch (e) {
      console.log('Error parsing date:', call.date, e);
      return false;
    }
    
    const result = isDateInRange(callDate, dateRange.from, dateRange.to);
    return result;
  });
  
  // Then determine if we have filtered data or not
  const hasNoCallData = !hasAnyCallData; // No calls at all
  const hasCallsButNoneInDateRange = hasAnyCallData && filteredCalls.length === 0; // Has calls but none in date range

  // Debug logging to understand state
  console.log({
    hasAnyCallData,
    allCallsLength: allCalls.length,
    filteredCallsLength: filteredCalls.length,
    hasNoCallData,
    hasCallsButNoneInDateRange,
    dateRange: {
      from: dateRange.from.toISOString(),
      to: dateRange.to.toISOString()
    }
  });

  const totalPages = Math.max(1, Math.ceil(filteredCalls.length / itemsPerPage));
  
  // Reset to first page when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [dateRange.from, dateRange.to]);
  
  // Get the current page of calls
  const currentPageCalls = filteredCalls.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  
  // Don't add empty slots anymore - just use the actual records
  const paginatedCalls = [...currentPageCalls];
  
  // Handle refetch
  const handleRefetch = () => {
    refetchAllCalls();
  }

  // Generate a limited set of page numbers to display
  const getPageNumbers = () => {
    const maxPagesToShow = 5;
    
    if (totalPages <= maxPagesToShow) {
      // If we have 5 or fewer pages, show all of them
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    
    // Always show first page, last page, current page, and pages adjacent to current
    let pageNumbers = [1, totalPages, currentPage];
    
    // Add pages before and after current page
    if (currentPage > 1) pageNumbers.push(currentPage - 1);
    if (currentPage < totalPages) pageNumbers.push(currentPage + 1);
    
    // Remove duplicates and sort
    pageNumbers = Array.from(new Set(pageNumbers)).sort((a, b) => a - b);
    
    // Now add ellipses where needed
    const result = [];
    for (let i = 0; i < pageNumbers.length; i++) {
      // Add the page number
      result.push(pageNumbers[i]);
      
      // Check if we need to add ellipsis
      if (i < pageNumbers.length - 1 && pageNumbers[i + 1] - pageNumbers[i] > 1) {
        result.push('ellipsis' + i);
      }
    }
    
    return result;
  };
  
  const pageNumbers = getPageNumbers();

  return (
    <div className="min-h-screen bg-[#ffffff]">
      <HeightReporter />
      <div className="w-full">
        <div className="bg-white p-8">
          {/* Header with date picker - only show date picker if we have calls */}
          <div className="flex items-center justify-between mb-4">
            <h1 className="flex items-center gap-2 text-[21px] font-bold text-gray-900">
              <img 
                src="https://res.cloudinary.com/drkudvyog/image/upload/v1739457048/Call_records_icon_duha_xziw0t.png" 
                alt="Long Form Training Charts" 
                className="w-8 h-8"
              /> 
              Long Form Training Charts
            </h1>
            {hasAnyCallData && (
              <div className="flex items-center gap-3">
                <DateRangePicker onChange={setDateRange} fromDate={firstCallDate} />
              </div>
            )}
          </div>

          {/* Charts Section with mouse tracking */}
          <div 
            onMouseEnter={() => setIsViewingCharts(true)}
            onMouseLeave={() => setIsViewingCharts(false)}
          >
            {isLoading ? (
              <div className="bg-white rounded-[30px] border border-[#ddd] p-8 text-center my-8">
                <div className="flex justify-center mb-4">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#5b06be] border-r-transparent"></div>
                </div>
                <h3 className="text-lg font-semibold text-gray-700">Loading chart data...</h3>
              </div>
            ) : hasNoCallData ? (
              <div className="bg-white rounded-[30px] border border-[#ddd] p-8 text-center my-8">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Start Your First Call</h3>
                <p className="text-gray-500">Complete calls to unlock performance insights and visual analytics dashboards.</p>
              </div>
            ) : hasCallsButNoneInDateRange ? (
              <div className="bg-white rounded-[30px] border border-[#ddd] p-8 text-center my-8">
                <div className="flex flex-col items-center">
                  <div className="rounded-full bg-gray-100 p-4 mb-4">
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      width="32" 
                      height="32" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="#777777" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    >
                      <path d="M8 18L12 22L16 18"></path>
                      <path d="M12 2V22"></path>
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">No Call Data in Selected Date Range</h3>
                  <p className="text-gray-500 max-w-md">
                    Adjust your date filter to view call analytics for other time periods.
                  </p>
                </div>
              </div>
            ) : (
              <ChartsSection calls={processedCalls} />
            )}
          </div>

          <hr className="border-t border-gray-200 my-8" />

          {/* Call Records */}
          <div className="mt-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="flex items-center gap-2 text-[21px] font-bold text-gray-900">
                <img 
                  src="https://res.cloudinary.com/drkudvyog/image/upload/v1739457048/Call_Records_duha_axwqva.png" 
                  alt="Long Form Training Call Records" 
                  className="w-8 h-8"
                /> 
                Long Form Training Call Records
              </h2>
              
              {/* Duplicate pagination controls for top of section */}
              {filteredCalls.length > 0 && (
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
                  {pageNumbers.map((page, index) => (
                    typeof page === 'number' ? (
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
                    ) : (
                      <span key={page} className="px-1">...</span>
                    )
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
              )}
            </div>

            <div>
              {isLoading && filteredCalls.length === 0 ? (
                <div className="w-full py-8 text-center">
                  <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#5b06be] border-r-transparent"></div>
                  <p className="mt-2 text-gray-600">Loading call records...</p>
                </div>
              ) : error ? (
                <div className="w-full border border-red-300 py-4 px-6 text-center text-red-500 rounded-md bg-red-50">
                  Error loading call records. Please try again later.
                </div>
              ) : filteredCalls.length > 0 ? (
                <div className="space-y-6">
                  {/* Container for call records - ensure full width */}
                  <div>
                    {paginatedCalls.map((call, index) => (
                      <div key={call.session_id || `record-${index}`} className="relative w-full mb-6">
                        <CallRecord
                          name={call.name}
                          callNumber={call.call_number}
                          date={call.date}
                          duration={call.duration}
                          avatar={call.avatar}
                          scores={call.scores}
                          isEmpty={call.isEmpty}
                          isPending={call.isPending}
                          sessionId={call.session_id}
                          memberId={call.member_id}
                          onFeedbackSaved={handleRefetch}
                          onExpandToggle={handleDetailsToggle}
                          // Pass the text descriptions and content
                          scoreDescriptions={call.scoreDescriptions}
                          powerMoment={call.power_moment}
                          keyWins={call.key_wins}
                          areasForGrowth={call.areas_for_growth}
                          callNotes={call.call_notes}
                          callTranscript={call.call_transcript}
                          callRecording={call.call_recording}
                          botName={call.bot_name}
                          botPicture={call.bot_picture}
                          // Add user_name from the call record
                          userName={call.user_name}
                          userPicture={call.user_picture}
                          // Add managers feedback
                          managers_feedback={call.managers_feedback}
                          // Language analysis data
                          userTalkPercentage={Number(call.user_talk_percentage) || 46}
                          botTalkPercentage={Number(call.bot_talk_percentage) || 54}
                          monologuesTime={call.monologues_time}
                          responseTime={call.response_time}
                          turnSwitches={call.turn_switches}
                          mostUsedPhrases={call.most_used_phrases}
                          speakingPace={call.speaking_pace}
                          averageSentenceLength={call.average_sentence_length}
                          fillerWordsPercentage={call.filler_words_percentage}
                          fillerWordsUsed={call.filler_words_used}
                          listeningSkillsAnalysis={call.listening_skills_analysis}
                          notesScore={call.notes_score ?? 80}
                          listeningSkillsScore={call.listening_skills_score ?? 80}
                        />
                      </div>
                    ))}
                  </div>

                  {/* Pagination Controls - position at the top when fewer records */}
                  <div className={`flex flex-col items-center justify-center border-t border-gray-200 pt-4 ${paginatedCalls.length < 3 ? "mt-4" : "mt-8"}`}>
                    <div className="flex items-center gap-2 mb-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="h-8 w-8 p-0"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      {pageNumbers.map((page, index) => (
                        typeof page === 'number' ? (
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
                        ) : (
                          <span key={page} className="px-1">...</span>
                        )
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
                    <div className="text-center">
                      <p className="text-sm text-gray-700">
                        {filteredCalls.length > 0 
                          ? `Displaying calls ${(currentPage - 1) * itemsPerPage + 1} - ${Math.min(currentPage * itemsPerPage, filteredCalls.length)} of ${filteredCalls.length}`
                          : "No call records to display"}
                      </p>
                    </div>
                  </div>
                </div>
              ) : hasNoCallData ? (
                <div className="w-full border border-[#ddd] rounded-[30px] py-10 px-6 text-center">
                  <div className="flex flex-col items-center">
                    <div className="rounded-full bg-purple-100 p-4 mb-4">
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        width="32" 
                        height="32" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="#5b06be" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                      >
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Your Call History Will Appear Here</h3>
                    <p className="text-gray-500 max-w-md">
                      After completing calls, you'll see detailed performance metrics, conversation analytics, and actionable insights in this space.
                    </p>
                  </div>
                </div>
              ) : hasCallsButNoneInDateRange ? (
                <div className="w-full border border-[#ddd] rounded-[30px] py-10 px-6 text-center">
                  <div className="flex flex-col items-center">
                    <div className="rounded-full bg-gray-100 p-4 mb-4">
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        width="32" 
                        height="32" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="#777777" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                      >
                        <path d="M8 18L12 22L16 18"></path>
                        <path d="M12 2V22"></path>
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">No Call Records Found</h3>
                    <p className="text-gray-500 max-w-md">
                      Try adjusting your date filter to view call records from other time periods.
                    </p>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
