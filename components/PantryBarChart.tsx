"use client";

import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { generateHslaPalette } from "../lib/utils";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

/**
 * Represents a single pantry item with quantity
 */
export interface PantryItem {
  id: number;
  name: string;
  quantity: number;
}

/**
 * Props for PantryBarChart component
 */
interface PantryBarChartProps {
  pantryItems: PantryItem[];
}

/**
 * Bar chart showing quantities of pantry items
 */
export default function PantryBarChart({ pantryItems }: PantryBarChartProps) {
  // Generate labels from item names
  const labels = pantryItems.map((item) => item.name);

  // Generate dynamic HSLA background colors
  const backgroundColor = generateHslaPalette(pantryItems.length);

  // Chart data
  const data = {
    labels,
    datasets: [
      {
        label: "Quantity",
        data: pantryItems.map((item) => item.quantity),
        backgroundColor,
      },
    ],
  };

  // Chart options
  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Pantry Item Quantities",
      },
    },
  };

  return (
    <div className="my-6">
      <Bar data={data} options={options} />
    </div>
  );
}
