import React, { useState } from 'react';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Item, Branch, InventoryData } from '@/types/types';
import { ArrowUpDown } from 'lucide-react';

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

  const selectedBranchObj = branches.find(branch => branch.id.toString() === selectedBranch);
  const isVendingMachine = selectedBranchObj?.isVendingMachine || false;

  const filteredItems = items.filter(item =>
    (item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.name.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (!isVendingMachine || (selectedBranchObj?.vendingMachineSKUs?.includes(item.sku)))
  );

  const filteredBranches = selectedBranch === 'all' ? branches : branches.filter(branch => branch.id.toString() === selectedBranch);

  const sortedItems = [...filteredItems].sort((a, b) => {
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

  return (
    <div className="overflow-x-auto">
      <Table className="w-full border-collapse">
        <TableHeader>
          <TableRow className="bg-gray-100">
            <TableHead className="p-2 text-left font-semibold">SKU</TableHead>
            <TableHead className="p-2 text-left font-semibold">Name</TableHead>
            {selectedBranch === 'all' ? (
              <>
                {filteredBranches.map((branch) => (
                  <TableHead
                    key={branch.id}
                    onClick={() => handleSort(branch.id.toString())}
                    className="p-2 text-left font-semibold cursor-pointer"
                  >
                    <div className="flex items-center">
                      <span className="mr-1">{branch.name}</span>
                      <ArrowUpDown className="inline" size={12} />
                    </div>
                  </TableHead>
                ))}
                <TableHead
                  onClick={() => handleSort('total')}
                  className="p-2 text-left font-semibold cursor-pointer"
                >
                  <div className="flex items-center">
                    <span className="mr-1">Total</span>
                    <ArrowUpDown className="inline" size={12} />
                  </div>
                </TableHead>
              </>
            ) : (
              <TableHead
                onClick={() => handleSort(selectedBranch)}
                className="p-2 text-left font-semibold cursor-pointer"
              >
                <div className="flex items-center">
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
                    {filteredBranches.map((branch) => {
                      const stock = stockData.find(
                        (inv) => inv.item_id === item.id && inv.branch_id === branch.id
                      );
                      const stockValue = stock ? stock.stock : 0;
                      total += stockValue;
                      return <TableCell key={branch.id} className="p-2 text-right">{stockValue}</TableCell>;
                    })}
                    <TableCell className="p-2 text-right font-semibold">{total}</TableCell>
                  </>
                ) : (
                  <TableCell className="p-2 text-right">
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