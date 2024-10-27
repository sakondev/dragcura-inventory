import React from "react";
import type { InventoryItem } from "@/types/inventory";

interface InventorySummaryProps {
  inventory: InventoryItem[];
}

const InventorySummary: React.FC<InventorySummaryProps> = ({ inventory }) => {
  const totalSKUs = new Set(inventory.map(item => item.item_sku)).size;
  const totalQuantity = inventory.reduce((sum, item) => sum + item.qty, 0);

  return (
    <div className="mb-4 p-4 bg-gray-100 rounded-md">
      <p className="text-lg font-semibold">
        Total Items: {totalSKUs.toLocaleString()} | Total Quantity: {totalQuantity.toLocaleString()}
      </p>
    </div>
  );
};

export default InventorySummary;