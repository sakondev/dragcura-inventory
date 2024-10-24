import { SaleItem, Branch } from "@/types/sales";

export const filterSalesByType = (
  sales: SaleItem[],
  branches: Branch[],
  type: "all" | "offline" | "online"
): SaleItem[] => {
  if (type === "all") return sales;
  
  const isOnlineValue = type === "online" ? 1 : 0;
  const filteredBranches = branches
    .filter(branch => Number(branch.isOnline) === isOnlineValue)
    .map(b => b.name);
  
  return sales.filter(sale => filteredBranches.includes(sale.branch_name));
};