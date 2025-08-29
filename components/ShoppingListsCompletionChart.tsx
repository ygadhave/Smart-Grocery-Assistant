"use client";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { generateHslaPalette } from "@/lib/utils";
ChartJS.register(ArcElement, Tooltip, Legend);

export interface ShoppingItem { id: number; name: string; checked: boolean }
export interface ShoppingList { id: number; name: string; items: ShoppingItem[] }
interface ShoppingListsCompletionChartProps { lists: ShoppingList[] }

export default function ShoppingListsCompletionChart({ lists }: ShoppingListsCompletionChartProps) {
  const allItems = lists.flatMap((list) => list.items);
  const totalItems = allItems.length;
  const completedItems = allItems.filter((item) => item.checked).length;
  const remainingItems = totalItems - completedItems;
  const labels = ["Completed", "Remaining"];
  const backgroundColor = generateHslaPalette(labels.length);
  const data = { labels, datasets: [{ data: [completedItems, remainingItems], backgroundColor }] };
  const options = {
    responsive: true,
    plugins: {
      legend: { position: "bottom" as const },
      title: { display: true, text: "Overall Shopping List Completion" },
    },
  };
  return <Doughnut data={data} options={options} />;
}

