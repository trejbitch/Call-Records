src/components/ui/charts-section.tsx






"use client"

import { useState, useEffect } from "react"
import { ChevronUp, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ChartCard } from "./chart-card"
import { cn } from "@/lib/utils"
import { LoadingSpinner } from "@/components/ui/chart-loading"

// Define proper types for our data
interface CallRecord {
  callNumber: number;
  scores: Record<string, number>;
  // Add other fields as needed
}

interface ChartDataPoint {
  name: string;
  value: number;
}

type ChartData = Record<string, ChartDataPoint[]> | null;

interface ChartsSectionProps {
  calls: CallRecord[];
}

// Use sessionStorage to persist state across page navigation
const getStoredExpandedState = () => {
  if (typeof window !== 'undefined') {
    return sessionStorage.getItem('chartsExpanded') === 'true';
  }
  return false;
};

const setStoredExpandedState = (value: boolean) => {
  if (typeof window !== 'undefined') {
    sessionStorage.setItem('chartsExpanded', value.toString());
  }
};

// Cache the processed data to prevent recalculation
let cachedChartData: ChartData = null;
let cachedCalls: CallRecord[] | null = null;

function formatCategoryName(key: string): string {
  // First split the camelCase into words
  const words = key.replace(/([A-Z])/g, ' $1').trim().split(' ');
  // Capitalize first letter of each word
  return words.map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

function processCallHistory(calls: CallRecord[]): ChartData {
  if (calls.length === 0) return null;
  
  const categories = [
    "Engagement",
    "Objection Handling",
    "Information Gathering",
    "Program Explanation",
    "Closing Skills",
    "Effectiveness",
  ];

  const processedData = categories.reduce(
    (acc, category) => {
      const categoryKey = category.replace(/\s+/g, '');
      acc[categoryKey] = calls.map((call) => ({
        name: `Call ${call.callNumber}`,
        value: call.scores[category] || 0,
      }));
      return acc;
    },
    {} as Record<string, ChartDataPoint[]>
  );

  processedData.overall = calls.map((call) => ({
    name: `Call ${call.callNumber}`,
    value: Math.round(Object.values(call.scores).reduce((sum, score) => sum + score, 0) / categories.length),
  }));

  return processedData;
}

export function ChartsSection({ calls }: ChartsSectionProps) {
  // Use sessionStorage for persistent expanded state
  const [isExpanded, setIsExpanded] = useState(() => getStoredExpandedState());
  
  // Initialize state from storage on mount
  useEffect(() => {
    // Force re-render once on client side to ensure correct expanded state
    setIsExpanded(getStoredExpandedState());
  }, []);
  
  // Calculate metrics only once
  const getChartData = () => {
    // Return cached data if calls haven't changed
    if (cachedCalls === calls && cachedChartData) {
      return cachedChartData;
    }
    
    const data = processCallHistory(calls);
    cachedCalls = calls;
    cachedChartData = data;
    return data;
  };
  
  const chartData = getChartData();

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
  ];

  // Calculate average score for a metric
  const getAverageScore = (metric: string): number => {
    if (calls.length === 0) return 0;
    
    if (metric === "Overall Performance") {
      // Calculate overall average by first getting the average for each call, then averaging those
      return Math.round(
        calls.reduce((sum, call) => {
          const callAvg = Object.values(call.scores).reduce((a, b) => a + b, 0) / Object.keys(call.scores).length;
          return sum + callAvg;
        }, 0) / calls.length
      );
    }
    // Calculate category average
    return Math.round(
      calls.reduce((sum, call) => sum + (call.scores[metric] || 0), 0) / calls.length
    );
  };

  // Get best and worst category from chart data
  const getBestCategory = (): string => {
    if (!chartData) return "";
    
    const entries = Object.entries(chartData)
      .filter(([key]) => key !== "overall");
    
    if (entries.length === 0) return "";
    
    return formatCategoryName(
      entries.sort(
        ([, a], [, b]) =>
          (b as ChartDataPoint[]).reduce((sum: number, item: ChartDataPoint) => sum + item.value, 0) -
          (a as ChartDataPoint[]).reduce((sum: number, item: ChartDataPoint) => sum + item.value, 0)
      )[0][0]
    );
  };
  
  const getNeedsImprovementCategory = (): string => {
    if (!chartData) return "";
    
    const entries = Object.entries(chartData)
      .filter(([key]) => key !== "overall");
    
    if (entries.length === 0) return "";
    
    return formatCategoryName(
      entries.sort(
        ([, a], [, b]) =>
          (a as ChartDataPoint[]).reduce((sum: number, item: ChartDataPoint) => sum + item.value, 0) -
          (b as ChartDataPoint[]).reduce((sum: number, item: ChartDataPoint) => sum + item.value, 0)
      )[0][0]
    );
  };

  const handleToggleExpand = () => {
    const newExpandedState = !isExpanded;
    setIsExpanded(newExpandedState);
    setStoredExpandedState(newExpandedState);
  };

  return (
    <div
      className={`space-y-4 w-full mx-auto bg-white rounded-[30px] px-4 pt-4 ${
        isExpanded ? "pb-4 mb-8" : "pb-2"
      } border border-[#ddd]`}
    >
      <div className="space-y-1">
        <h2 className="text-[19px] font-bold tracking-tight" style={{ color: "#5b06be" }}>Performance Analytics</h2>
        <p className="text-base text-black">
          Analyze your call performance across various metrics. Click to expand and view detailed charts.
        </p>
      </div>

      <Button
        variant="outline"
        onClick={handleToggleExpand}
        className="w-full bg-white justify-center text-black hover:text-black hover:bg-gray-100 rounded-[15px] transition-all duration-300 py-2 px-4 border border-[#ddd]"
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

      {/* Keep charts in DOM but hide when not expanded */}
      <div
        className={cn(
          "transition-all duration-300 ease-in-out",
          isExpanded ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0 overflow-hidden pointer-events-none"
        )}
      >
          <div className="space-y-4 pt-0 pb-4 px-0 w-full">
                <div className="space-y-6">
                  {/* Performance Summary */}
                  <div className="w-full bg-white rounded-[30px] border border-[#ddd] p-4">
                    <h3 className="text-[15px] font-bold text-[#5b06be] mb-4">Performance Summary</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {[
                        { label: "Total Calls", value: calls.length },
                        {
                          label: "Average Score",
                          value: getAverageScore("Overall Performance")
                        },
                        {
                          label: "Best Category",
                    value: getBestCategory()
                        },
                        {
                          label: "Needs Improvement",
                    value: getNeedsImprovementCategory()
                        },
                      ].map((item, index) => (
                        <div
                          key={item.label}
                          className="text-center p-3 rounded-[20px] bg-white border border-[#ddd]"
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
                  forceRender={false}
                      >
                        <Button 
                          variant="ghost" 
                          className="text-gray-500 border border-solid border-[#ddd] hover:bg-transparent hover:text-gray-700 hover:border-[#ddd]"
                        >
                          Details
                        </Button>
                      </ChartCard>
                    </div>
                    {/* Rest of the charts in 3x2 grid */}
                    <div className="grid gap-4 md:grid-cols-3 w-full">
                      {metrics.slice(1).map((metric) => (
                        <ChartCard
                          key={metric.title}
                          title={metric.title}
                          score={getAverageScore(metric.title)}
                          data={calls}
                          icon={metric.icon}
                          isInteractive={true}
                    forceRender={false}
                        >
                          <Button 
                            variant="ghost" 
                            className="text-gray-500 border border-solid border-[#ddd] hover:bg-transparent hover:text-gray-700 hover:border-[#ddd]"
                          >
                            Details
                          </Button>
                        </ChartCard>
                      ))}
                    </div>
                  </div>
          </div>
        </div>
      </div>
      
      {isExpanded && (
        <Button
          variant="outline"
          onClick={handleToggleExpand}
          className="w-full mt-4 bg-white justify-center text-black hover:text-black hover:bg-gray-100 rounded-[15px] transition-all duration-300 py-2 px-4"
        >
          Hide Charts
          <ChevronUp className="ml-2 h-5 w-4" />
        </Button>
      )}
    </div>
  );
}
