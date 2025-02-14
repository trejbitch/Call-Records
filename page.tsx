src/app/embed/call-records-av/page.tsx





'use client'

import CallAnalysisDashboard from '@/components/call-analysis-dashboard'

export default function CallRecordsPage() {
  return (
    <main className="embed-view">
      <div className="dynamic-height-container">
        <div className="dynamic-height-content">
          <CallAnalysisDashboard />
        </div>
      </div>
    </main>
  )
}
