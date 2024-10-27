import React from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Branch, StockDate } from "@/types/inventory";

interface InventoryFilterPanelProps {
  branches: Branch[];
  stockDates: StockDate[];
  selectedDate: string;
  selectedBranch: string;
  searchTerm: string;
  onDateChange: (date: string) => void;
  onBranchChange: (branch: string) => void;
  onSearchChange: (search: string) => void;
}

const InventoryFilterPanel: React.FC<InventoryFilterPanelProps> = ({
  branches,
  stockDates,
  selectedDate,
  selectedBranch,
  searchTerm,
  onDateChange,
  onBranchChange,
  onSearchChange,
}) => {
  return (
    <div className="mb-4 flex flex-wrap gap-4">
      <div className="flex-1 min-w-[200px]">
        <label htmlFor="dateFilter" className="block mb-2">
          Select Date:
        </label>
        <Select value={selectedDate} onValueChange={onDateChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select date" />
          </SelectTrigger>
          <SelectContent>
            {stockDates.map((date) => (
              <SelectItem key={date.id} value={date.date.split(" ")[0]}>
                {date.date.split(" ")[0]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex-1 min-w-[200px]">
        <label htmlFor="searchFilter" className="block mb-2">
          Search:
        </label>
        <Input
          type="text"
          id="searchFilter"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by SKU or Name"
          className="w-full"
        />
      </div>
      <div className="flex-1 min-w-[200px]">
        <label htmlFor="branchFilter" className="block mb-2">
          Branch:
        </label>
        <Select value={selectedBranch} onValueChange={onBranchChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select branch" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Branches</SelectItem>
            {branches.map((branch) => (
              <SelectItem key={branch.id} value={branch.name}>
                {branch.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default InventoryFilterPanel;