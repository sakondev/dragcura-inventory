import axios from "axios";
import type {
  SalesResponse,
  BranchesResponse,
  SaleDatesResponse,
} from "@/types/sales";

const BASE_URL = "https://drg-database.vercel.app";

export const fetchSaleDates = () =>
  axios.get<any, SaleDatesResponse>(`${BASE_URL}/sale_dates`);

export const fetchItems = (
  dateFrom: string,
  dateTo: string,
  branch?: string
) => {
  const params = {
    datefrom: dateFrom,
    dateto: dateTo,
    ...(branch && branch !== "all" && { branch }),
  };
  return axios.get<any, SalesResponse>(`${BASE_URL}/sales`, { params });
};

export const fetchBranches = () =>
  axios.get<any, BranchesResponse>(`${BASE_URL}/branches`);
