src/hooks/use-call-records-av.ts





import { useState, useEffect, useRef } from 'react';
// Ensure any date utility functions used are imported from the standard date utils
import { isDateInRange } from '@/utils/date';

// Type definition for call records from the API
export interface CallRecord {
  id: number;
  call_number: number;
  member_id: string;
  team_id: string;
  session_id: string;
  name: string;  // This is bot_name from the database
  date: string;
  duration: string;
  avatar: string; // This is bot_picture from the database
  status: string;
  scores: {
    Engagement: number;
    "Objection Handling": number;
    "Information Gathering": number;
    "Program Explanation": number;
    "Closing Skills": number;
    Effectiveness: number;
  };
  // Additional fields for descriptions
  scoreDescriptions?: {
    engagement_text?: string;
    objection_handling_text?: string;
    information_gathering_text?: string;
    program_explanation_text?: string;
    closing_skills_text?: string;
    effectiveness_text?: string;
  };
  // Additional fields that may be useful
  power_moment?: string;
  key_wins?: string;
  areas_for_growth?: string;
  call_notes?: string;
  managers_feedback?: string;
  call_recording?: string;
  call_transcript?: string;
  isEmpty?: boolean; // Used for pagination
  isPending?: boolean; // For pending records being processed
  bot_name?: string;
  bot_picture?: string;
  user_name?: string;
  user_picture?: string;
  user_talk_percentage?: number;
  bot_talk_percentage?: number;
  monologues_time?: string;
  response_time?: string;
  turn_switches?: number;
  most_used_phrases?: string;
  speaking_pace?: number;
  average_sentence_length?: number;
  filler_words_percentage?: number;
  filler_words_used?: string;
  listening_skills_analysis?: string;
  notes_score?: number;
  listening_skills_score?: number;
}

// Interface for the hook parameters
interface UseCallRecordsParams {
  memberId: string;
  teamId?: string;
  dateRange?: { from: Date; to: Date };
  status?: 'pending' | 'completed' | 'all';
}

