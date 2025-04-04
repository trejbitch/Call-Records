src/components/ui/date-range-picker.tsx







"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { getDateRangeFromPreset } from "@/utils/date"
import { format } from "date-fns"
import { useState } from "react"

interface DateRangePickerProps {
  onChange?: (range: { from: Date; to: Date }) => void
  fromDate?: Date | null
}

export function DateRangePicker({ onChange, fromDate }: DateRangePickerProps) {
  const [month, setMonth] = React.useState(new Date())
  const [selectedRange, setSelectedRange] = React.useState<{ from: Date; to: Date | null }>({
    from: new Date(),
    to: null,
  })
  const [isAllTime, setIsAllTime] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [hoverDate, setHoverDate] = useState<Date | null>(null)

  const quickSelects = [
    { label: "This Week", value: "this-week" },
    { label: "Last Week", value: "last-week" },
    { label: "Last 7 Days", value: "last-7-days" },
    { label: "This Month", value: "this-month" },
    { label: "Last 14 Days", value: "last-14-days" },
    { label: "Last 30 Days", value: "last-30-days" },
  ]

  const days = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]

  const handleDateSelect = (date: Date) => {
    setIsAllTime(false)
    if (!selectedRange.from || selectedRange.to) {
      setSelectedRange({ from: date, to: null })
    } else {
      const range = {
        from: selectedRange.from < date ? selectedRange.from : date,
        to: selectedRange.from < date ? date : selectedRange.from,
      }
      setSelectedRange({ from: range.from, to: range.to })
      onChange?.(range)
    }
  }

  const handleQuickSelect = (preset: string) => {
    setIsAllTime(false)
    const range = getDateRangeFromPreset(preset)
    setSelectedRange({ from: range.from, to: range.to })
    onChange?.(range)
  }

  const handleAllTime = () => {
    const minDate = fromDate || new Date(0);
    const range = { from: minDate, to: new Date() }
    setSelectedRange({ from: range.from, to: range.to })
    setIsAllTime(true)
    onChange?.(range)
    setIsOpen(false)
  }

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const days = []
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)

    for (let i = 0; i < firstDay.getDay(); i++) {
      days.push(null)
    }

    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i))
    }

    return days
  }

  const isSelected = (date: Date) => {
    if (!date) return false
    const isStart = date.toDateString() === selectedRange.from?.toDateString()
    const isEnd = date.toDateString() === selectedRange.to?.toDateString()
    return isStart || isEnd
  }

  const isInRange = (date: Date) => {
    if (!date || !selectedRange.from || !selectedRange.to) return false
    return date > selectedRange.from && date < selectedRange.to
  }

  const isInHoverRange = (date: Date) => {
    if (!date || !selectedRange.from || !hoverDate || selectedRange.to) return false
    const start = selectedRange.from < hoverDate ? selectedRange.from : hoverDate
    const end = selectedRange.from < hoverDate ? hoverDate : selectedRange.from
    return date >= start && date <= end
  }

  const isDateDisabled = (date: Date | null): boolean => {
    if (!date) return true;
    
    if (fromDate) {
      const dateToCheck = new Date(date);
      dateToCheck.setHours(0, 0, 0, 0);
      
      const minDate = new Date(fromDate);
      minDate.setHours(0, 0, 0, 0);
      
      return dateToCheck < minDate;
    }
    
    return false;
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="gap-2 bg-white rounded-[15px] hover:bg-gray-100">
          {/* Using an img tag to display the calendar icon */}
          <img 
            src="https://res.cloudinary.com/drkudvyog/image/upload/v1734437402/calendar_icon_2_efgdme.png" 
            alt="Calendar" 
            className="w-5 h-5 object-contain"
          />
          <span className="font-medium">
            {isAllTime
              ? "All time"
              : selectedRange.from && selectedRange.to
                ? `${format(selectedRange.from, "MMM d, yyyy")} - ${format(selectedRange.to, "MMM d, yyyy")}`
                : "Pick a date range"}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 z-[9999] bg-white shadow-lg rounded-[20px]" align="end" sideOffset={4}>
        <div className="space-y-4 p-4 rounded-[20px]">
          <Button 
            variant="outline" 
            className="w-full rounded-[20px] text-center font-medium bg-white hover:bg-gray-100 border-gray-200" 
            onClick={handleAllTime}
          >
            {/* Using an img tag for All time button icon */}
            <img 
              src="https://res.cloudinary.com/drkudvyog/image/upload/v1734437402/calendar_icon_2_efgdme.png" 
              alt="Calendar" 
              className="w-5 h-5 object-contain mr-2"
            />
            All time
          </Button>

          <div className="grid grid-cols-2 gap-8">
            {[month, new Date(month.getFullYear(), month.getMonth() + 1)].map((currentMonth, i) => (
              <div key={i} className="space-y-4">
                <div className="text-xl font-bold">
                  {currentMonth.toLocaleString("default", { month: "long", year: "numeric" })}
                </div>
                <div className="grid grid-cols-7 gap-2 text-center">
                  {days.map((day) => (
                    <div key={day} className="text-sm font-medium text-gray-600">
                      {day}
                    </div>
                  ))}
                  {getDaysInMonth(currentMonth).map((date, i) => (
                    <Button
                      key={i}
                      variant="ghost"
                      className={cn(
                        "h-8 w-8 p-0 font-medium rounded-[12px] hover:bg-gray-100",
                        !date && "invisible",
                        date && isSelected(date) && "bg-[#5b06be] text-white hover:bg-[#5b06be] hover:text-white",
                        date && (isInRange(date) || isInHoverRange(date)) && "bg-[#f3f0ff]",
                        date && isDateDisabled(date) && "text-gray-300 hover:bg-white cursor-not-allowed"
                      )}
                      disabled={!date || (date && isDateDisabled(date))}
                      onClick={() => {
                        if (date && !isDateDisabled(date)) {
                          handleDateSelect(date);
                        }
                      }}
                      onMouseEnter={() => {
                        if (date && !isDateDisabled(date)) {
                          setHoverDate(date);
                        }
                      }}
                      onMouseLeave={() => setHoverDate(null)}
                    >
                      {date?.getDate()}
                    </Button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1))}
              className="text-gray-900 hover:bg-gray-100"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1))}
              className="text-gray-900 hover:bg-gray-100"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {quickSelects.map((option) => (
              <Button
                key={option.value}
                variant="outline"
                className="w-full rounded-[20px] border-gray-200 bg-white hover:bg-gray-100 text-gray-900 font-medium"
                onClick={() => handleQuickSelect(option.value)}
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
