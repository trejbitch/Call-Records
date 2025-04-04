src/utils/date.ts





export function isDateInRange(date: Date, start: Date, end: Date) {
  const checkDate = new Date(date)
  checkDate.setHours(0, 0, 0, 0)

  const startDate = new Date(start)
  startDate.setHours(0, 0, 0, 0)

  const endDate = new Date(end)
  endDate.setHours(23, 59, 59, 999)

  // Debug information 
  console.log('Date checking:', {
    checkDate: checkDate.toISOString(),
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
    isInRange: checkDate >= startDate && checkDate <= endDate
  });

  return checkDate >= startDate && checkDate <= endDate
}

export function getDateRangeFromPreset(preset: string): { from: Date; to: Date } {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

  switch (preset) {
    case "this-week": {
      const first = today.getDate() - today.getDay()
      const last = first + 6
      return {
        from: new Date(today.setDate(first)),
        to: new Date(today.setDate(last)),
      }
    }
    case "last-week": {
      const first = today.getDate() - today.getDay() - 7
      const last = first + 6
      return {
        from: new Date(today.setDate(first)),
        to: new Date(today.setDate(last)),
      }
    }
    case "last-7-days": {
      const from = new Date(today)
      from.setDate(from.getDate() - 6)
      return { from, to: today }
    }
    case "this-month": {
      return {
        from: new Date(today.getFullYear(), today.getMonth(), 1),
        to: new Date(today.getFullYear(), today.getMonth() + 1, 0),
      }
    }
    case "last-14-days": {
      const from = new Date(today)
      from.setDate(from.getDate() - 13)
      return { from, to: today }
    }
    case "last-30-days": {
      const from = new Date(today)
      from.setDate(from.getDate() - 29)
      return { from, to: today }
    }
    default:
      return { from: new Date(0), to: new Date() }
  }
}
