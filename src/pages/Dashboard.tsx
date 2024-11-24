import React, { useState, useEffect } from "react";
import FilterPanel from "../components/FilterPanel";
import { DateRange } from "react-day-picker";
import { useSalesData } from "@/hooks/useSalesData";
import { filterSalesByType } from "@/utils/salesFilters";
import DashboardContent from "@/components/DashboardContent";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import * as XLSX from "xlsx";

const Dashboard: React.FC = () => {
  const [selectedBranches, setSelectedBranches] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);

  const { branches, items, saleDates, error } = useSalesData(
    dateRange,
    selectedBranches.length > 0 ? selectedBranches.join(",") : "all"
  );

  useEffect(() => {
    if (error) {
      toast.error("Unable to load data. Please try again.");
    }
  }, [error]);

  useEffect(() => {
    if (saleDates?.data && saleDates.data.length > 0) {
      const latestDate = new Date(
        Math.max(...saleDates.data.map((d) => new Date(d.date).getTime()))
      );
      setDateRange({ from: latestDate, to: latestDate });
    }
  }, [saleDates]);

  const filteredSales = (items?.data || []).filter((sale) => {
    const matchesSearch =
      searchTerm === "" ||
      sale.item_sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.item_name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const filteredByType = filterSalesByType(
    filteredSales,
    branches?.data || [],
    "all"
  );

  const branchChartData = Object.values(
    filteredByType.reduce((acc, sale) => {
      if (
        selectedBranches.length === 0 ||
        selectedBranches.includes(sale.branch_name)
      ) {
        if (!acc[sale.branch_name]) {
          acc[sale.branch_name] = {
            name: sale.branch_name,
            value: 0,
          };
        }
        acc[sale.branch_name].value += sale.net_sales;
      }
      return acc;
    }, {} as Record<string, { name: string; value: number }>)
  ).sort((a, b) => b.value - a.value);

  const productChartData = Object.values(
    filteredByType.reduce((acc, sale) => {
      if (!acc[sale.item_sku]) {
        acc[sale.item_sku] = {
          name: sale.item_name,
          value: 0,
          totalSales: 0,
        };
      }
      acc[sale.item_sku].value += sale.qty;
      acc[sale.item_sku].totalSales += sale.net_sales;
      return acc;
    }, {} as Record<string, { name: string; value: number; totalSales: number }>)
  )
    .filter((item) => item.totalSales > 0)
    .sort((a, b) => b.value - a.value)
    .slice(0, 10)
    .map((item) => ({
      name: item.name,
      value: item.value,
    }));

  const tableData = Object.values(
    filteredByType.reduce((acc, sale) => {
      if (!acc[sale.item_sku]) {
        acc[sale.item_sku] = {
          sku: sale.item_sku,
          name: sale.item_name,
          qtySold: 0,
          totalSale: 0,
        };
      }
      acc[sale.item_sku].qtySold += sale.qty;
      acc[sale.item_sku].totalSale += sale.net_sales;
      return acc;
    }, {} as Record<string, { sku: string; name: string; qtySold: number; totalSale: number }>)
  );

  const totalSales = filteredByType.reduce(
    (sum, sale) => sum + sale.net_sales,
    0
  );

  const inStoreSales = filteredByType
    .filter(
      (sale) =>
        !branches?.data.find((b) => b.name === sale.branch_name)?.isOnline
    )
    .reduce((sum, sale) => sum + sale.net_sales, 0);

  const onlineSales = filteredByType
    .filter(
      (sale) =>
        branches?.data.find((b) => b.name === sale.branch_name)?.isOnline
    )
    .reduce((sum, sale) => sum + sale.net_sales, 0);

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
      const wb = XLSX.utils.table_to_book(table);
      const fileName = `DragCura_Sales_${dateRange?.from ? new Date(dateRange.from).toISOString().split('T')[0] : 'all'}_to_${dateRange?.to ? new Date(dateRange.to).toISOString().split('T')[0] : 'all'}.xlsx`;
      XLSX.writeFile(wb, fileName);
      toast.success(`ส่งออกไปยัง ${fileName} แล้ว`);
    } else {
      toast.error("ไม่สามารถส่งออกตารางได้");
    }
  };

  const handleExportExcelByBranch = () => {
    if (!items?.data) return;

    // Get unique SKUs and product names
    const products = Array.from(
      new Set(items.data.map((item) => item.item_sku))
    ).map((sku) => {
      const item = items.data.find((i) => i.item_sku === sku);
      return {
        sku,
        name: item?.item_name || "",
      };
    });

    // Get unique branches
    const uniqueBranches = Array.from(
      new Set(items.data.map((item) => item.branch_name))
    ).sort();

    // Create data for Excel
    const excelData = products.map((product) => {
      const row: any = {
        SKU: product.sku,
        "Product Name": product.name,
      };

      // Add quantity for each branch
      uniqueBranches.forEach((branch) => {
        const branchQty = items.data
          .filter(
            (item) =>
              item.item_sku === product.sku && item.branch_name === branch
          )
          .reduce((sum, item) => sum + item.qty, 0);
        row[`${branch} Qty`] = branchQty;
      });

      // Add total quantity
      row["Total Qty"] = items.data
        .filter((item) => item.item_sku === product.sku)
        .reduce((sum, item) => sum + item.qty, 0);

      return row;
    });

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

  return (
    <div className="container mx-auto p-4">
      <FilterPanel
        branches={
          branches?.data.filter((b) => b.isSale === 1).map((b) => b.name) || []
        }
        selectedBranches={selectedBranches}
        onBranchChange={setSelectedBranches}
        onSearchChange={setSearchTerm}
        onDateRangeChange={setDateRange}
        dateRange={dateRange}
        saleDates={saleDates?.data.map((d) => new Date(d.date)) || []}
      />
      {items?.data && (
        <>
          <div className="mb-4 flex justify-start space-x-2">
            <Button onClick={handleCopyTable}>COPY</Button>
            <Button onClick={handleExportExcel}>EXCEL</Button>
            <Button onClick={handleExportExcelByBranch}>EXCEL BY BRANCH</Button>
          </div>
          <DashboardContent
            selectedBranch={
              selectedBranches.length === 0 ? "all" : selectedBranches.join(",")
            }
            filteredByType={filteredByType}
            totalSales={totalSales}
            inStoreSales={inStoreSales}
            onlineSales={onlineSales}
            branchChartData={branchChartData}
            productChartData={productChartData}
            tableData={tableData}
          />
        </>
      )}
    </div>
  );
};

export default Dashboard;
