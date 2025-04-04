src/app/embed/call-records-av/page.tsx





'use client'

import { useSearchParams } from 'next/navigation'
import CallAnalysisDashboard from '@/components/ui/call-analysis-dashboard'

export default function CallRecordsPage() {
  const searchParams = useSearchParams()
  const memberId = searchParams.get('memberId') || ''
  const teamId = searchParams.get('teamId') || ''

  return (
    <main className="w-full h-full m-0 p-0">
      <CallAnalysisDashboard memberId={memberId} teamId={teamId} />
    </main>
  )
}
