import { useQuery } from "@tanstack/react-query";
import { fetchBranches, fetchInventory, fetchStockDates } from "@/api/inventoryApi";

export const useInventoryData = (selectedDate: string, selectedBranch: string) => {
  const { data: branches = [], isLoading: isLoadingBranches } = useQuery({
    queryKey: ["branches"],
    queryFn: fetchBranches,
  });

  const { data: stockDates = [], isLoading: isLoadingDates } = useQuery({
    queryKey: ["stockDates"],
    queryFn: fetchStockDates,
  });

  const { data: inventory = [], isLoading: isLoadingInventory } = useQuery({
    queryKey: ["inventory", selectedDate, selectedBranch],
    queryFn: () => fetchInventory(selectedDate, selectedBranch),
    enabled: !!selectedDate,
  });

  const isLoading = isLoadingBranches || isLoadingDates || isLoadingInventory;

  return {
    branches,
    stockDates,
    inventory,
    isLoading,
  };
};