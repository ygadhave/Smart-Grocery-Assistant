"use client";

import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { generatePastelPalette } from "../lib/utils";   // ← updated path

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export interface Receipt {
  id: number;
  store: string;
  date: string;   // ISO yyyy-MM-dd
  total: number;
}

interface ReceiptsLineChartProps {
  receipts: Receipt[];
}

export default function ReceiptsLineChart({ receipts }: ReceiptsLineChartProps) {
  // sort by date for the x–axis
  const sorted = [...receipts].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const labels = sorted.map((r) => r.date);

  // pick one pastel color for the line
  const [lineColor] = generatePastelPalette(1);

  const data = {
    labels,
    datasets: [
      {
        label: "Total Spent",
        data: sorted.map((r) => r.total),
        borderColor: lineColor,
        backgroundColor: lineColor.replace(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*[\d.]+\)/,
          (_match, r, g, b) => `rgba(${r}, ${g}, ${b}, 0.2)`
        ),
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Spending Over Time",
      },
    },
  };

  return <Line data={data} options={options} />;
}
