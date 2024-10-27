import React, { useState, useEffect } from "react";
import InventoryTable from "@/components/InventoryTable";
import InventoryFilterPanel from "@/components/InventoryFilterPanel";
import { useInventoryData } from "@/hooks/useInventoryData";
import DataLoadingIndicator from "@/components/DataLoadingIndicator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Inventory = () => {
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedBranch, setSelectedBranch] = useState<string>("all");

  const { branches, stockDates, inventory, isLoading } = useInventoryData(
    selectedDate,
    selectedBranch
  );

  // Set initial date to latest date
  useEffect(() => {
    if (stockDates && stockDates.length > 0 && !selectedDate) {
      const latestDate = stockDates[0].date.split(" ")[0];
      setSelectedDate(latestDate);
    }
  }, [stockDates, selectedDate]);

  if (isLoading) {
    return <DataLoadingIndicator />;
  }

  const totalItems = inventory.length;
  const totalQty = inventory.reduce((sum, item) => sum + item.qty, 0);

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Items</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{totalItems}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Quantity</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{totalQty}</p>
          </CardContent>
        </Card>
      </div>
      
      <InventoryFilterPanel
        branches={branches}
        stockDates={stockDates}
        selectedDate={selectedDate}
        selectedBranch={selectedBranch}
        searchTerm={searchTerm}
        onDateChange={setSelectedDate}
        onBranchChange={setSelectedBranch}
        onSearchChange={setSearchTerm}
      />

      {inventory && inventory.length > 0 ? (
        <InventoryTable
          inventory={inventory}
          branches={branches}
          searchTerm={searchTerm}
          selectedBranch={selectedBranch}
        />
      ) : (
        <div className="text-center p-4">
          ไม่พบรายการที่ตรงกับเงื่อนไขการค้นหา
        </div>
      )}
    </div>
  );
};

export default Inventory;