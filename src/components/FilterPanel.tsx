import React from 'react';
import { Input } from "@/components/ui/input"
import { DateRange } from 'react-day-picker';
import { DateRangePicker } from './DateRangePicker';
import { Search } from 'lucide-react';
import { Badge } from "@/components/ui/badge"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from './ui/button';
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"

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
  branches,
  selectedBranches,
  onBranchChange,
  onSearchChange,
  onDateRangeChange,
  dateRange,
  saleDates,
}) => {
  const [open, setOpen] = React.useState(false)

  const handleSelect = (branch: string) => {
    if (selectedBranches.includes(branch)) {
      onBranchChange(selectedBranches.filter(b => b !== branch));
    } else {
      onBranchChange([...selectedBranches, branch]);
    }
  };

  return (
    <div className="flex flex-wrap gap-4 p-4 bg-gray-100 rounded-lg">
      <DateRangePicker 
        dateRange={dateRange} 
        onDateRangeChange={onDateRangeChange} 
        saleDates={saleDates} 
      />
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[200px] justify-between"
          >
            {selectedBranches.length === 0 
              ? "Select branches..." 
              : `${selectedBranches.length} selected`}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder="Search branch..." />
            <CommandEmpty>No branch found.</CommandEmpty>
            <CommandGroup>
              {branches.map((branch) => (
                <CommandItem
                  key={branch}
                  value={branch}
                  onSelect={() => handleSelect(branch)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedBranches.includes(branch) ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {branch}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
      {selectedBranches.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedBranches.map(branch => (
            <Badge 
              key={branch}
              variant="secondary"
              className="cursor-pointer"
              onClick={() => handleSelect(branch)}
            >
              {branch}
              <span className="ml-1">×</span>
            </Badge>
          ))}
        </div>
      )}
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