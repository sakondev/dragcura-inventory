import React, { useState, useEffect } from "react";
import InventoryTable from "@/components/InventoryTable";
import InventoryFilterPanel from "@/components/InventoryFilterPanel";
import { useInventoryData } from "@/hooks/useInventoryData";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import * as XLSX from "xlsx";
import DataLoadingIndicator from "@/components/DataLoadingIndicator";
import type { StockDate } from "@/types/inventory";

const Inventory = () => {
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedBranch, setSelectedBranch] = useState<string>("all");

  const { branches, stockDates, inventory, isLoading } = useInventoryData(
    selectedDate,
    selectedBranch
  );

  // Set initial date when stockDates are loaded
  useEffect(() => {
    if (stockDates && stockDates.length > 0 && !selectedDate) {
      const latestDate = stockDates[0].date.split(" ")[0];
      setSelectedDate(latestDate);
    }
  }, [stockDates, selectedDate]);

  const handleCopyTable = () => {
    const table = document.querySelector("table");
    if (table) {
      const rows = Array.from(table.querySelectorAll("tr"));
      const csvContent = rows
        .map((row) =>
          Array.from(row.querySelectorAll("th, td"))
            .map((cell) => cell.textContent)
            .join("\t")
        )
        .join("\n");

      navigator.clipboard
        .writeText(csvContent)
        .then(() => {
          toast.success(`Copied ${rows.length - 1} rows to clipboard`);
        })
        .catch((err) => {
          toast.error("Failed to copy table");
          console.error("Failed to copy table: ", err);
        });
    }
  };

  const handleExportExcel = () => {
    const table = document.querySelector("table");
    if (table) {
      const wb = XLSX.utils.table_to_book(table);
      const fileName = `DragCura_Inventory_${selectedDate}.xlsx`;
      XLSX.writeFile(wb, fileName);
      toast.success(`Exported to ${fileName}`);
    } else {
      toast.error("Failed to export table");
    }
  };

  if (isLoading) {
    return <DataLoadingIndicator />;
  }

  return (
    <div className="container mx-auto p-4">
      <InventoryFilterPanel
        branches={branches.map(b => b.name)}
        stockDates={stockDates}
        selectedDate={selectedDate}
        selectedBranch={selectedBranch}
        searchTerm={searchTerm}
        onDateChange={setSelectedDate}
        onBranchChange={setSelectedBranch}
        onSearchChange={setSearchTerm}
      />
      <div className="mb-4 flex justify-start space-x-2">
        <Button onClick={handleCopyTable}>COPY</Button>
        <Button onClick={handleExportExcel}>EXCEL</Button>
      </div>
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
