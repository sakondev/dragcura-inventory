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
  const [sortColumn, setSortColumn] = useState<keyof InventoryItem | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const renderSeparator = () => (
    <TableCell className="p-0 w-[1px]">
      <Separator orientation="vertical" className="h-full mx-auto" />
    </TableCell>
  );

  // Remove duplicates based on item_sku
  const uniqueInventory = Array.from(
    new Map(inventory.map(item => [item.item_sku, item])).values()
  );

  const filteredInventory = uniqueInventory.filter(
    (item) =>
      searchTerm === "" ||
      item.item_sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.item_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedInventory = [...filteredInventory].sort((a, b) => {
    if (!sortColumn) return 0;

    let aValue = a[sortColumn];
    let bValue = b[sortColumn];

    if (typeof aValue === "string") {
      aValue = aValue.toLowerCase();
      bValue = (bValue as string).toLowerCase();
    }

    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  const handleSort = (column: keyof InventoryItem) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("desc");
    }
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-100">
            <TableHead
              className="p-2 cursor-pointer"
              onClick={() => handleSort("item_sku")}
            >
              SKU
            </TableHead>
            {renderSeparator()}
            <TableHead
              className="p-2 cursor-pointer"
              onClick={() => handleSort("item_name")}
            >
              Name
            </TableHead>
            {renderSeparator()}
            <TableHead
              className="p-2 cursor-pointer"
              onClick={() => handleSort("item_brand")}
            >
              Brand
            </TableHead>
            {renderSeparator()}
            {selectedBranch === "all" ? (
              branches.map((branch) => (
                <React.Fragment key={branch.id}>
                  <TableHead className="p-2 text-center">{branch.name}</TableHead>
                  {renderSeparator()}
                </React.Fragment>
              ))
            ) : (
              <TableHead className="p-2 text-center">Qty</TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedInventory.map((item) => (
            <TableRow key={item.item_sku} className="border-b hover:bg-gray-50">
              <TableCell className="p-2">{item.item_sku}</TableCell>
              {renderSeparator()}
              <TableCell className="p-2">{item.item_name}</TableCell>
              {renderSeparator()}
              <TableCell className="p-2">{item.item_brand}</TableCell>
              {renderSeparator()}
              {selectedBranch === "all" ? (
                branches.map((branch) => (
                  <React.Fragment key={branch.id}>
                    <TableCell className="p-2 text-center">
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
                <TableCell className="p-2 text-center">{item.qty}</TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default InventoryTable;