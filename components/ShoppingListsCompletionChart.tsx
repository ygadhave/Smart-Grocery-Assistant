"use client";

import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { generateHslaPalette } from "../lib/utils";

ChartJS.register(ArcElement, Tooltip, Legend);

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
 * Props for ShoppingListsCompletionChart component
 */
interface ShoppingListsCompletionChartProps {
  lists: ShoppingList[];
}

/**
 * Doughnut chart showing overall completion across all shopping lists
 */
export default function ShoppingListsCompletionChart({
  lists,
}: ShoppingListsCompletionChartProps) {
  // flatten all items across all lists
  const allItems = lists.flatMap((list) => list.items);

  const totalItems = allItems.length;
  const completedItems = allItems.filter((item) => item.checked).length;
  const remainingItems = totalItems - completedItems;

  // labels for the two segments
  const labels = ["Completed", "Remaining"];
  // generate two distinct colors
  const backgroundColor = generateHslaPalette(labels.length);

  const data = {
    labels,
    datasets: [
      {
        data: [completedItems, remainingItems],
        backgroundColor,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "bottom" as const },
      title: {
        display: true,
        text: "Overall Shopping List Completion",
      },
    },
  };

  return <Doughnut data={data} options={options} />;
}
