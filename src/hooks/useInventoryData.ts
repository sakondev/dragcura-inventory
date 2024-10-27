import { useQuery } from "@tanstack/react-query";
import { fetchBranches, fetchInventory, fetchStockDates } from "@/api/inventoryApi";

export const useInventoryData = (selectedDate: string, selectedBranch: string) => {
  const { data: branchesResponse, isLoading: isLoadingBranches } = useQuery({
    queryKey: ["branches"],
    queryFn: fetchBranches,
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnWindowFocus: false,
  });

  const { data: stockDatesResponse, isLoading: isLoadingDates } = useQuery({
    queryKey: ["stockDates"],
    queryFn: fetchStockDates,
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 60 * 24,
    refetchOnWindowFocus: false,
  });

  const { data: inventoryResponse, isLoading: isLoadingInventory } = useQuery({
    queryKey: ["inventory", selectedDate, selectedBranch],
    queryFn: () => fetchInventory(selectedDate, selectedBranch),
    enabled: !!selectedDate,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
    refetchOnWindowFocus: false,
    placeholderData: (previousData) => previousData,
  });

  const branches = branchesResponse?.data || [];
  const stockDates = stockDatesResponse?.data || [];
  const inventory = inventoryResponse?.data || [];

  const isLoading = (!branchesResponse && isLoadingBranches) || 
                    (!stockDatesResponse && isLoadingDates) || 
                    (!!selectedDate && isLoadingInventory && !inventoryResponse);

  return {
    branches,
    stockDates,
    inventory,
    isLoading,
  };
};