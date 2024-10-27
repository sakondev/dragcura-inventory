import axios from "axios";
import type {
  BranchesResponse,
  InventoryResponse,
  StockDatesResponse,
} from "@/types/inventory";

const BASE_URL = "http://127.0.0.1:5052";

export const fetchBranches = async () => {
  const response = await axios.get<BranchesResponse>(`${BASE_URL}/branches`);
  return response.data;
};

export const fetchInventory = async (date: string, branch?: string) => {
  const params = new URLSearchParams();
  if (date) {
    params.append('date', date);
  }
  if (branch && branch !== 'all') {
    params.append('branch', branch);
  }
  const response = await axios.get<InventoryResponse>(`${BASE_URL}/inventory?${params}`);
  return response.data;
};

export const fetchStockDates = async () => {
  const response = await axios.get<StockDatesResponse>(`${BASE_URL}/stock_dates`);
  return response.data;
};