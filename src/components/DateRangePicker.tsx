"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";
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

  React.useEffect(() => {
    setSelectedRange(dateRange);
  }, [dateRange]);

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
              <span>Pick a date</span>
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
