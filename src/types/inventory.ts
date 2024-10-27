export interface Branch {
  id: number;
  isOnline: number;
  isSale: number;
  isVend: number;
  name: string;
}

export interface InventoryItem {
  branch_name: string;
  item_brand: string;
  item_name: string;
  item_sku: string;
  last_updated: string;
  qty: number;
}

export interface StockDate {
  date: string;
  id: number;
}

export interface Item {
  brand: string;
  category: string;
  item_group: string | null;
  name: string;
  sku: string;
}

export interface BranchesResponse {
  data: Branch[];
}

export interface InventoryResponse {
  data: InventoryItem[];
}

export interface StockDatesResponse {
  data: StockDate[];
}

export interface ItemsResponse {
  data: Item[];
}