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

  const filteredItems = items.filter(item =>
    item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
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
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>SKU</TableHead>
          <TableHead>Name</TableHead>
          {selectedBranch === 'all' ? (
            <>
              {filteredBranches.map((branch) => (
                <TableHead key={branch.id} onClick={() => handleSort(branch.id.toString())} className="cursor-pointer">
                  {branch.name} <ArrowUpDown className="inline ml-1" size={16} />
                </TableHead>
              ))}
              <TableHead onClick={() => handleSort('total')} className="cursor-pointer">
                Total <ArrowUpDown className="inline ml-1" size={16} />
              </TableHead>
            </>
          ) : (
            <TableHead onClick={() => handleSort(selectedBranch)} className="cursor-pointer">
              Qty <ArrowUpDown className="inline ml-1" size={16} />
            </TableHead>
          )}
        </TableRow>
      </TableHeader>
      <TableBody>
        {sortedItems.map((item) => {
          let total = 0;
          return (
            <TableRow key={item.id}>
              <TableCell>{item.sku}</TableCell>
              <TableCell>{item.name}</TableCell>
              {selectedBranch === 'all' ? (
                <>
                  {filteredBranches.map((branch) => {
                    const stock = stockData.find(
                      (inv) => inv.item_id === item.id && inv.branch_id === branch.id
                    );
                    const stockValue = stock ? stock.stock : 0;
                    total += stockValue;
                    return <TableCell key={branch.id}>{stockValue}</TableCell>;
                  })}
                  <TableCell>{total}</TableCell>
                </>
              ) : (
                <TableCell>
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
  );
};

export default InventoryTable;