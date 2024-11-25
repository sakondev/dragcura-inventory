import * as XLSX from "xlsx";
import { SaleItem } from "@/types/sales";
import { toast } from "sonner";
import { DateRange } from "react-day-picker";
import { InventoryItem } from "@/types/inventory";

interface ExportData {
  SKU: string;
  "Product Name": string;
  Branch: string;
  Qty: number;
  Value: number;
}

interface ExportInventoryValueData {
  Branch: string;
  "Total Items (Qty)": number;
  "Total Value": number;
}

export const exportSalesByBranch = (items: SaleItem[], dateRange: DateRange | undefined) => {
  if (!items) return;

  // Create data for Excel
  const excelData: ExportData[] = items.reduce((acc: ExportData[], item) => {
    acc.push({
      SKU: item.item_sku,
      "Product Name": item.item_name,
      Branch: item.branch_name,
      Qty: item.qty,
      Value: item.net_sales,
    });
    return acc;
  }, []);

  // Create and download Excel file
  const ws = XLSX.utils.json_to_sheet(excelData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Sales By Branch");

  const fileName = `DragCura_Sales_ByBranch_${
    dateRange?.from
      ? new Date(dateRange.from).toISOString().split("T")[0]
      : "all"
  }_to_${
    dateRange?.to ? new Date(dateRange.to).toISOString().split("T")[0] : "all"
  }.xlsx`;

  try {
    XLSX.writeFile(wb, fileName);
    toast.success(`ส่งออกไปยัง ${fileName} แล้ว`);
  } catch (err) {
    toast.error("ไม่สามารถส่งออกตารางได้");
    console.error("Failed to export table: ", err);
  }
};

export const exportInventoryByValue = (inventory: InventoryItem[]) => {
  if (!inventory) return;

  // Group and calculate totals by branch
  const branchTotals = inventory.reduce((acc: Record<string, { qty: number; value: number }>, item) => {
    if (!acc[item.branch_name]) {
      acc[item.branch_name] = { qty: 0, value: 0 };
    }
    acc[item.branch_name].qty += item.qty;
    // Assuming each item's value is qty * 1 (or you can add a price field if available)
    acc[item.branch_name].value += item.qty;
    return acc;
  }, {});

  // Convert to export format
  const excelData: ExportInventoryValueData[] = Object.entries(branchTotals).map(([branch, totals]) => ({
    Branch: branch,
    "Total Items (Qty)": totals.qty,
    "Total Value": totals.value,
  }));

  // Create and download Excel file
  const ws = XLSX.utils.json_to_sheet(excelData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Inventory By Value");

  const fileName = `DragCura_Inventory_ByValue_${new Date().toISOString().split("T")[0]}.xlsx`;

  try {
    XLSX.writeFile(wb, fileName);
    toast.success(`ส่งออกไปยัง ${fileName} แล้ว`);
  } catch (err) {
    toast.error("ไม่สามารถส่งออกตารางได้");
    console.error("Failed to export table: ", err);
  }
};