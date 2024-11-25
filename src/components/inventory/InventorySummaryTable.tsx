import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { useQuery } from "@tanstack/react-query";
import type { Branch, InventoryItem, Item } from "@/types/inventory";
import { fetchItems } from "@/api/inventoryApi";

interface InventorySummaryTableProps {
  inventory: InventoryItem[];
  branches: Branch[];
}

const InventorySummaryTable: React.FC<InventorySummaryTableProps> = ({
  inventory,
  branches,
}) => {
  const { data: items = [] } = useQuery({
    queryKey: ["items"],
    queryFn: fetchItems,
  });

  const renderSeparator = () => (
    <TableCell className="p-0 w-[1px]">
      <Separator orientation="vertical" className="h-full mx-auto" />
    </TableCell>
  );

  const getBranchSummary = (branchName: string) => {
    const branchItems = inventory.filter(item => item.branch_name === branchName);
    const uniqueSkus = new Set(branchItems.map(item => item.item_sku));
    const totalQty = branchItems.reduce((sum, item) => sum + item.qty, 0);
    
    const totalCost = branchItems.reduce((sum, item) => {
      const itemData = items.find(i => i.sku === item.item_sku);
      return sum + (itemData?.cost || 0) * item.qty;
    }, 0);
    
    const totalValue = branchItems.reduce((sum, item) => {
      const itemData = items.find(i => i.sku === item.item_sku);
      return sum + (itemData?.price || 0) * item.qty;
    }, 0);
    
    return {
      totalQty,
      totalCost,
      totalValue,
      uniqueSkus: uniqueSkus.size
    };
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-100">
            <TableHead className="p-1 text-sm">Branch</TableHead>
            {renderSeparator()}
            <TableHead className="p-1 text-sm text-right">Total SKUs</TableHead>
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
                    {summary.uniqueSkus.toLocaleString()}
                  </TableCell>
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