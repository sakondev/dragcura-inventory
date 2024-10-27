import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

const InventoryTableSkeleton = () => {
  return (
    <div className="space-y-4">
      <div className="flex gap-4 mb-6">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-24" />
      </div>
      <div className="space-y-2">
        <div className="flex gap-4 items-center">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-8 w-20" />
        </div>
        {[...Array(8)].map((_, i) => (
          <div key={i} className="flex gap-4 items-center">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-6 w-20" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default InventoryTableSkeleton;