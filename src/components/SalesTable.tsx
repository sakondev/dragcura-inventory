import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TableItem {
  sku: string;
  name: string;
  qtySold: number;
  totalSale: number;
}

interface SalesTableProps {
  data?: TableItem[];
}

const SalesTable: React.FC<SalesTableProps> = ({ data = [] }) => {
  const [sortColumn, setSortColumn] = useState<keyof TableItem>("totalSale");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  if (!data || data.length === 0) {
    return <div>No data available</div>;
  }

  const totals = data.reduce(
    (acc, item) => ({
      qtySold: acc.qtySold + item.qtySold,
      totalSale: acc.totalSale + item.totalSale,
    }),
    { qtySold: 0, totalSale: 0 }
  );

  const sortedData = [...data].sort((a, b) => {
    if (a[sortColumn] < b[sortColumn]) return sortDirection === "asc" ? -1 : 1;
    if (a[sortColumn] > b[sortColumn]) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  const toggleSort = (column: keyof TableItem) => {
    if (column === sortColumn) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("desc");
    }
  };

  return (
    <div className="mt-8">
      <Table>
        <TableCaption>Product Sales List</TableCaption>
        <TableHeader className="bg-gray-200">
          <TableRow>
            <TableHead>
              <Button
                variant="ghost"
                onClick={() => toggleSort("sku")}
                className="font-bold text-gray-800"
              >
                SKU <ArrowUpDown className="ml-2 h-2 w-2" />
              </Button>
            </TableHead>
            <TableHead>
              <Button
                variant="ghost"
                onClick={() => toggleSort("name")}
                className="font-bold text-gray-800"
              >
                Product Name <ArrowUpDown className="ml-2 h-2 w-2" />
              </Button>
            </TableHead>
            <TableHead className="text-right">
              <Button
                variant="ghost"
                onClick={() => toggleSort("qtySold")}
                className="font-bold text-gray-800"
              >
                Qty Sold <ArrowUpDown className="ml-2 h-2 w-2" />
              </Button>
            </TableHead>
            <TableHead className="text-right">
              <Button
                variant="ghost"
                onClick={() => toggleSort("totalSale")}
                className="font-bold text-gray-800"
              >
                Total Sales <ArrowUpDown className="ml-2 h-2 w-2" />
              </Button>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow className="bg-blue-50 font-semibold">
            <TableCell colSpan={2}>Total</TableCell>
            <TableCell className="text-right">
              {totals.qtySold.toLocaleString()}
            </TableCell>
            <TableCell className="text-right">
              {totals.totalSale.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </TableCell>
          </TableRow>
          {sortedData.map((item) => (
            <TableRow key={item.sku}>
              <TableCell>{item.sku}</TableCell>
              <TableCell>{item.name}</TableCell>
              <TableCell className="text-right">
                {item.qtySold.toLocaleString()}
              </TableCell>
              <TableCell className="text-right">
                {item.totalSale.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default SalesTable;
