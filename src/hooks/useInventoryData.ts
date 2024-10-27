import { useQuery } from "@tanstack/react-query";
import { fetchBranches, fetchInventory, fetchStockDates } from "@/api/inventoryApi";
import type { Branch, InventoryItem, StockDate } from "@/types/inventory";

export const useInventoryData = (selectedDate: string, selectedBranch: string) => {
  const { data: branchesResponse, isLoading: isLoadingBranches } = useQuery({
    queryKey: ["branches"],
    queryFn: fetchBranches,
  });

  const { data: stockDatesResponse, isLoading: isLoadingDates } = useQuery({
    queryKey: ["stockDates"],
    queryFn: fetchStockDates,
  });

  const { data: inventoryResponse, isLoading: isLoadingInventory } = useQuery({
    queryKey: ["inventory", selectedDate, selectedBranch],
    queryFn: () => fetchInventory(selectedDate, selectedBranch),
    enabled: !!selectedDate,
  });

  const branches = branchesResponse?.data.filter(branch => branch.id >= 1 && branch.id <= 12) || [];
  const stockDates = stockDatesResponse?.data || [];
  const inventory = inventoryResponse?.data || [];

  return {
    branches,
    stockDates,
    inventory,
    isLoading: isLoadingBranches || isLoadingDates || isLoadingInventory,
  };
};