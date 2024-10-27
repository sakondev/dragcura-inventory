import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Branch, InventoryItem } from "@/types/inventory";

interface InventoryTableProps {
  inventory: InventoryItem[];
  branches: Branch[];
  searchTerm: string;
  selectedBranch: string;
}

const InventoryTable: React.FC<InventoryTableProps> = ({
  inventory,
  branches,
  searchTerm,
  selectedBranch,
}) => {
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [sortBranch, setSortBranch] = useState<string | null>(null);
  const [sortTotal, setSortTotal] = useState<boolean>(false);

  const renderSeparator = () => (
    <TableCell className="p-0 w-[1px]">
      <Separator orientation="vertical" className="h-full mx-auto" />
    </TableCell>
  );

  const uniqueInventory = Array.from(
    new Map(inventory.map((item) => [item.item_sku, item])).values()
  );

  const filteredInventory = uniqueInventory.filter(
    (item) =>
      searchTerm === "" ||
      item.item_sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.item_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSort = (branchName: string) => {
    setSortTotal(false);
    if (sortBranch === branchName) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBranch(branchName);
      setSortDirection("desc");
    }
  };

  const handleSortTotal = () => {
    setSortTotal(true);
    setSortBranch(null);
    setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  const sortedInventory = [...filteredInventory].sort((a, b) => {
    if (sortTotal) {
      const totalA = inventory
        .filter((inv) => inv.item_sku === a.item_sku)
        .reduce((sum, inv) => sum + inv.qty, 0);
      const totalB = inventory
        .filter((inv) => inv.item_sku === b.item_sku)
        .reduce((sum, inv) => sum + inv.qty, 0);
      return sortDirection === "asc" ? totalA - totalB : totalB - totalA;
    }

    if (!sortBranch) return 0;

    const getQty = (item: InventoryItem, branch: string) => {
      if (selectedBranch !== "all") {
        return item.qty;
      }
      const branchItem = inventory.find(
        (inv) => inv.item_sku === item.item_sku && inv.branch_name === branch
      );
      return branchItem?.qty || 0;
    };

    const aQty = getQty(a, sortBranch);
    const bQty = getQty(b, sortBranch);

    return sortDirection === "asc" ? aQty - bQty : bQty - aQty;
  });

  return (
    <div className="overflow-x-auto">
      <Table>
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
              branches
                .filter((branch) => branch.id >= 1 && branch.id <= 12)
                .map((branch) => (
                  <React.Fragment key={branch.id}>
                    <TableHead className="p-1 text-center">
                      <Button
                        variant="ghost"
                        onClick={() => handleSort(branch.name)}
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
                    onClick={() => handleSort(selectedBranch)}
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
                  onClick={handleSortTotal}
                  className="font-semibold text-sm"
                >
                  Total
                  <ArrowUpDown className="ml-1 h-2 w-2" />
                </Button>
              </TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedInventory.map((item) => {
            const total =
              selectedBranch === "all"
                ? inventory
                    .filter((inv) => inv.item_sku === item.item_sku)
                    .reduce((sum, inv) => sum + inv.qty, 0)
                : item.qty;

            return (
              <TableRow
                key={item.item_sku}
                className="border-b hover:bg-gray-50"
              >
                <TableCell className="p-1 text-sm">{item.item_sku}</TableCell>
                {renderSeparator()}
                <TableCell className="p-1 text-sm">{item.item_name}</TableCell>
                {renderSeparator()}
                {selectedBranch !== "all" && (
                  <>
                    <TableCell className="p-1 text-sm">
                      {item.item_brand}
                    </TableCell>
                    {renderSeparator()}
                  </>
                )}
                {selectedBranch === "all" ? (
                  branches
                    .filter((branch) => branch.id >= 1 && branch.id <= 12)
                    .map((branch) => (
                      <React.Fragment key={branch.id}>
                        <TableCell className="p-1 text-center text-sm">
                          {inventory.find(
                            (inv) =>
                              inv.item_sku === item.item_sku &&
                              inv.branch_name === branch.name
                          )?.qty ?? 0}
                        </TableCell>
                        {renderSeparator()}
                      </React.Fragment>
                    ))
                ) : (
                  <>
                    <TableCell className="p-1 text-center text-sm">
                      {item.qty}
                    </TableCell>
                    {renderSeparator()}
                  </>
                )}
                {selectedBranch === "all" && (
                  <TableCell className="p-1 text-center font-semibold text-sm">
                    {total}
                  </TableCell>
                )}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default InventoryTable;