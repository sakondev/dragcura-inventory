"use client";

import * as React from "react";
import { addDays, format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";
import { useEffect, useState } from "react"; // Import useEffect and useState

import { cn } from "@/lib/utils"; // Adjust based on your utility path
import { Button } from "@/components/ui/button"; // Adjust based on your component path
import { Calendar } from "@/components/ui/calendar"; // Adjust based on your component path
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"; // Adjust based on your component path

interface DateRangePickerProps {
  dateRange: DateRange | undefined;
  onDateRangeChange: (range: DateRange | undefined) => void;
  saleDates: Date[];
}

export function DateRangePicker({
  dateRange,
  onDateRangeChange,
  saleDates,
}: DateRangePickerProps) {
  const [selectedRange, setSelectedRange] = React.useState<
    DateRange | undefined
  >(dateRange);

  const [latestDate, setLatestDate] = useState<Date | null>(null); // State for latest date

  const disabledDate = (date: Date) => {
    return !saleDates.some(
      (saleDate) =>
        saleDate.getFullYear() === date.getFullYear() &&
        saleDate.getMonth() === date.getMonth() &&
        saleDate.getDate() === date.getDate()
    );
  };

  const handleDateSelect = (range: DateRange | undefined) => {
    // ถ้ามีแค่ range.from แต่ไม่มี range.to
    if (range && range.from && !range.to) {
      // ใช้ range.from เป็นทั้ง from และ to
      onDateRangeChange({ from: range.from, to: range.from });
    } else {
      // ส่งค่าทั้ง from และ to
      onDateRangeChange(range);
    }
    setSelectedRange(range);
  };

  useEffect(() => {
    // Fetch the latest date from /sales_date API
    const fetchLatestDate = async () => {
      const response = await fetch("/sales_date"); // Adjust the API endpoint as needed
      const data = await response.json();
      const latest = new Date(data.latestDate); // Assuming the API returns an object with latestDate
      setLatestDate(latest);
    };

    fetchLatestDate();
  }, []); // Run once on component mount

  return (
    <div className="flex-1 min-w-[200px]">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={`w-full justify-start text-left font-normal ${
              !selectedRange && "text-muted-foreground"
            }`}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {selectedRange?.from ? (
              selectedRange.to ? (
                <>
                  {format(selectedRange.from, "LLL dd, y")} -{" "}
                  {format(selectedRange.to, "LLL dd, y")}
                </>
              ) : (
                format(selectedRange.from, "LLL dd, y")
              )
            ) : (
              <span>
                {latestDate ? format(latestDate, "LLL dd, y") : "Pick a date"}
              </span> // Show latest date or default text
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={selectedRange?.from}
            selected={selectedRange}
            onSelect={handleDateSelect}
            numberOfMonths={2}
            disabled={disabledDate}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
