import React from "react";
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

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-100">
            <TableHead className="p-2">SKU</TableHead>
            {renderSeparator()}
            <TableHead className="p-2">Name</TableHead>
            {renderSeparator()}
            {selectedBranch !== "all" && (
              <>
                <TableHead className="p-2">Brand</TableHead>
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
                <TableHead className="p-2 text-center">Qty</TableHead>
                {renderSeparator()}
              </>
            )}
            {selectedBranch === "all" && (
              <TableHead className="p-2 text-center">Total</TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredInventory.map((item) => {
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