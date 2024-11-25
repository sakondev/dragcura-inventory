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

  const handleExportValue = () => {
    if (!inventory.length) return;

    const summaryData = branches
      .filter((branch) => branch.id >= 1 && branch.id <= 12)
      .map((branch) => {
        const branchItems = inventory.filter(
          (item) => item.branch_name === branch.name
        );
        const totalQty = branchItems.reduce((sum, item) => sum + item.qty, 0);
        const totalValue = branchItems.reduce(
          (sum, item) => sum + ((item.price || 0) * item.qty),
          0
        );

        return {
          Branch: branch.name,
          "Total Items (Qty)": totalQty,
          "Total Value": totalValue,
        };
      });

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(wb, ws, "Inventory Value");
    const fileName = `DragCura_Inventory_Value_${selectedDate}.xlsx`;
    XLSX.writeFile(wb, fileName);
    toast.success(`Exported to ${fileName}`);
  };

  if (!branches.length || !stockDates.length) {
    return <LoadingSpinner />;
  }

  return (
    <div className="container mx-auto p-4">
      <InventoryFilterPanel
        branches={branches.filter((b) => b.id >= 1 && b.id <= 12)}
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
              <Button onClick={handleExportValue}>EXCEL BY VALUE</Button>
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
              branches={branches}
            />
          ) : (
            <InventoryTable
              inventory={filteredInventory}
              branches={branches}
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