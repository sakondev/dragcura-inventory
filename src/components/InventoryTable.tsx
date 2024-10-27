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
  searchTerm,
  selectedBranch,
}) => {
  const renderSeparator = () => (
    <TableCell className="p-0 w-[1px]">
      <Separator orientation="vertical" className="h-full mx-auto" />
    </TableCell>
  );

  const filteredInventory = inventory.filter(
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
            <TableHead className="p-2">Brand</TableHead>
            {renderSeparator()}
            <TableHead className="p-2">Item Group</TableHead>
            {renderSeparator()}
            <TableHead className="p-2 text-center">Qty</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredInventory.map((item) => (
            <TableRow key={item.item_sku} className="border-b hover:bg-gray-50">
              <TableCell className="p-2">{item.item_sku}</TableCell>
              {renderSeparator()}
              <TableCell className="p-2">{item.item_name}</TableCell>
              {renderSeparator()}
              <TableCell className="p-2">{item.item_brand}</TableCell>
              {renderSeparator()}
              <TableCell className="p-2">{item.item_group || '-'}</TableCell>
              {renderSeparator()}
              <TableCell className="p-2 text-center">{item.qty}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default InventoryTable;