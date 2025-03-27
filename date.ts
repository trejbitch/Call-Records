src/utils/date.ts





/**
 * Checks if a date is within a specified date range
 * @param date The date to check
 * @param from The start date of the range
 * @param to The end date of the range
 * @returns true if the date is within the range, false otherwise
 */
export function isDateInRange(date: Date, from: Date, to: Date): boolean {
    // Set hours, minutes, seconds, and milliseconds to 0 for from date
    const fromDate = new Date(from);
    fromDate.setHours(0, 0, 0, 0);
    
    // Set hours, minutes, seconds, and milliseconds to 23:59:59.999 for to date
    const toDate = new Date(to);
    toDate.setHours(23, 59, 59, 999);
    
    return date >= fromDate && date <= toDate;
  }
  
  /**
   * Formats a date string to a short display format
   * @param dateString The date string to format
   * @returns Formatted date string (e.g., "Jan 8, 2025")
   */
  export function formatDateShort(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }
  
  /**
   * Formats a date string to include time
   * @param dateString The date string to format
   * @returns Formatted date and time string (e.g., "Jan 8, 2025, 6:33 PM")
   */
  export function formatDateTime(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  }
  
  /**
   * Parses a formatted date string in the format "Mon DD, YYYY, HH:MM AM/PM"
   * @param dateString The formatted date string to parse
   * @returns Date object
   */
  export function parseFormattedDate(dateString: string): Date {
    // Handle empty or undefined input
    if (!dateString) {
      return new Date();
    }
    
    // Parse the date string
    const parts = dateString.match(/(\w+)\s+(\d+),\s+(\d+),\s+(\d+):(\d+)\s+(\w+)/);
    if (!parts) {
      return new Date();
    }
    
    const [_, month, day, year, hour, minute, ampm] = parts;
    
    // Convert month name to month number
    const months: Record<string, number> = {
      Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
      Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11
    };
    
    // Parse hour in 12-hour format
    let hourNum = parseInt(hour, 10);
    if (ampm.toLowerCase() === 'pm' && hourNum < 12) {
      hourNum += 12;
    } else if (ampm.toLowerCase() === 'am' && hourNum === 12) {
      hourNum = 0;
    }
    
    return new Date(
      parseInt(year, 10),
      months[month] || 0,
      parseInt(day, 10),
      hourNum,
      parseInt(minute, 10)
    );
  }
