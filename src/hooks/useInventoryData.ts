import { useQuery } from "@tanstack/react-query";
import { fetchBranches, fetchInventory, fetchStockDates } from "@/api/inventoryApi";

export const useInventoryData = (selectedDate: string, selectedBranch: string) => {
  const { data: branchesResponse, isLoading: isLoadingBranches } = useQuery({
    queryKey: ["branches"],
    queryFn: fetchBranches,
    staleTime: Infinity, // Branches rarely change
  });

  const { data: stockDatesResponse, isLoading: isLoadingDates } = useQuery({
    queryKey: ["stockDates"],
    queryFn: fetchStockDates,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  const { data: inventoryResponse, isLoading: isLoadingInventory } = useQuery({
    queryKey: ["inventory", selectedDate, selectedBranch],
    queryFn: () => fetchInventory(selectedDate, selectedBranch),
    enabled: !!selectedDate,
  });

  const branches = branchesResponse?.data || [];
  const stockDates = stockDatesResponse?.data || [];
  const inventory = inventoryResponse?.data || [];

  return {
    branches,
    stockDates,
    inventory,
    isLoading: isLoadingBranches || isLoadingDates || (!!selectedDate && isLoadingInventory),
  };
};