
import React, { useState, useEffect } from "react";
import InventoryTable from "@/components/InventoryTable";
import InventorySummaryTable from "@/components/inventory/InventorySummaryTable";
import InventoryFilterPanel from "@/components/InventoryFilterPanel";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import * as XLSX from "xlsx";
import InventorySummary from "@/components/InventorySummary";
import { useInventoryData } from "@/hooks/useInventoryData";
import LoadingSpinner from "@/components/LoadingSpinner";

const Inventory = () => {
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedBranch, setSelectedBranch] = useState<string>("all");
  const [showSummaryView, setShowSummaryView] = useState(false);

  const { branches, stockDates, inventory } = useInventoryData(
    selectedDate,
    selectedBranch
  );

  // Filter branches to exclude 11, 12 and include 36
  const filteredBranches = branches.filter(
    (b) => ![11, 12].includes(b.id) && (b.id <= 10 || b.id === 36)
  );

  const filteredInventory = inventory.filter(
    (item) =>
      item.item_sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.item_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    if (stockDates && stockDates.length > 0 && !selectedDate) {
      const today = new Date();
      const closestDate = stockDates.reduce((prev, curr) => {
        const currDate = new Date(curr.date.split(" ")[0]);
        return Math.abs(currDate.getTime() - today.getTime()) <
          Math.abs(prev.getTime() - today.getTime())
          ? currDate
          : prev;
      }, new Date(stockDates[0].date.split(" ")[0]));
      setSelectedDate(closestDate.toISOString().split("T")[0]);
    }
  }, [stockDates]);

  const handleCopyTable = () => {
    const table = document.querySelector("table");
    if (table) {
      const rows = Array.from(table.querySelectorAll("tr"));
      const csvContent = rows
        .map((row) =>
          Array.from(row.querySelectorAll("th, td"))
            .filter((cell) => !cell.classList.contains("p-0")) // Skip separator cells
            .map((cell) => cell.textContent?.trim())
            .join("\t")
        )
        .join("\n");

      navigator.clipboard
        .writeText(csvContent)
        .then(() => {
          toast.success(`คัดลอก ${rows.length - 1} แถวไปยังคลิปบอร์ดแล้ว`);
        })
        .catch((err) => {
          toast.error("ไม่สามารถคัดลอกตารางได้");
          console.error("Failed to copy table: ", err);
        });
    }
  };

  const handleExportExcel = () => {
    const table = document.querySelector("table");
    if (table) {
      // Create a clone of the table to modify
      const tableClone = table.cloneNode(true) as HTMLTableElement;
      
      // Remove separator cells
      const separatorCells = tableClone.querySelectorAll('.p-0');
      separatorCells.forEach(cell => cell.remove());

      const wb = XLSX.utils.table_to_book(tableClone);
      const fileName = `DragCura_Inventory_${selectedDate}.xlsx`;
      XLSX.writeFile(wb, fileName);
      toast.success(`ส่งออกไปยัง ${fileName} แล้ว`);
    } else {
      toast.error("ไม่สามารถส่งออกตารางได้");
    }
  };

  if (!branches.length || !stockDates.length) {
    return <LoadingSpinner />;
  }

  return (
    <div className="container mx-auto p-4">
      <InventoryFilterPanel
        branches={filteredBranches}
        stockDates={stockDates}
        selectedDate={selectedDate}
        selectedBranch={selectedBranch}
        searchTerm={searchTerm}
        onDateChange={setSelectedDate}
        onBranchChange={setSelectedBranch}
        onSearchChange={setSearchTerm}
      />
      {inventory.length === 0 ? (
        <div></div>
      ) : (
        <>
          <InventorySummary filteredInventory={filteredInventory} />
          <div className="mb-4 flex justify-between items-center">
            <div className="flex space-x-2">
              <Button onClick={handleCopyTable}>COPY</Button>
              <Button onClick={handleExportExcel}>EXCEL</Button>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="view-mode"
                checked={showSummaryView}
                onCheckedChange={setShowSummaryView}
              />
              <Label htmlFor="view-mode">
                {showSummaryView ? "Summary View" : "Detail View"}
              </Label>
            </div>
          </div>
          {showSummaryView ? (
            <InventorySummaryTable
              inventory={filteredInventory}
              branches={filteredBranches}
            />
          ) : (
            <InventoryTable
              inventory={filteredInventory}
              branches={filteredBranches}
              searchTerm={searchTerm}
              selectedBranch={selectedBranch}
            />
          )}
        </>
      )}
    </div>
  );
};

export default Inventory;
