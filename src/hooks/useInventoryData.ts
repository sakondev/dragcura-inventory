import { useQuery } from "@tanstack/react-query";
import { fetchItems, fetchBranches, fetchStockDates } from "@/api/inventoryApi";
import { Branch, InventoryItem, StockDate } from "@/types/inventory";

export const useInventoryData = (selectedDate: string, selectedBranch: string) => {
  const { data: branches = [], isLoading: isLoadingBranches } = useQuery<Branch[]>({
    queryKey: ["branches"],
    queryFn: () => fetchBranches().then(response => response.data),
  });

  const { data: stockDates = [], isLoading: isLoadingDates } = useQuery<StockDate[]>({
    queryKey: ["stockDates"],
    queryFn: () => fetchStockDates().then(response => response.data),
  });

  const { data: inventory = [], isLoading: isLoadingInventory } = useQuery<InventoryItem[]>({
    queryKey: ["inventory", selectedDate, selectedBranch],
    queryFn: () => fetchInventory(selectedDate, selectedBranch).then(response => response.data),
    enabled: !!selectedDate,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  return {
    branches,
    stockDates,
    inventory,
    isLoading: isLoadingBranches || isLoadingDates || isLoadingInventory
  };
};