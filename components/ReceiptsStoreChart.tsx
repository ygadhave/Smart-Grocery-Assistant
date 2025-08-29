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
import { generatePastelPalette } from "@/lib/utils";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export interface Receipt {
  id: number;
  store: string;
  date: string;
  total: number;
}

interface ReceiptsStoreChartProps {
  receipts: Receipt[];
}

export default function ReceiptsStoreChart({
  receipts,
}: ReceiptsStoreChartProps) {
  const storeTotals: Record<string, number> = {};
  receipts.forEach((r) => {
    storeTotals[r.store] = (storeTotals[r.store] || 0) + r.total;
  });

  const labels = Object.keys(storeTotals);
  const backgroundColor = generatePastelPalette(labels.length);

  const data = {
    labels,
    datasets: [
      {
        label: "Total Spent",
        data: labels.map((store) => storeTotals[store]),
        backgroundColor,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Total Spend per Store",
      },
    },
  };

  return <Bar data={data} options={options} />;
}
