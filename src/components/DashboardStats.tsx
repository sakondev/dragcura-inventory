import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CircleDollarSign, Store, ShoppingCart, Building2 } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
  const formatBranchDisplay = (branches: string) => {
    const branchArray = branches.split(",");
    if (branchArray.length <= 2) return branches;
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger className="cursor-help">
            <span>
              {branchArray[0]}, {branchArray[1]} +{branchArray.length - 2} more
            </span>
          </TooltipTrigger>
          <TooltipContent>
            <p>{branchArray.join(", ")}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
      {(selectedBranch === "all" ||
        selectedBranch === "offline" ||
        selectedBranch === "online") && (
        <>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
              <CircleDollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {totalSales.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
                <span className="text-xs text-muted-foreground ml-1">THB</span>
              </div>
            </CardContent>
          </Card>
          {selectedBranch !== "online" && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  In-Store Sales
                </CardTitle>
                <Store className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {inStoreSales.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                  <span className="text-xs text-muted-foreground ml-1">
                    THB
                  </span>
                </div>
              </CardContent>
            </Card>
          )}
          {selectedBranch !== "offline" && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Online Sales
                </CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {onlineSales.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                  <span className="text-xs text-muted-foreground ml-1">
                    THB
                  </span>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
      {selectedBranch !== "all" &&
        selectedBranch !== "offline" &&
        selectedBranch !== "online" && (
          <Card className="md:col-span-3">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Selected Branches: {formatBranchDisplay(selectedBranch)}
              </CardTitle>
              <CircleDollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {totalSales.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
                <span className="text-xs text-muted-foreground ml-1">THB</span>
              </div>
            </CardContent>
          </Card>
        )}
    </div>
  );
};

export default DashboardStats;
