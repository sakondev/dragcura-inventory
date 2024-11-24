import * as XLSX from "xlsx";
import { SaleItem } from "@/types/sales";
import { toast } from "sonner";
import { DateRange } from "react-day-picker";

interface ExportData {
  SKU: string;
  "Product Name": string;
  Branch: string;
  Qty: number;
  Value: number;
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