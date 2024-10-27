import axios from "axios";
import type { Branch, InventoryItem, StockDate, Item } from "@/types/inventory";

const BASE_URL = "https://drg-database.vercel.app";

export const fetchBranches = async () => {
  const response = await axios.get<Branch[]>(`${BASE_URL}/branches`);
  return { data: response.data };
};

export const fetchInventory = async (date?: string, branch?: string) => {
  if (!date) return { data: [] };

  const params = new URLSearchParams();
  params.append("date", date);
  if (branch && branch !== "all") {
    params.append("branch", branch.toLowerCase());
  }

  const response = await axios.get<InventoryItem[]>(
    `${BASE_URL}/inventory?${params}`
  );
  return { data: response.data };
};

export const fetchStockDates = async () => {
  const response = await axios.get<StockDate[]>(`${BASE_URL}/stock_dates`);
  return { data: response.data };
};

export const fetchItems = async () => {
  const response = await axios.get<Item[]>(`${BASE_URL}/items`);
  return { data: response.data };
};
