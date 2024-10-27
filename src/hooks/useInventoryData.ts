import { useQuery } from "@tanstack/react-query";
import { fetchBranches, fetchInventory, fetchStockDates } from "@/api/inventoryApi";

export const useInventoryData = (selectedDate: string, selectedBranch: string) => {
  const { data: branchesResponse, isLoading: isLoadingBranches } = useQuery({
    queryKey: ["branches"],
    queryFn: fetchBranches,
    staleTime: Infinity, // Branches data never goes stale
    gcTime: Infinity, // Keep branches data cached forever
    refetchOnWindowFocus: false, // Don't refetch when window regains focus
  });

  const { data: stockDatesResponse, isLoading: isLoadingDates } = useQuery({
    queryKey: ["stockDates"],
    queryFn: fetchStockDates,
    staleTime: 1000 * 60 * 60, // Consider data fresh for 1 hour
    gcTime: 1000 * 60 * 60 * 24, // Cache for 24 hours
    refetchOnWindowFocus: false,
  });

  const { data: inventoryResponse, isLoading: isLoadingInventory } = useQuery({
    queryKey: ["inventory", selectedDate, selectedBranch],
    queryFn: () => fetchInventory(selectedDate, selectedBranch),
    enabled: !!selectedDate,
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
    gcTime: 1000 * 60 * 30, // Cache for 30 minutes
    refetchOnWindowFocus: false,
    keepPreviousData: true, // Keep showing previous data while fetching new data
  });

  const branches = branchesResponse?.data || [];
  const stockDates = stockDatesResponse?.data || [];
  const inventory = inventoryResponse?.data || [];

  // Only show loading state when we're loading initial data or inventory
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