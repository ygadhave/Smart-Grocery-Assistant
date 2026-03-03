"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import dynamic from "next/dynamic";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Search, Upload, Trash2 } from "lucide-react";
import Tesseract from "tesseract.js";
import type { Receipt as ReceiptType } from "@/components/ReceiptsLineChart";

const ReceiptsLineChart = dynamic<{ receipts: ReceiptType[] }>(
  () => import("@/components/ReceiptsLineChart"),
  { ssr: false }
);
const ReceiptsStoreChart = dynamic<{ receipts: ReceiptType[] }>(
  () => import("@/components/ReceiptsStoreChart"),
  { ssr: false }
);

interface ReceiptItem {
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

interface Receipt {
  id: string;
  storeName: string;
  purchaseDate: string;
  totalAmount: string | number;
  items: ReceiptItem[];
}

export default function Receipts() {
  const [search, setSearch] = useState("");
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [storeName, setStoreName] = useState("");
  const [purchaseDate, setPurchaseDate] = useState("");
  const [isUploadOpen, setIsUploadOpen] = useState(false); // ✅ controlled dialog

  const fetchReceipts = async () => {
    const res = await fetch("/api/receipts", { credentials: "include" });
    if (res.ok) setReceipts(await res.json());
  };

  useEffect(() => {
    fetchReceipts();
  }, []);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    const worker = await Tesseract.createWorker();
    await worker.load();
    await worker.reinitialize("eng");

    const {
      data: { text },
    } = await worker.recognize(file);

    await worker.terminate();

    const lines: string[] = text
      .split("\n")
      .map((l: string) => l.trim())
      .filter(Boolean);

    // Only lines ending in price format
    const priceRegex = /\d+\.\d{2}$/;

    const items: ReceiptItem[] = lines
      .filter((line: string) => priceRegex.test(line))
      .map((line: string) => {
        const match = line.match(/(.*)\s+(\d+\.\d{2})$/);
        if (!match) return null;

        const name = match[1].trim();
        const price = parseFloat(match[2]);

        return {
          name,
          quantity: 1,
          unitPrice: price,
          totalPrice: price,
        };
      })
      .filter((item): item is ReceiptItem => !!item);

    // Strict TOTAL line match
    const totalLine = lines.find((line: string) =>
      /^TOTAL\s+\d+\.\d{2}$/i.test(line)
    );

    const totalAmount = totalLine
      ? parseFloat(totalLine.match(/(\d+\.\d{2})$/)![1])
      : items.reduce(
          (sum: number, item: ReceiptItem) => sum + item.totalPrice,
          0
        );

    const res = await fetch("/api/receipts", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        storeName,
        purchaseDate,
        totalAmount,
        items,
      }),
    });

    if (res.ok) {
      setReceipts(await res.json());
      setFile(null);
      setStoreName("");
      setPurchaseDate("");
      setIsUploadOpen(false); // ✅ auto close modal
    } else {
      console.error("Upload failed:", await res.text());
    }
  };

  const handleDeleteReceipt = async (id: string) => {
    const res = await fetch(`/api/receipts?id=${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (res.ok) {
      setReceipts((prev) => prev.filter((r) => r.id !== id));
    }
  };

  const filtered = receipts.filter((r) =>
    r.storeName.toLowerCase().includes(search.toLowerCase())
  );

  const chartReceipts: ReceiptType[] = filtered.map((r) => ({
    id: Number(r.id),
    store: r.storeName,
    date: r.purchaseDate,
    total: Number(r.totalAmount),
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <h1 className="text-2xl font-bold">Receipts</h1>

        <div className="flex gap-4 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-initial">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search receipts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* ✅ Controlled Dialog */}
          <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
            <DialogTrigger asChild>
              <Button>
                <Upload className="mr-2 h-4 w-4" />
                Upload Receipt
              </Button>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>Upload Receipt</DialogTitle>
              </DialogHeader>

              <form className="space-y-4" onSubmit={handleUpload}>
                <Input
                  type="file"
                  accept="image/*"
                  required
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                />
                <Input
                  placeholder="Store name"
                  required
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                />
                <Input
                  type="date"
                  required
                  value={purchaseDate}
                  onChange={(e) => setPurchaseDate(e.target.value)}
                />
                <Button type="submit" className="w-full">
                  Upload
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid gap-6">
        {filtered.map((receipt) => (
          <Card key={receipt.id} className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-semibold">{receipt.storeName}</h2>
                <p className="text-muted-foreground">
                  {receipt.purchaseDate}
                </p>
              </div>

              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-xl font-semibold">
                    ${Number(receipt.totalAmount).toFixed(2)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {receipt.items.length} items
                  </p>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteReceipt(receipt.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <h2 className="text-xl font-bold mt-8">Receipts Visualizations</h2>
      <ReceiptsLineChart receipts={chartReceipts} />
      <ReceiptsStoreChart receipts={chartReceipts} />
    </div>
  );
}