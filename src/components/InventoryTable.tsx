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
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import type { Branch, InventoryItem } from "@/types/inventory";

interface InventoryTableProps {
  inventory: InventoryItem[];
  branches: Branch[];
  searchTerm: string;
  selectedBranch: string;
}

type SortConfig = {
  key: keyof InventoryItem | null;
  direction: 'asc' | 'desc';
};

const InventoryTable: React.FC<InventoryTableProps> = ({
  inventory,
  branches,
  searchTerm,
  selectedBranch,
}) => {
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: null,
    direction: 'asc'
  });

  const renderSeparator = () => (
    <TableCell className="p-0 w-[1px]">
      <Separator orientation="vertical" className="h-full mx-auto" />
    </TableCell>
  );

  const uniqueInventory = Array.from(
    new Map(inventory.map(item => [item.item_sku, item])).values()
  );

  const filteredInventory = uniqueInventory.filter(
    (item) =>
      searchTerm === "" ||
      item.item_sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.item_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedInventory = React.useMemo(() => {
    if (!sortConfig.key) return filteredInventory;

    return [...filteredInventory].sort((a, b) => {
      if (a[sortConfig.key!] < b[sortConfig.key!]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key!] > b[sortConfig.key!]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [filteredInventory, sortConfig]);

  const handleSort = (key: keyof InventoryItem) => {
    setSortConfig(current => ({
      key,
      direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const renderSortButton = (label: string, key: keyof InventoryItem) => (
    <Button
      variant="ghost"
      onClick={() => handleSort(key)}
      className="h-8 flex items-center gap-1 px-2 py-1"
    >
      {label}
      <ArrowUpDown className="h-4 w-4" />
    </Button>
  );

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-100">
            <TableHead className="p-2">
              {renderSortButton('SKU', 'item_sku')}
            </TableHead>
            {renderSeparator()}
            <TableHead className="p-2">
              {renderSortButton('Name', 'item_name')}
            </TableHead>
            {renderSeparator()}
            {selectedBranch !== "all" && (
              <>
                <TableHead className="p-2">
                  {renderSortButton('Brand', 'item_brand')}
                </TableHead>
                {renderSeparator()}
              </>
            )}
            {selectedBranch === "all" ? (
              branches
                .filter(branch => branch.id >= 1 && branch.id <= 12)
                .map((branch) => (
                  <React.Fragment key={branch.id}>
                    <TableHead className="p-2 text-center">{branch.name}</TableHead>
                    {renderSeparator()}
                  </React.Fragment>
                ))
            ) : (
              <>
                <TableHead className="p-2 text-center">
                  {renderSortButton('Qty', 'qty')}
                </TableHead>
                {renderSeparator()}
              </>
            )}
            {selectedBranch === "all" && (
              <TableHead className="p-2 text-center">Total</TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedInventory.map((item) => {
            const total = selectedBranch === "all"
              ? inventory
                  .filter(inv => inv.item_sku === item.item_sku)
                  .reduce((sum, inv) => sum + inv.qty, 0)
              : item.qty;

            return (
              <TableRow key={item.item_sku} className="border-b hover:bg-gray-50">
                <TableCell className="p-2">{item.item_sku}</TableCell>
                {renderSeparator()}
                <TableCell className="p-2">{item.item_name}</TableCell>
                {renderSeparator()}
                {selectedBranch !== "all" && (
                  <>
                    <TableCell className="p-2">{item.item_brand}</TableCell>
                    {renderSeparator()}
                  </>
                )}
                {selectedBranch === "all" ? (
                  branches
                    .filter(branch => branch.id >= 1 && branch.id <= 12)
                    .map((branch) => (
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
                  <>
                    <TableCell className="p-2 text-center">{item.qty}</TableCell>
                    {renderSeparator()}
                  </>
                )}
                {selectedBranch === "all" && (
                  <TableCell className="p-2 text-center font-semibold">{total}</TableCell>
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