
import React from "react";
import {
  TableHead,
  TableRow,
  TableHeader,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Branch } from "@/types/inventory";

interface InventoryTableHeaderProps {
  branches: Branch[];
  selectedBranch: string;
  onSort: (branch: string) => void;
  onSortTotal: () => void;
}

const InventoryTableHeader: React.FC<InventoryTableHeaderProps> = ({
  branches,
  selectedBranch,
  onSort,
  onSortTotal,
}) => {
  const renderSeparator = () => (
    <TableCell className="p-0 w-[1px]">
      <Separator orientation="vertical" className="h-full mx-auto" />
    </TableCell>
  );

  // Filter branches to exclude 11, 12 and include 36
  const filteredBranches = branches.filter(
    (branch) => ![11, 12].includes(branch.id) && (branch.id <= 10 || branch.id === 36 || branch.id === 44)
  );

  return (
    <TableHeader>
      <TableRow className="bg-gray-100">
        <TableHead className="p-1 text-sm">SKU</TableHead>
        {renderSeparator()}
        <TableHead className="p-1 text-sm">Name</TableHead>
        {renderSeparator()}
        {selectedBranch !== "all" && (
          <>
            <TableHead className="p-1 text-sm">Brand</TableHead>
            {renderSeparator()}
          </>
        )}
        {selectedBranch === "all" ? (
          filteredBranches.map((branch) => (
            <React.Fragment key={branch.id}>
              <TableHead className="p-1 text-center">
                <Button
                  variant="ghost"
                  onClick={() => onSort(branch.name)}
                  className="font-semibold text-sm truncate w-16"
                >
                  {branch.name}
                  <ArrowUpDown className="ml-1 h-2 w-2" />
                </Button>
              </TableHead>
              {renderSeparator()}
            </React.Fragment>
          ))
        ) : (
          <>
            <TableHead className="p-1 text-center">
              <Button
                variant="ghost"
                onClick={() => onSort(selectedBranch)}
                className="font-semibold text-sm"
              >
                Qty
                <ArrowUpDown className="ml-1 h-2 w-2" />
              </Button>
            </TableHead>
            {renderSeparator()}
          </>
        )}
        {selectedBranch === "all" && (
          <TableHead className="p-2 text-center">
            <Button
              variant="ghost"
              onClick={onSortTotal}
              className="font-semibold text-sm"
            >
              Total
              <ArrowUpDown className="ml-1 h-2 w-2" />
            </Button>
          </TableHead>
        )}
      </TableRow>
    </TableHeader>
  );
};

export default InventoryTableHeader;
