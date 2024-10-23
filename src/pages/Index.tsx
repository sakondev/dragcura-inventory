import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { DatabaseResponse, Branch, InventoryItem, Item } from "@/types/types";
import InventoryTable from "@/components/InventoryTable";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
<<<<<<< HEAD
import * as XLSX from "xlsx";
import NavHeader from "@/components/NavHeader";
=======
import * as XLSX from 'xlsx';
import { Loader } from 'lucide-react';
>>>>>>> 04aecc59423aea1955e7378745862edab9cb3af4

const fetchInventoryData = async (): Promise<DatabaseResponse> => {
  const response = await fetch(
    "https://sakondev.github.io/drg-inventory/inventory_database2.json"
  );
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

const Index = () => {
  const { data, isLoading, error } = useQuery<DatabaseResponse>({
    queryKey: ["inventoryData"],
    queryFn: fetchInventoryData,
  });

  const [selectedDate, setSelectedDate] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedBranch, setSelectedBranch] = useState<string>("all");

  useEffect(() => {
    if (data) {
      const dates = Object.keys(data.inventory).sort(
        (a, b) => new Date(b).getTime() - new Date(a).getTime()
      );
      setSelectedDate(dates[0].substring(0, 10));
    }
  }, [data]);

  const handleBranchChange = (value: string) => {
    setSelectedBranch(value);
  };

  const handleCopyTable = () => {
    const table = document.querySelector("table");
    if (table) {
      const rows = Array.from(table.querySelectorAll("tr"));
      const csvContent = rows
        .map((row) =>
          Array.from(row.querySelectorAll("th, td"))
            .map((cell) => cell.textContent)
            .join("\t")
        )
        .join("\n");

      navigator.clipboard
        .writeText(csvContent)
        .then(() => {
          toast.success(`Copied ${rows.length - 1} rows to clipboard`);
        })
        .catch((err) => {
          toast.error("Failed to copy table");
          console.error("Failed to copy table: ", err);
        });
    }
  };

  const handleExportExcel = () => {
    const table = document.querySelector("table");
    if (table) {
      const wb = XLSX.utils.table_to_book(table);
      const fileName = `DragCura_Inventory_${selectedDate}.xlsx`;
      XLSX.writeFile(wb, fileName);
      toast.success(`Exported to ${fileName}`);
    } else {
      toast.error("Failed to export table");
    }
  };

  if (isLoading) return (
    <div className="flex justify-center items-center h-screen">
      <Loader className="w-12 h-12 animate-spin text-primary" />
    </div>
  );
  if (error) return <div className="text-center p-4 text-red-500">เกิดข้อผิดพลาด: {(error as Error).message}</div>;
  if (!data) return <div className="text-center p-4">ไม่พบข้อมูล</div>;

  console.log("Data loaded:", data); // เพิ่ม log เพื่อตรวจสอบข้อมูล

  const dates = Object.keys(data.inventory).sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime()
  );
  const minDate = dates[dates.length - 1].substring(0, 10);
  const maxDate = dates[0].substring(0, 10);

  const filterItems = (items: Item[], branch: Branch | null): Item[] => {
    let filteredItems = items.filter(
      (item) =>
        item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (branch && branch.onlySKUs) {
      filteredItems = filteredItems.filter((item) =>
        branch.onlySKUs!.includes(item.sku)
      );
    }

    return filteredItems;
  };

  const selectedBranchObject =
    selectedBranch === "all"
      ? null
      : data.branches.find((b) => b.id.toString() === selectedBranch);
  const filteredItems = filterItems(data.items, selectedBranchObject);

  const calculateTotalQuantity = (items: typeof filteredItems): number => {
    const dateKey = selectedDate.substring(0, 10);
    const stockData = Object.keys(data.inventory).reduce((acc, key) => {
      if (key.startsWith(dateKey)) {
        return data.inventory[key];
      }
      return acc;
    }, [] as InventoryItem[]);

    return items.reduce((total, item) => {
      const itemStocks = stockData.filter((stock) => stock.item_id === item.id);
      const itemTotal = itemStocks.reduce((itemSum, stock) => {
        if (
          selectedBranch === "all" ||
          stock.branch_id.toString() === selectedBranch
        ) {
          return itemSum + stock.stock;
        }
        return itemSum;
      }, 0);
      return total + itemTotal;
    }, 0);
  };

  const totalItems = filteredItems.length;
  const totalQuantity = calculateTotalQuantity(filteredItems);

  return (
    <div>
      <NavHeader />
      <div className="container mx-auto p-4">
        <div className="mb-4 flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <label htmlFor="dateFilter" className="block mb-2">
              Select Date:
            </label>
            <Input
              type="date"
              id="dateFilter"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={minDate}
              max={maxDate}
              className="w-full"
            />
          </div>
          <div className="flex-1 min-w-[200px]">
            <label htmlFor="searchFilter" className="block mb-2">
              Search:
            </label>
            <Input
              type="text"
              id="searchFilter"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by SKU or Name"
              className="w-full"
            />
          </div>
          <div className="flex-1 min-w-[200px]">
            <label htmlFor="branchFilter" className="block mb-2">
              Branch:
            </label>
            <Select onValueChange={handleBranchChange} value={selectedBranch}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select branch" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Branches</SelectItem>
                {data.branches.map((branch: Branch) => (
                  <SelectItem key={branch.id} value={branch.id.toString()}>
                    {branch.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="mb-4 p-4 bg-gray-100 rounded-md">
          <p className="text-lg font-semibold">
            Total Items: {totalItems} | Total Quantity: {totalQuantity}
          </p>
        </div>
        <div className="mb-4 flex justify-start space-x-2">
          <Button onClick={handleCopyTable}>COPY</Button>
          <Button onClick={handleExportExcel}>EXCEL</Button>
        </div>
        {filteredItems.length > 0 ? (
          <InventoryTable
            items={filteredItems}
            branches={data.branches}
            inventoryData={data.inventory}
            selectedDate={selectedDate}
            searchTerm={searchTerm}
            selectedBranch={selectedBranch}
          />
        ) : (
          <div className="text-center p-4">
            ไม่พบรายการที่ตรงกับเงื่อนไขการค้นหา
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
