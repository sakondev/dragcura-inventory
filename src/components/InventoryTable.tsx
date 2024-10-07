import React, { useState } from 'react';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Item, Branch, InventoryData } from '@/types/types';
import { ArrowUpDown } from 'lucide-react';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
  const [itemsPerPage, setItemsPerPage] = useState<number | 'all'>('all');
  const [currentPage, setCurrentPage] = useState(1);

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

  const totalPages = itemsPerPage === 'all' ? 1 : Math.ceil(sortedItems.length / (itemsPerPage as number));
  const paginatedItems = itemsPerPage === 'all' ? sortedItems : sortedItems.slice((currentPage - 1) * (itemsPerPage as number), currentPage * (itemsPerPage as number));

  function getItemValue(item: Item, column: string): number {
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
  }

  const handleSort = (column: string) => {
  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('desc');
    }
  };
  }

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(value === 'all' ? 'all' : parseInt(value));
    setCurrentPage(1);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <Select onValueChange={handleItemsPerPageChange} value={itemsPerPage.toString()}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Items per page" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="30">30 per page</SelectItem>
            <SelectItem value="100">100 per page</SelectItem>
            <SelectItem value="all">All items</SelectItem>
          </SelectContent>
        </Select>
      </div>
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
            {paginatedItems.map((item) => {
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
      {itemsPerPage !== 'all' && (
        <Pagination className="mt-4">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} />
            </PaginationItem>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <PaginationItem key={page}>
                <PaginationLink onClick={() => setCurrentPage(page)} isActive={currentPage === page}>
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};

export default InventoryTable;
