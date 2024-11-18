import React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

interface LostItem {
  item_sku: string;
  branch_id: number;
  start_date: string;
  end_date: string;
  consecutive_days: number;
}

interface QuantityCellProps {
  qty: number;
  sku: string;
  branchId?: number;
}

const QuantityCell: React.FC<QuantityCellProps> = ({ qty, sku, branchId }) => {
  const { data: lostItems } = useQuery({
    queryKey: ["lostItems"],
    queryFn: async () => {
      const response = await axios.get<LostItem[]>(
        "https://drg-database.vercel.app/lostitem"
      );
      return response.data;
    },
  });

  const getLostDays = () => {
    if (!lostItems || !branchId) return 0;
    const lostItem = lostItems.find(
      (item) => item.item_sku === sku && item.branch_id === branchId
    );
    return lostItem?.consecutive_days || 0;
  };

  const lostDays = getLostDays();

  if (qty === 0) {
    return (
      <span>
        {qty}{" "}
        {lostDays > 0 && <span className=" text-red-500">({lostDays})</span>}
      </span>
    );
  }

  return <span>{qty}</span>;
};

export default QuantityCell;
