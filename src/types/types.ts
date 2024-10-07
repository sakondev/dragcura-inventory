export interface Item {
  id: number;
  sku: string;
  name: string;
}

export interface Branch {
  id: number;
  name: string;
}

export interface InventoryItem {
  item_id: number;
  branch_id: number;
  stock: number;
}

export interface InventoryData {
  [date: string]: InventoryItem[];
}

export interface DatabaseResponse {
  items: Item[];
  branches: Branch[];
  inventory: InventoryData;
}