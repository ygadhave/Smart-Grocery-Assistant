"use client";

import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { generateHslaPalette } from "../lib/utils";

ChartJS.register(ArcElement, Tooltip, Legend);

/**
 * Represents a single pantry item with quantity
 */
export interface PantryItem {
  id: number;
  name: string;
  quantity: number;
}

/**
 * Props for PantryPieChart component
 */
interface PantryPieChartProps {
  pantryItems: PantryItem[];
}

/**
 * Pie chart showing distribution of pantry items
 */
export default function PantryPieChart({ pantryItems }: PantryPieChartProps) {
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
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "bottom" as const },
      title: {
        display: true,
        text: "Pantry Item Distribution",
      },
    },
  };

  return (
    <div className="my-6">
      <Pie data={data} options={options} />
    </div>
  );
}
