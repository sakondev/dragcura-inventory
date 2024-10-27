import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { InventoryItem } from "@/types/inventory";

interface InventorySummaryProps {
  inventory: InventoryItem[];
}

const InventorySummary: React.FC<InventorySummaryProps> = ({ inventory }) => {
  const totalSKUs = new Set(inventory.map(item => item.item_sku)).size;
  const totalQuantity = inventory.reduce((sum, item) => sum + item.qty, 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Total SKUs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalSKUs.toLocaleString()}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Total Quantity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalQuantity.toLocaleString()}</div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InventorySummary;