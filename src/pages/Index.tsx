import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { DatabaseResponse } from '@/types/types';
import InventoryTable from '@/components/InventoryTable';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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

  useEffect(() => {
    if (data) {
      const dates = Object.keys(data.inventory).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
      setSelectedDate(dates[0].substring(0, 10));
    }
  }, [data]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>An error occurred: {(error as Error).message}</div>;
  if (!data) return <div>No data available</div>;

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(e.target.value);
  };

  const dates = Object.keys(data.inventory).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
  const minDate = dates[dates.length - 1].substring(0, 10);
  const maxDate = dates[0].substring(0, 10);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">DragCura Inventory</h1>
      <div className="mb-4">
        <label htmlFor="dateFilter" className="mr-2">Select Date:</label>
        <Input
          type="date"
          id="dateFilter"
          value={selectedDate}
          onChange={handleDateChange}
          min={minDate}
          max={maxDate}
          className="w-40 inline-block"
        />
      </div>
      <div id="selectedDateTime" className="mb-4 inline-block bg-blue-100 text-blue-800 px-4 py-2 rounded-full">
        {selectedDate}
      </div>
      <InventoryTable
        items={data.items}
        branches={data.branches}
        inventoryData={data.inventory}
        selectedDate={selectedDate}
      />
      <div className="mt-4">
        <Button onClick={() => window.print()}>Print</Button>
      </div>
    </div>
  );
};

export default Index;