// Interface for the hook return value
interface UseCallRecordsResult {
  calls: CallRecord[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useCallRecords({ 
  memberId, 
  teamId, 
  dateRange,
  status = 'completed' 
}: UseCallRecordsParams): UseCallRecordsResult {
  const [calls, setCalls] = useState<CallRecord[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  
  // Add a ref to cache the last known state of records
  const recordsCache = useRef<{[key: string]: CallRecord}>({});

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Build query parameters - but don't filter by status on the server
      const params = new URLSearchParams();
      params.append('member_id', memberId);
      if (teamId) params.append('team_id', teamId);
      // Important: We don't filter by status on the server to ensure we get all records
      // We'll handle filtering client-side to ensure session tracking works properly
      
      const response = await fetch(`/api/call-records-av?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error(`Error fetching call records: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Transform database records to the format expected by the UI
      const transformedCalls: CallRecord[] = data.data.map((record: any) => {
        const transformedRecord = {
          id: record.id,
          call_number: record.call_number,
          member_id: record.member_id,
          team_id: record.team_id,
          session_id: record.session_id,
          name: record.bot_name || `Call #${record.call_number}`,
          date: record.call_date 
            ? new Date(record.call_date).toLocaleString('en-US', {
                month: 'short',
                day: 'numeric', 
                year: 'numeric', 
                hour: 'numeric', 
                minute: '2-digit',
                hour12: true
              })
            : new Date().toLocaleString('en-US', {
                month: 'short',
                day: 'numeric', 
                year: 'numeric', 
                hour: 'numeric', 
                minute: '2-digit',
                hour12: true
              }),
          duration: record.call_length || 'Pending...',
          avatar: record.bot_picture || '/placeholder.svg',
          status: record.status,
          scores: {
            Engagement: record.engagement_score || 0,
            "Objection Handling": record.objection_handling_score || 0,
            "Information Gathering": record.information_gathering_score || 0,
            "Program Explanation": record.program_explanation_score || 0,
            "Closing Skills": record.closing_skills_score || 0,
            Effectiveness: record.effectiveness_score || 0,
          },
          scoreDescriptions: {
            engagement_text: record.engagement_text,
            objection_handling_text: record.objection_handling_text,
            information_gathering_text: record.information_gathering_text,
            program_explanation_text: record.program_explanation_text,
            closing_skills_text: record.closing_skills_text,
            effectiveness_text: record.effectiveness_text,
          },
          power_moment: record.power_moment,
          key_wins: record.key_wins,
          areas_for_growth: record.areas_for_growth,
          call_notes: record.call_notes,
          managers_feedback: record.managers_feedback,
          call_recording: record.call_recording,
          call_transcript: record.call_transcript,
          isPending: record.status === 'pending',
          bot_name: record.bot_name || "Real Estate Coach",
          bot_picture: record.bot_picture || "/placeholder.svg",
          user_name: record.user_name || "You",
          user_picture: record.user_picture || "/placeholder.svg",
          user_talk_percentage: parseFloat(record.user_talk_percentage) || 46,
          bot_talk_percentage: parseFloat(record.bot_talk_percentage) || 54,
          monologues_time: record.monologues_time || "0s",
          response_time: record.response_time || "0s",
          turn_switches: record.turn_switches || 0,
          most_used_phrases: record.most_used_phrases || "",
          speaking_pace: record.speaking_pace || 0,
          average_sentence_length: record.average_sentence_length || 0,
          filler_words_percentage: record.filler_words_percentage || 0,
          filler_words_used: record.filler_words_used || "",
          listening_skills_analysis: record.listening_skills_analysis || "",
          notes_score: record.notes_score || 0,
          listening_skills_score: record.listening_skills_score || 0
        };

        // Cache the record using session_id as key
        recordsCache.current[record.session_id] = transformedRecord;
        return transformedRecord;
      });
      
      // Filter by date range if provided
      let filteredCalls = transformedCalls;
      if (dateRange && dateRange.from && dateRange.to) {
        filteredCalls = transformedCalls.filter(call => {
          if (!call.date) return false;
          const callDate = new Date(call.date);
          return isDateInRange(callDate, dateRange.from, dateRange.to);
        });
      }

      // Get the current session ID from sessionStorage if available
      const currentSessionId = typeof window !== 'undefined' ? window.sessionStorage.getItem('current_session_id') : null;

      // Filter by status client-side, but ALWAYS include the current session
      if (status !== 'all') {
        filteredCalls = filteredCalls.filter(call => {
          // Include the call if it matches the status filter
          const matchesStatusFilter = call.status === status;
          
          // OR if it's the current session being processed (regardless of status)
          const isCurrentSession = currentSessionId && call.session_id === currentSessionId;
          
          return matchesStatusFilter || isCurrentSession;
        });
      }

      // Sort by call_number in descending order
      const sortedCalls = filteredCalls.sort((a, b) => b.call_number - a.call_number);
      
      setCalls(sortedCalls);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [memberId, teamId, dateRange?.from, dateRange?.to, status]);

  return { calls, isLoading, error, refetch: fetchData };
}

// Function to create a new call record (Phase 1)
export async function createPendingCallRecord(data: {
  member_id: string;
  team_id: string;
  session_id: string;
}): Promise<{ call_number: number; session_id: string; status: string }> {
  // Store the session_id in sessionStorage to track the record between status changes
  if (typeof window !== 'undefined') {
    window.sessionStorage.setItem('current_session_id', data.session_id);
  }
  
  const response = await fetch('/api/call-records-av', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to create call record');
  }
  
  const result = await response.json();
  return result.data;
}

// Function to update a call record with full details (Phase 2)
export async function updateCallRecord(data: any): Promise<any> {
  // Extract session_id and ensure it's included in the query parameters
  const { session_id } = data;
  
  if (!session_id) {
    throw new Error('Session ID is required to update a call record');
  }
  
  // Store the session_id in sessionStorage to track the record between status changes
  if (typeof window !== 'undefined') {
    window.sessionStorage.setItem('current_session_id', session_id);
  }
  
  const response = await fetch(`/api/call-records-av?session_id=${session_id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...data,
      // Only default to 'completed' if no status was provided
      status: data.status || 'completed'
    }),
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to update call record');
  }
  
  const result = await response.json();
  return result.data;
}

// Function to update call notes
export async function updateCallNotes(data: {
  member_id: string;
  session_id: string;
  call_notes: string;
}): Promise<any> {
  // Store the session_id in sessionStorage to track the record
  if (typeof window !== 'undefined' && data.session_id) {
    window.sessionStorage.setItem('current_session_id', data.session_id);
  }
  
  const response = await fetch(`/api/call-records-av?session_id=${data.session_id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      session_id: data.session_id,
      call_notes: data.call_notes
    }),
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to update call notes');
  }
  
  const result = await response.json();
  return result.data;
}

// Function to update manager feedback
export async function updateManagerFeedback(data: {
  member_id: string;
  session_id: string;
  manager_feedback: string;
}): Promise<any> {
  // Store the session_id in sessionStorage to track the record
  if (typeof window !== 'undefined' && data.session_id) {
    window.sessionStorage.setItem('current_session_id', data.session_id);
  }
  
  const response = await fetch(`/api/team-logs-av?memberId=${data.member_id}&session_id=${data.session_id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      manager_feedback: data.manager_feedback
    }),
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to update manager feedback');
  }
  
  const result = await response.json();
  return result.data;
}
