import React from 'react';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Item, Branch, InventoryData } from '@/types/types';

interface InventoryTableProps {
  items: Item[];
  branches: Branch[];
  inventoryData: InventoryData;
  selectedDate: string;
  searchTerm: string;
  selectedBranch: string;
}

const InventoryTable: React.FC<InventoryTableProps> = ({ items, branches, inventoryData, selectedDate, searchTerm, selectedBranch }) => {
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

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>SKU</TableHead>
          <TableHead>Name</TableHead>
          {selectedBranch === 'all' ? (
            <>
              {filteredBranches.map((branch) => (
                <TableHead key={branch.id}>{branch.name}</TableHead>
              ))}
              <TableHead>Total</TableHead>
            </>
          ) : (
            <TableHead>Qty</TableHead>
          )}
        </TableRow>
      </TableHeader>
      <TableBody>
        {filteredItems.map((item) => {
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