import React from "react";
import DashboardStats from "./DashboardStats";
import SalesChart from "./SalesChart";
import SalesTable from "./SalesTable";
import { SaleItem, Branch } from "@/types/sales";

interface DashboardContentProps {
  selectedBranch: string;
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
  selectedBranch,
  filteredByType,
  totalSales,
  inStoreSales,
  onlineSales,
  branchChartData,
  productChartData,
  tableData,
}) => {
  // Check if selectedBranch contains multiple branches (comma-separated)
  const hasMultipleBranches = selectedBranch.includes(',');
  const shouldShowBranchChart = selectedBranch === "all" || 
    selectedBranch === "offline" || 
    selectedBranch === "online" ||
    hasMultipleBranches;

  return (
    <>
      <DashboardStats
        totalSales={totalSales}
        inStoreSales={inStoreSales}
        onlineSales={onlineSales}
        selectedBranch={selectedBranch}
      />
      <div
        className={`grid ${
          shouldShowBranchChart
            ? "grid-cols-1 md:grid-cols-2"
            : "grid-cols-1"
        } gap-4`}
      >
        {shouldShowBranchChart && (
          <div>
            <h2 className="text-xl font-bold mb-2">Sales by Branch</h2>
            <SalesChart data={branchChartData} />
          </div>
        )}
        <div
          className={
            shouldShowBranchChart
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