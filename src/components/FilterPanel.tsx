import React from 'react';
import { Input } from "@/components/ui/input"
import { DateRangePicker } from './DateRangePicker';
import { Search } from 'lucide-react';
import { Badge } from "@/components/ui/badge"
import { Button } from './ui/button';
import { ChevronsUpDown } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"

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
  const handleSelect = (branch: string) => {
    if (selectedBranches.includes(branch)) {
      onBranchChange(selectedBranches.filter(b => b !== branch));
    } else {
      onBranchChange([...selectedBranches, branch]);
    }
  };

  const handleGroupSelect = (groupBranches: string[]) => {
    // If all branches in the group are selected, deselect them
    const allSelected = groupBranches.every(branch => selectedBranches.includes(branch));
    if (allSelected) {
      onBranchChange(selectedBranches.filter(b => !groupBranches.includes(b)));
    } else {
      // Add all branches from the group that aren't already selected
      const newBranches = [...selectedBranches];
      groupBranches.forEach(branch => {
        if (!newBranches.includes(branch)) {
          newBranches.push(branch);
        }
      });
      onBranchChange(newBranches);
    }
  };

  return (
    <div className="flex flex-wrap gap-4 p-4 bg-gray-100 rounded-lg">
      <DateRangePicker 
        dateRange={dateRange} 
        onDateRangeChange={onDateRangeChange} 
        saleDates={saleDates} 
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="w-[200px] justify-between"
          >
            {selectedBranches.length === 0 
              ? "Select branches..." 
              : `${selectedBranches.length} selected`}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-[200px]">
          <DropdownMenuCheckboxItem
            checked={selectedBranches.length === 0}
            onCheckedChange={() => onBranchChange([])}
          >
            Select All (No param)
          </DropdownMenuCheckboxItem>
          <DropdownMenuSeparator />
          {Object.entries(BRANCH_GROUPS).map(([groupName, groupBranches]) => (
            <DropdownMenuCheckboxItem
              key={groupName}
              checked={groupBranches.every(branch => selectedBranches.includes(branch))}
              onCheckedChange={() => handleGroupSelect(groupBranches)}
            >
              {groupName}
            </DropdownMenuCheckboxItem>
          ))}
          <DropdownMenuSeparator />
          {branches.map((branch) => (
            <DropdownMenuCheckboxItem
              key={branch}
              checked={selectedBranches.includes(branch)}
              onCheckedChange={() => handleSelect(branch)}
            >
              {branch}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
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