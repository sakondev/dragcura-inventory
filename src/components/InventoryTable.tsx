import React, { useState } from "react";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import type { Branch, InventoryItem } from "@/types/inventory";
import InventoryTableHeader from "./inventory/InventoryTableHeader";
import QuantityCell from "./inventory/QuantityCell";

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
        <InventoryTableHeader
          branches={branches}
          selectedBranch={selectedBranch}
          onSort={handleSort}
          onSortTotal={handleSortTotal}
        />
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
                    .map((branch) => {
                      const branchQty =
                        inventory.find(
                          (inv) =>
                            inv.item_sku === item.item_sku &&
                            inv.branch_name === branch.name
                        )?.qty ?? 0;

                      return (
                        <React.Fragment key={branch.id}>
                          <TableCell className="p-1 text-center text-sm">
                            <QuantityCell
                              qty={branchQty}
                              sku={item.item_sku}
                              branchId={branch.id}
                            />
                          </TableCell>
                          {renderSeparator()}
                        </React.Fragment>
                      );
                    })
                ) : (
                  <>
                    <TableCell className="p-1 text-center text-sm">
                      <QuantityCell
                        qty={item.qty}
                        sku={item.item_sku}
                        branchId={
                          branches.find((b) => b.name === selectedBranch)?.id
                        }
                      />
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
