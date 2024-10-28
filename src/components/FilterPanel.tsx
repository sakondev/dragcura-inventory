import React from 'react';
import { Input } from "@/components/ui/input"
import { DateRangePicker } from './DateRangePicker';
import { Search } from 'lucide-react';
import { Badge } from "@/components/ui/badge"
import { Button } from './ui/button';
import { ChevronsUpDown } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Command, CommandInput, CommandList, CommandGroup, CommandItem, CommandSeparator } from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import type { DateRange } from 'react-day-picker';

interface FilterPanelProps {
  branches: string[];
  selectedBranches: string[];
  onBranchChange: (branches: string[]) => void;
  onSearchChange: (search: string) => void;
  onDateRangeChange: (dateRange: DateRange | undefined) => void;
  dateRange: DateRange | undefined;
  saleDates: Date[];
}

const BRANCH_GROUPS = {
  'In-Store': ['SAM', 'TCC', 'RM9', 'ESV', 'MGB', 'EMB', 'EMQ'],
  'Vending Machine': ['True Digital Park', 'T One Building'],
  'Online': [
    'Shopee', 'Lazada', 'TikTok', 'LINE', 'LINE MyShop', 'dragcura.com',
    'COL', 'Unknow', 'Flipper (Shopee)', 'Flipper (Lazada)', 'ฝ่ายขาย',
    'B-Healthy', 'ฝากขาย', 'Facebook'
  ]
};

const FilterPanel: React.FC<FilterPanelProps> = ({
  branches,
  selectedBranches,
  onBranchChange,
  onSearchChange,
  onDateRangeChange,
  dateRange,
  saleDates,
}) => {
  const [open, setOpen] = React.useState(false);
  const [branchSearch, setBranchSearch] = React.useState("");

  const handleSelect = (branch: string) => {
    if (selectedBranches.includes(branch)) {
      onBranchChange(selectedBranches.filter(b => b !== branch));
    } else {
      onBranchChange([...selectedBranches, branch]);
    }
  };

  const handleGroupSelect = (groupBranches: string[]) => {
    const allSelected = groupBranches.every(branch => selectedBranches.includes(branch));
    if (allSelected) {
      onBranchChange(selectedBranches.filter(b => !groupBranches.includes(b)));
    } else {
      const newBranches = [...selectedBranches];
      groupBranches.forEach(branch => {
        if (!newBranches.includes(branch)) {
          newBranches.push(branch);
        }
      });
      onBranchChange(newBranches);
    }
  };

  const filteredBranches = branches.filter(branch => 
    branch.toLowerCase().includes(branchSearch.toLowerCase())
  );

  return (
    <div className="p-4 bg-gray-100 rounded-lg">
      <div className="flex gap-4 mb-4">
        <div className="flex-1 min-w-0">
          <DateRangePicker 
            dateRange={dateRange} 
            onDateRangeChange={onDateRangeChange} 
            saleDates={saleDates}
          />
        </div>
        <div className="flex-1 min-w-0">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-full justify-between"
              >
                {selectedBranches.length === 0 
                  ? "Select branches..." 
                  : `${selectedBranches.length} selected`}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
              <Command>
                <CommandInput 
                  placeholder="Search branches..." 
                  value={branchSearch}
                  onValueChange={setBranchSearch}
                />
                <CommandList>
                  <ScrollArea className="h-[300px]">
                    <CommandGroup>
                      <CommandItem
                        onSelect={() => onBranchChange([])}
                        className="cursor-pointer font-medium"
                      >
                        <div className="flex items-center">
                          <div className={`mr-2 h-4 w-4 border rounded-sm ${selectedBranches.length === 0 ? 'bg-primary' : ''}`} />
                          All Branches
                        </div>
                      </CommandItem>
                      {Object.entries(BRANCH_GROUPS).map(([groupName, groupBranches]) => (
                        <CommandItem
                          key={groupName}
                          onSelect={() => handleGroupSelect(groupBranches)}
                          className="cursor-pointer font-medium"
                        >
                          <div className="flex items-center">
                            <div className={`mr-2 h-4 w-4 border rounded-sm ${
                              groupBranches.every(branch => selectedBranches.includes(branch)) ? 'bg-primary' : ''
                            }`} />
                            {groupName}
                          </div>
                        </CommandItem>
                      ))}
                      <CommandSeparator className="my-2" />
                      {Object.entries(BRANCH_GROUPS).map(([groupName, groupBranches]) => (
                        groupBranches.map((branch) => (
                          <CommandItem
                            key={branch}
                            onSelect={() => handleSelect(branch)}
                            className="cursor-pointer pl-6"
                          >
                            <div className="flex items-center">
                              <div className={`mr-2 h-4 w-4 border rounded-sm ${
                                selectedBranches.includes(branch) ? 'bg-primary' : ''
                              }`} />
                              {branch}
                            </div>
                          </CommandItem>
                        ))
                      ))}
                    </CommandGroup>
                  </ScrollArea>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
        <div className="flex-1 min-w-0 relative">
          <Input
            type="text"
            placeholder="Search products (Name/SKU)"
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-8"
          />
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
        </div>
      </div>
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
    </div>
  );
};

export default FilterPanel;