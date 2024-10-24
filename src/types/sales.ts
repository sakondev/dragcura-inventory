export interface SalesResponse {
  data: SaleItem[];
}

export interface BranchesResponse {
  data: Branch[];
}

export interface SaleDatesResponse {
  data: SaleDate[];
}

export interface SaleItem {
  id: number;
  branch_name: string;
  item_sku: string;
  item_name: string;
  qty: number;
  net_sales: number;
  sale_date: string;
}

export interface Branch {
  id: number;
  name: string;
  isOnline: number;
  isSale: number;
}

export interface SaleDate {
  date: string;
}
