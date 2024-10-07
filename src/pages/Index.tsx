import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { DatabaseResponse, Branch, InventoryItem } from '@/types/types';
import InventoryTable from '@/components/InventoryTable';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import * as XLSX from 'xlsx';

const fetchInventoryData = async (): Promise<DatabaseResponse> => {
  const response = await fetch('https://sakondev.github.io/drg-inventory/inventory_database.json');
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

const Index = () => {
  const { data, isLoading, error } = useQuery<DatabaseResponse>({
    queryKey: ['inventoryData'],
    queryFn: fetchInventoryData,
  });

  const [selectedDate, setSelectedDate] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedBranch, setSelectedBranch] = useState<string>('all');

  useEffect(() => {
    if (data) {
      const dates = Object.keys(data.inventory).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
      setSelectedDate(dates[0].substring(0, 10));
    }
  }, [data]);

  const handleCopyTable = () => {
    const table = document.querySelector('table');
    if (table) {
      const rows = Array.from(table.querySelectorAll('tr'));
      const csvContent = rows.map(row => 
        Array.from(row.querySelectorAll('th, td'))
          .map(cell => cell.textContent)
          .join('\t')
      ).join('\n');

      navigator.clipboard.writeText(csvContent).then(() => {
        toast.success(`Copied ${rows.length - 1} rows to clipboard`);
      }).catch(err => {
        toast.error('Failed to copy table');
        console.error('Failed to copy table: ', err);
      });
    }
  };

  const handleExportExcel = () => {
    const table = document.querySelector('table');
    if (table) {
      const wb = XLSX.utils.table_to_book(table);
      const fileName = `DragCura_Inventory_${selectedDate}.xlsx`;
      XLSX.writeFile(wb, fileName);
      toast.success(`Exported to ${fileName}`);
    } else {
      toast.error('Failed to export table');
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>An error occurred: {(error as Error).message}</div>;
  if (!data) return <div>No data available</div>;

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(e.target.value);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleBranchChange = (value: string) => {
    setSelectedBranch(value);
  };

  const dates = Object.keys(data.inventory).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
  const minDate = dates[dates.length - 1].substring(0, 10);
  const maxDate = dates[0].substring(0, 10);

  const filteredItems = data.items.filter(item =>
    item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalItems = filteredItems.length;

  const calculateTotalQuantity = (): number => {
    const dateKey = selectedDate.substring(0, 10);
    const stockData = Object.keys(data.inventory).reduce((acc, key) => {
      if (key.startsWith(dateKey)) {
        return data.inventory[key];
      }
      return acc;
    }, [] as InventoryItem[]);

    return stockData.reduce((total, item) => {
      if (selectedBranch === 'all' || item.branch_id.toString() === selectedBranch) {
        return total + item.stock;
      }
      return total;
    }, 0);
  };

  const totalQuantity = calculateTotalQuantity();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">DragCura Inventory</h1>
      <div className="mb-4 flex flex-wrap gap-4">
        <div className="flex-1 min-w-[200px]">
          <label htmlFor="dateFilter" className="block mb-2">Select Date:</label>
          <Input
            type="date"
            id="dateFilter"
            value={selectedDate}
            onChange={handleDateChange}
            min={minDate}
            max={maxDate}
            className="w-full"
          />
        </div>
        <div className="flex-1 min-w-[200px]">
          <label htmlFor="searchFilter" className="block mb-2">Search:</label>
          <Input
            type="text"
            id="searchFilter"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search by SKU or Name"
            className="w-full"
          />
        </div>
        <div className="flex-1 min-w-[200px]">
          <label htmlFor="branchFilter" className="block mb-2">Branch:</label>
          <Select onValueChange={handleBranchChange} value={selectedBranch}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select branch" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Branches</SelectItem>
              {data.branches.map((branch: Branch) => (
                <SelectItem key={branch.id} value={branch.id.toString()}>{branch.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="mb-4 p-4 bg-gray-100 rounded-md">
        <p className="text-lg font-semibold">
          Total Items: {totalItems} | Total Quantity: {totalQuantity} | Showing: 50 items per page
        </p>
      </div>
      <div className="mb-4 flex justify-start space-x-2">
        <Button onClick={handleCopyTable}>COPY</Button>
        <Button onClick={handleExportExcel}>EXCEL</Button>
      </div>
      <InventoryTable
        items={data.items}
        branches={data.branches}
        inventoryData={data.inventory}
        selectedDate={selectedDate}
        searchTerm={searchTerm}
        selectedBranch={selectedBranch}
      />
    </div>
  );
};

export default Index;