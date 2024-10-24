import React from "react";
import { Button } from "@/components/ui/button";
import DashboardStats from "./DashboardStats";
import SalesChart from "./SalesChart";
import SalesTable from "./SalesTable";
import { SaleItem, Branch } from "@/types/sales";
import { Skeleton } from "@/components/ui/skeleton";

interface DashboardContentProps {
  isLoading: boolean;
  selectedBranch: string;
  chartType: "all" | "offline" | "online";
  setChartType: (type: "all" | "offline" | "online") => void;
  branches?: Branch[];
  filteredByType: SaleItem[];
  totalSales: number;
  inStoreSales: number;
  onlineSales: number;
  branchChartData: Array<{ name: string; value: number }>;
  productChartData: Array<{ name: string; value: number }>;
  tableData: Array<{
    sku: string;
    name: string;
    qtySold: number;
    totalSale: number;
  }>;
}

const DashboardContent: React.FC<DashboardContentProps> = ({
  isLoading,
  selectedBranch,
  chartType,
  setChartType,
  filteredByType,
  totalSales,
  inStoreSales,
  onlineSales,
  branchChartData,
  productChartData,
  tableData,
}) => {
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-6 rounded-lg border">
              <Skeleton className="h-4 w-24 mb-4" />
              <Skeleton className="h-8 w-32" />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-96">
            <Skeleton className="w-full h-full" />
          </div>
          <div className="h-96">
            <Skeleton className="w-full h-full" />
          </div>
        </div>
        <Skeleton className="w-full h-96" />
      </div>
    );
  }

  return (
    <>
      <DashboardStats
        totalSales={totalSales}
        inStoreSales={inStoreSales}
        onlineSales={onlineSales}
        selectedBranch={selectedBranch}
      />
      {(selectedBranch === "all" ||
        selectedBranch === "offline" ||
        selectedBranch === "online") && (
        <div className="mb-4">
          <Button
            onClick={() => setChartType("all")}
            variant={chartType === "all" ? "default" : "outline"}
            className="mr-2"
          >
            All
          </Button>
          <Button
            onClick={() => setChartType("offline")}
            variant={chartType === "offline" ? "default" : "outline"}
            className="mr-2"
          >
            In-Store
          </Button>
          <Button
            onClick={() => setChartType("online")}
            variant={chartType === "online" ? "default" : "outline"}
          >
            Online
          </Button>
        </div>
      )}
      <div
        className={`grid ${
          selectedBranch === "all" ||
          selectedBranch === "offline" ||
          selectedBranch === "online"
            ? "grid-cols-1 md:grid-cols-2"
            : "grid-cols-1"
        } gap-4`}
      >
        {(selectedBranch === "all" ||
          selectedBranch === "offline" ||
          selectedBranch === "online") && (
          <div>
            <h2 className="text-xl font-bold mb-2">Sales by Branch</h2>
            <SalesChart data={branchChartData} />
          </div>
        )}
        <div
          className={
            selectedBranch === "all" ||
            selectedBranch === "offline" ||
            selectedBranch === "online"
              ? ""
              : "col-span-1"
          }
        >
          <h2 className="text-xl font-bold mb-2">Top 10 Products</h2>
          <SalesChart data={productChartData} />
        </div>
      </div>
      <SalesTable data={tableData} />
    </>
  );
};

export default DashboardContent;