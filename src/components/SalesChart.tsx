import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

interface SalesChartProps {
  data?: {
    name: string;
    value: number;
  }[];
}

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884D8",
  "#82CA9D",
  "#E57373",
  "#64B5F6",
  "#FFD54F",
  "#4DB6AC",
];

const SalesChart: React.FC<SalesChartProps> = ({ data = [] }) => {
  if (data.length === 0) {
    return <div>No data available</div>;
  }

  return (
    <div className="w-full h-96">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={true}
            outerRadius={100}
            dataKey="value"
            label={({ name, percent }) =>
              `${name} ${(percent * 100).toFixed(0)}%`
            }
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip
            formatter={(value, name) => {
              const numericValue = Number(value);
              return [
                numericValue.toLocaleString(undefined, {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 2,
                }),
                name,
              ];
            }}
            labelFormatter={(label) => label}
          />
          <Legend wrapperStyle={{ fontSize: "10px" }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SalesChart;
