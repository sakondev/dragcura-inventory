import { useQuery } from "@tanstack/react-query";
import {
  fetchBranches,
  fetchInventory,
  fetchStockDates,
} from "@/api/inventoryApi";

export const useInventoryData = (
  selectedDate: string,
  selectedBranch: string
) => {
  const { data: branchesResponse } = useQuery({
    queryKey: ["branches"],
    queryFn: fetchBranches,
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  const { data: stockDatesResponse } = useQuery({
    queryKey: ["stockDates"],
    queryFn: fetchStockDates,
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  const { data: inventoryResponse } = useQuery({
    queryKey: ["inventory", selectedDate, selectedBranch],
    queryFn: () => fetchInventory(selectedDate, selectedBranch),
    enabled: !!selectedDate,
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    placeholderData: (previousData) => previousData,
  });

  const branches = branchesResponse?.data || [];
  const stockDates = stockDatesResponse?.data || [];
  const inventory = inventoryResponse?.data || [];

  return {
    branches,
    stockDates,
    inventory,
  };
};
