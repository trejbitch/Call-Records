src/components/ui/empty-state.tsx





import { SearchX } from "lucide-react"

export function EmptyState() {
  return (
    <div className="rounded-[20px] bg-white p-12 shadow-sm flex flex-col items-center justify-center space-y-4">
      <SearchX className="w-16 h-16 text-purple-300" />
      <h3 className="text-xl font-semibold text-slate-700">No Call Records Found</h3>
      <p className="text-slate-600 text-center max-w-md">
        There are no call records available for the selected time period. Try adjusting your date range or filters.
      </p>
    </div>
  )
}
