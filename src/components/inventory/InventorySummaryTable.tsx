import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import type { Branch, InventoryItem } from "@/types/inventory";

interface InventorySummaryTableProps {
  inventory: InventoryItem[];
  branches: Branch[];
}

const InventorySummaryTable: React.FC<InventorySummaryTableProps> = ({
  inventory,
  branches,
}) => {
  const renderSeparator = () => (
    <TableCell className="p-0 w-[1px]">
      <Separator orientation="vertical" className="h-full mx-auto" />
    </TableCell>
  );

  const getBranchSummary = (branchName: string) => {
    const branchItems = inventory.filter(item => item.branch_name === branchName);
    const totalQty = branchItems.reduce((sum, item) => sum + item.qty, 0);
    const totalCost = branchItems.reduce((sum, item) => sum + ((item.cost || 0) * item.qty), 0);
    const totalValue = branchItems.reduce((sum, item) => sum + ((item.price || 0) * item.qty), 0);
    
    return {
      totalQty,
      totalCost,
      totalValue
    };
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-100">
            <TableHead className="p-1 text-sm">Branch</TableHead>
            {renderSeparator()}
            <TableHead className="p-1 text-sm text-right">Total Qty</TableHead>
            {renderSeparator()}
            <TableHead className="p-1 text-sm text-right">Total Cost</TableHead>
            {renderSeparator()}
            <TableHead className="p-1 text-sm text-right">Total Value</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {branches
            .filter((branch) => branch.id >= 1 && branch.id <= 12)
            .map((branch) => {
              const summary = getBranchSummary(branch.name);
              return (
                <TableRow key={branch.id} className="border-b hover:bg-gray-50">
                  <TableCell className="p-1 text-sm">{branch.name}</TableCell>
                  {renderSeparator()}
                  <TableCell className="p-1 text-sm text-right">
                    {summary.totalQty.toLocaleString()}
                  </TableCell>
                  {renderSeparator()}
                  <TableCell className="p-1 text-sm text-right">
                    {summary.totalCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </TableCell>
                  {renderSeparator()}
                  <TableCell className="p-1 text-sm text-right">
                    {summary.totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </TableCell>
                </TableRow>
              );
            })}
        </TableBody>
      </Table>
    </div>
  );
};

export default InventorySummaryTable;