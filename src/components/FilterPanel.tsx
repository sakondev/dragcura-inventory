import React from 'react';
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DateRange } from 'react-day-picker';
import { DateRangePicker } from './DateRangePicker';
import { Search } from 'lucide-react';

interface FilterPanelProps {
  branches: string[];
  selectedBranch: string; // Add this prop
  onBranchChange: (branch: string) => void;
  onSearchChange: (search: string) => void;
  onDateRangeChange: (dateRange: DateRange | undefined) => void;
  dateRange: DateRange | undefined;
  saleDates: Date[];
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  branches,
  selectedBranch, // Add this prop
  onBranchChange,
  onSearchChange,
  onDateRangeChange,
  dateRange,
  saleDates,
}) => {
  return (
    <div className="flex flex-wrap gap-4 p-4 bg-gray-100 rounded-lg">
      <DateRangePicker 
        dateRange={dateRange} 
        onDateRangeChange={onDateRangeChange} 
        saleDates={saleDates} 
      />
      <Select 
        value={selectedBranch} // Control the value
        onValueChange={onBranchChange}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select Branch" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          {branches.map((branch) => (
            <SelectItem key={branch} value={branch}>
              {branch}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <div className="relative">
        <Input
          type="text"
          placeholder="Search products (Name/SKU)"
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-64 pl-8"
        />
        <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
      </div>
    </div>
  );
};

export default FilterPanel;