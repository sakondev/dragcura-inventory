import React from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
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
  const [open, setOpen] = React.useState(false);
  const availableDates = stockDates.map(d => new Date(d.date));
  
  // Find the closest date to today from available dates
  const findClosestDate = () => {
    const today = new Date();
    return availableDates.reduce((prev, curr) => {
      return Math.abs(curr.getTime() - today.getTime()) < Math.abs(prev.getTime() - today.getTime()) ? curr : prev;
    });
  };

  // Set closest date when dates are loaded and no date is selected
  React.useEffect(() => {
    if (stockDates.length > 0 && !selectedDate) {
      const closestDate = findClosestDate();
      onDateChange(format(closestDate, 'yyyy-MM-dd'));
    }
  }, [stockDates, selectedDate, onDateChange]);

  return (
    <div className="mb-4 flex flex-wrap gap-4">
      <div className="flex-1 min-w-[200px]">
        <label className="block mb-2">Select Date:</label>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal",
                !selectedDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {selectedDate ? format(new Date(selectedDate), "PPP") : "Pick a date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={selectedDate ? new Date(selectedDate) : undefined}
              onSelect={(date) => {
                if (date) {
                  onDateChange(format(date, "yyyy-MM-dd"));
                  setOpen(false);
                }
              }}
              disabled={(date) =>
                !availableDates.some(
                  (d) =>
                    d.getFullYear() === date.getFullYear() &&
                    d.getMonth() === date.getMonth() &&
                    d.getDate() === date.getDate()
                )
              }
            />
          </PopoverContent>
        </Popover>
      </div>
      <div className="flex-1 min-w-[200px]">
        <label className="block mb-2">Search:</label>
        <Input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by SKU or Name"
          className="w-full"
        />
      </div>
      <div className="flex-1 min-w-[200px]">
        <label className="block mb-2">Branch:</label>
        <Select value={selectedBranch} onValueChange={onBranchChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select branch" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Branches</SelectItem>
            {branches
              .filter(branch => branch.id >= 1 && branch.id <= 12)
              .map((branch) => (
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