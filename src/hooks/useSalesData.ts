import { useQuery } from "@tanstack/react-query";
import { fetchItems, fetchBranches, fetchSaleDates } from "@/api/salesApi";
import { DateRange } from "react-day-picker";
import dayjs from "dayjs";

export const useSalesData = (dateRange: DateRange | undefined, selectedBranch: string) => {
  const { data: branches } = useQuery({
    queryKey: ["branches"],
    queryFn: fetchBranches,
    staleTime: Infinity
  });

  const { data: saleDates } = useQuery({
    queryKey: ["saleDates"],
    queryFn: fetchSaleDates,
    staleTime: Infinity
  });

  const { data: items, error } = useQuery({
    queryKey: ["items", dateRange?.from, dateRange?.to, selectedBranch],
    queryFn: () => {
      if (!dateRange?.from || !dateRange?.to) return Promise.resolve({ data: [] });
      return fetchItems(
        dayjs(dateRange.from).format('YYYY-MM-DD'),
        dayjs(dateRange.to).format('YYYY-MM-DD'),
        selectedBranch
      );
    },
    enabled: !!dateRange?.from && !!dateRange?.to,
    staleTime: Infinity
  });

  return {
    branches,
    items,
    saleDates,
    error
  };
};