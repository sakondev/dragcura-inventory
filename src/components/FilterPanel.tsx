import React from "react";
import { Input } from "@/components/ui/input";
import { DateRangePicker } from "./DateRangePicker";
import { Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import BranchSelector from "./BranchSelector";
import type { DateRange } from "react-day-picker";

interface FilterPanelProps {
  branches: string[];
  selectedBranches: string[];
  onBranchChange: (branches: string[]) => void;
  onSearchChange: (search: string) => void;
  onDateRangeChange: (dateRange: DateRange | undefined) => void;
  dateRange: DateRange | undefined;
  saleDates: Date[];
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  selectedBranches,
  onBranchChange,
  onSearchChange,
  onDateRangeChange,
  dateRange,
  saleDates,
}) => {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="mb-4 flex flex-wrap gap-4 p-4 bg-gray-100 rounded-lg">
      <div className="flex-1 min-w-[200px]">
        <DateRangePicker
          dateRange={dateRange}
          onDateRangeChange={onDateRangeChange}
          saleDates={saleDates}
        />
      </div>
      <div className="flex-1 min-w-[200px] relative">
        <Input
          type="text"
          placeholder="Search products (Name/SKU)"
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-8"
        />
        <Search
          className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400"
          size={16}
        />
      </div>
      <div className="flex-1 min-w-[200px]">
        <BranchSelector
          selectedBranches={selectedBranches}
          onBranchChange={onBranchChange}
          open={open}
          setOpen={setOpen}
        />
      </div>
      {selectedBranches.length > 0 && (
        <div className="flex flex-wrap gap-2 hidden">
          {selectedBranches.map((branch) => (
            <Badge
              key={branch}
              variant="secondary"
              className="cursor-pointer"
              onClick={() => {
                onBranchChange(selectedBranches.filter((b) => b !== branch));
              }}
            >
              {branch}
              <span className="ml-1">×</span>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};

export default FilterPanel;
