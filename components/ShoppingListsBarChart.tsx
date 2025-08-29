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

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

/**
 * Represents a single shopping item
 */
export interface ShoppingItem {
  id: number;
  name: string;
  checked: boolean;
}

/**
 * Represents a shopping list of items
 */
export interface ShoppingList {
  id: number;
  name: string;
  items: ShoppingItem[];
}

/**
 * Props for ShoppingListsBarChart component
 */
interface ShoppingListsBarChartProps {
  lists: ShoppingList[];
}

/**
 * Bar chart showing total items per shopping list
 */
export default function ShoppingListsBarChart({
  lists,
}: ShoppingListsBarChartProps) {
  // Extract list names
  const labels = lists.map((list) => list.name);

  // Generate dynamic colors
  const backgroundColor = generateHslaPalette(labels.length);

  // Build chart data
  const data = {
    labels,
    datasets: [
      {
        label: "Total Items",
        data: lists.map((list) => list.items.length),
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
        text: "Items per Shopping List",
      },
    },
  };

  return <Bar data={data} options={options} />;
}
