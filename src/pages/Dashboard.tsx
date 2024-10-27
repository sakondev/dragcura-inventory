import React, { useState, useEffect } from "react";
import FilterPanel from "../components/FilterPanel";
import { useToast } from "@/components/ui/use-toast";
import { DateRange } from "react-day-picker";
import { useSalesData } from "@/hooks/useSalesData";
import { filterSalesByType } from "@/utils/salesFilters";
import DashboardContent from "@/components/DashboardContent";
import LoadingSpinner from "@/components/LoadingSpinner";

const Dashboard: React.FC = () => {
  const [selectedBranch, setSelectedBranch] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [chartType, setChartType] = useState<"all" | "offline" | "online">("all");

  const { toast } = useToast();
  const { branches, items, saleDates, isLoading, error } = useSalesData(
    dateRange,
    selectedBranch
  );

  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: "Unable to load data. Please try again.",
        variant: "destructive",
      });
    }
  }, [error, toast]);

  useEffect(() => {
    if (saleDates?.data && saleDates.data.length > 0 && !dateRange) {
      const latestDate = new Date(
        Math.max(...saleDates.data.map((d) => new Date(d.date).getTime()))
      );
      setDateRange({ from: latestDate, to: latestDate });
    }
  }, [saleDates, dateRange]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

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
    chartType
  );

  const branchChartData =
    selectedBranch === "all" ||
    selectedBranch === "offline" ||
    selectedBranch === "online"
      ? (branches?.data || [])
          .filter((branch) => branch.isSale === 1)
          .reduce((acc, branch) => {
            const branchSales = filteredByType.filter(
              (sale) => sale.branch_name === branch.name
            );
            const totalSales = branchSales.reduce(
              (sum, sale) => sum + sale.net_sales,
              0
            );
            if (totalSales > 0) {
              acc.push({ name: branch.name, value: totalSales });
            }
            return acc;
          }, [] as Array<{ name: string; value: number }>)
      : [];

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

  const availableSaleDates = saleDates?.data.map((d) => new Date(d.date)) || [];

  return (
    <div className="container mx-auto p-4">
      <FilterPanel
        branches={
          branches?.data.filter((b) => b.isSale === 1).map((b) => b.name) || []
        }
        selectedBranch={selectedBranch}
        onBranchChange={setSelectedBranch}
        onSearchChange={setSearchTerm}
        onDateRangeChange={setDateRange}
        dateRange={dateRange}
        saleDates={availableSaleDates}
      />
      {!isLoading && items?.data && (
        <DashboardContent
          isLoading={isLoading}
          selectedBranch={selectedBranch}
          chartType={chartType}
          setChartType={setChartType}
          filteredByType={filteredByType}
          totalSales={totalSales}
          inStoreSales={inStoreSales}
          onlineSales={onlineSales}
          branchChartData={branchChartData}
          productChartData={productChartData}
          tableData={tableData}
        />
      )}
    </div>
  );
};

export default Dashboard;