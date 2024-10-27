import React from "react";
import type { InventoryItem } from "@/types/inventory";

interface InventorySummaryProps {
  filteredInventory: InventoryItem[];
}

const InventorySummary: React.FC<InventorySummaryProps> = ({
  filteredInventory,
}) => {
  const totalSKUs = new Set(filteredInventory.map((item) => item.item_sku))
    .size;
  const totalQuantity = filteredInventory.reduce(
    (sum, item) => sum + item.qty,
    0
  );

  return (
    <div className="mb-4 p-4 bg-gray-100 rounded-md">
      <p className="text-lg font-semibold">
        Total Items: {totalSKUs.toLocaleString()} | Total Quantity:{" "}
        {totalQuantity.toLocaleString()}
      </p>
    </div>
  );
};

export default InventorySummary;
