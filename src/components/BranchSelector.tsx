import React from "react";
import { Button } from "./ui/button";
import { ChevronsUpDown } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Command,
  CommandList,
  CommandGroup,
  CommandItem,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const BRANCH_GROUPS = {
  "In-Store": ["SAM", "TCC", "RM9", "ESV", "MGB", "EMB", "EMQ"],
  "Vending Machine": ["True Digital Park", "T One Building"],
  Online: [
    "Shopee",
    "Lazada",
    "TikTok",
    "LINE",
    "LINE MyShop",
    "dragcura.com",
    "COL",
    "Unknow",
    "Flipper (Shopee)",
    "Flipper (Lazada)",
    "ฝ่ายขาย",
    "B-Healthy",
    "ฝากขาย",
    "Facebook",
  ],
};

interface BranchSelectorProps {
  selectedBranches: string[];
  onBranchChange: (branches: string[]) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
}

const BranchSelector: React.FC<BranchSelectorProps> = ({
  selectedBranches,
  onBranchChange,
  open,
  setOpen,
}) => {
  const handleSelect = (branch: string) => {
    if (selectedBranches.includes(branch)) {
      onBranchChange(selectedBranches.filter((b) => b !== branch));
    } else {
      onBranchChange([...selectedBranches, branch]);
    }
  };

  const handleGroupSelect = (groupBranches: string[]) => {
    const allSelected = groupBranches.every((branch) =>
      selectedBranches.includes(branch)
    );
    if (allSelected) {
      onBranchChange(selectedBranches.filter((b) => !groupBranches.includes(b)));
    } else {
      const newBranches = [...selectedBranches];
      groupBranches.forEach((branch) => {
        if (!newBranches.includes(branch)) {
          newBranches.push(branch);
        }
      });
      onBranchChange(newBranches);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between text-left font-normal"
        >
          {selectedBranches.length === 0
            ? "Select branches..."
            : `${selectedBranches.length} Selected`}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Command>
          <CommandList>
            <ScrollArea className="h-[300px]">
              <CommandGroup>
                <CommandItem
                  onSelect={() => onBranchChange([])}
                  className="cursor-pointer font-medium"
                >
                  <div className="flex items-center">
                    <div
                      className={`mr-2 h-4 w-4 border rounded-sm ${
                        selectedBranches.length === 0 ? "bg-primary" : ""
                      }`}
                    />
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
                      <div
                        className={`mr-2 h-4 w-4 border rounded-sm ${
                          groupBranches.every((branch) =>
                            selectedBranches.includes(branch)
                          )
                            ? "bg-primary"
                            : ""
                        }`}
                      />
                      {groupName}
                    </div>
                  </CommandItem>
                ))}
                <CommandSeparator className="my-2" />
                {Object.entries(BRANCH_GROUPS).map(([groupName, groupBranches]) =>
                  groupBranches.map((branch) => (
                    <CommandItem
                      key={branch}
                      onSelect={() => handleSelect(branch)}
                      className="cursor-pointer pl-6"
                    >
                      <div className="flex items-center">
                        <div
                          className={`mr-2 h-4 w-4 border rounded-sm ${
                            selectedBranches.includes(branch) ? "bg-primary" : ""
                          }`}
                        />
                        {branch}
                      </div>
                    </CommandItem>
                  ))
                )}
              </CommandGroup>
            </ScrollArea>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default BranchSelector;