import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DashboardStatsProps {
  totalSales: number;
  inStoreSales: number;
  onlineSales: number;
  selectedBranch: string;
}

const DashboardStats: React.FC<DashboardStatsProps> = ({
  totalSales,
  inStoreSales,
  onlineSales,
  selectedBranch,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
      {(selectedBranch === "all" ||
        selectedBranch === "offline" ||
        selectedBranch === "online") && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Total Sales</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                {totalSales.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
                {" "}THB
              </p>
            </CardContent>
          </Card>
          {selectedBranch !== "online" && (
            <Card>
              <CardHeader>
                <CardTitle>In-Store Sales</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">
                  {inStoreSales.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                  {" "}THB
                </p>
              </CardContent>
            </Card>
          )}
          {selectedBranch !== "offline" && (
            <Card>
              <CardHeader>
                <CardTitle>Online Sales</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">
                  {onlineSales.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                  {" "}THB
                </p>
              </CardContent>
            </Card>
          )}
        </>
      )}
      {selectedBranch !== "all" &&
        selectedBranch !== "offline" &&
        selectedBranch !== "online" && (
          <Card className="md:col-span-3">
            <CardHeader>
              <CardTitle>Total Sales for {selectedBranch}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                {totalSales.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
                {" "}THB
              </p>
            </CardContent>
          </Card>
        )}
    </div>
  );
};

export default DashboardStats;