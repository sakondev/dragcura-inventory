import React from 'react';
import { DatePicker } from 'antd';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { DateRange } from 'react-day-picker';

const { RangePicker } = DatePicker;

interface DateRangePickerProps {
  dateRange: DateRange | undefined;
  onDateRangeChange: (range: DateRange | undefined) => void;
  saleDates: Date[];
}

export function DateRangePicker({ dateRange, onDateRangeChange, saleDates }: DateRangePickerProps) {
  const disabledDate = (current: Dayjs) => {
    return !saleDates.some(
      (saleDate) =>
        saleDate.getFullYear() === current.year() &&
        saleDate.getMonth() === current.month() &&
        saleDate.getDate() === current.date()
    );
  };

  const handleChange = (dates: [Dayjs | null, Dayjs | null] | null) => {
    if (dates && dates[0] && dates[1]) {
      const from = dates[0].toDate();
      const to = dates[1].toDate();
      onDateRangeChange({
        from: from,
        to: to.getTime() === from.getTime() ? from : to, // If dates are the same, use the same date for both values
      });
    } else {
      onDateRangeChange(undefined);
    }
  };

  return (
    <RangePicker
      style={{ width: '300px' }}
      disabledDate={disabledDate}
      value={dateRange ? [dayjs(dateRange.from), dayjs(dateRange.to)] : null}
      onChange={handleChange}
      allowEmpty={[false, false]}
    />
  );
}