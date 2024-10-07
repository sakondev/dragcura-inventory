import React, { useState } from 'react';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Item, Branch, InventoryData } from '@/types/types';
import { ArrowUpDown } from 'lucide-react';
import { Separator } from "@/components/ui/separator";

interface InventoryTableProps {
  items: Item[];
  branches: Branch[];
  inventoryData: InventoryData;
  selectedDate: string;
  searchTerm: string;
  selectedBranch: string;
}

const InventoryTable: React.FC<InventoryTableProps> = ({ items, branches, inventoryData, selectedDate, searchTerm, selectedBranch }) => {
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const dateKey = selectedDate.substring(0, 10);
  const stockData = Object.keys(inventoryData).reduce((acc, key) => {
    if (key.startsWith(dateKey)) {
      return inventoryData[key];
    }
    return acc;
  }, [] as InventoryData[string]);

  const filteredBranches = selectedBranch === 'all' ? branches : branches.filter(branch => branch.id.toString() === selectedBranch);

  const sortedItems = [...items].sort((a, b) => {
    if (!sortColumn) return 0;

    const aValue = getItemValue(a, sortColumn);
    const bValue = getItemValue(b, sortColumn);

    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  function getItemValue(item: Item, column: string): number {
    if (column === 'total') {
      return filteredBranches.reduce((total, branch) => {
        const stock = stockData.find(
          (inv) => inv.item_id === item.id && inv.branch_id === branch.id
        );
        return total + (stock ? stock.stock : 0);
      }, 0);
    } else {
      const branchId = parseInt(column);
      const stock = stockData.find(
        (inv) => inv.item_id === item.id && inv.branch_id === branchId
      );
      return stock ? stock.stock : 0;
    }
  }

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('desc');
    }
  };

  const renderSeparator = () => (
    <TableCell className="p-0 w-[1px]">
      <Separator orientation="vertical" className="h-full mx-auto" />
    </TableCell>
  );

  return (
    <div className="overflow-x-auto">
      <Table className="w-full border-collapse">
        <TableHeader>
          <TableRow className="bg-gray-100">
            <TableHead className="p-2 text-left font-semibold">SKU</TableHead>
            <TableHead className="p-2 text-left font-semibold">Name</TableHead>
            {selectedBranch === 'all' ? (
              <>
                {filteredBranches.map((branch, index) => (
                  <React.Fragment key={branch.id}>
                    <TableHead
                      onClick={() => handleSort(branch.id.toString())}
                      className="p-2 text-center font-semibold cursor-pointer"
                    >
                      <div className="flex items-center justify-center">
                        <span className="mr-1">{branch.name}</span>
                        <ArrowUpDown className="inline" size={12} />
                      </div>
                    </TableHead>
                    {index < filteredBranches.length - 1 && renderSeparator()}
                  </React.Fragment>
                ))}
                {renderSeparator()}
                <TableHead
                  onClick={() => handleSort('total')}
                  className="p-2 text-center font-semibold cursor-pointer"
                >
                  <div className="flex items-center justify-center">
                    <span className="mr-1">Total</span>
                    <ArrowUpDown className="inline" size={12} />
                  </div>
                </TableHead>
              </>
            ) : (
              <TableHead
                onClick={() => handleSort(selectedBranch)}
                className="p-2 text-center font-semibold cursor-pointer"
              >
                <div className="flex items-center justify-center">
                  <span className="mr-1">Qty</span>
                  <ArrowUpDown className="inline" size={12} />
                </div>
              </TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedItems.map((item) => {
            let total = 0;
            return (
              <TableRow key={item.id} className="border-b hover:bg-gray-50">
                <TableCell className="p-2">{item.sku}</TableCell>
                <TableCell className="p-2">{item.name}</TableCell>
                {selectedBranch === 'all' ? (
                  <>
                    {filteredBranches.map((branch, index) => {
                      const stock = stockData.find(
                        (inv) => inv.item_id === item.id && inv.branch_id === branch.id
                      );
                      const stockValue = stock ? stock.stock : 0;
                      total += stockValue;
                      return (
                        <React.Fragment key={branch.id}>
                          <TableCell className="p-2 text-center">{stockValue}</TableCell>
                          {index < filteredBranches.length - 1 && renderSeparator()}
                        </React.Fragment>
                      );
                    })}
                    {renderSeparator()}
                    <TableCell className="p-2 text-center font-semibold">{total}</TableCell>
                  </>
                ) : (
                  <TableCell className="p-2 text-center">
                    {stockData.find(
                      (inv) => inv.item_id === item.id && inv.branch_id === parseInt(selectedBranch)
                    )?.stock || 0}
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
