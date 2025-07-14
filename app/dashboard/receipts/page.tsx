"use client";

import { useState, useEffect, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import dynamic from "next/dynamic";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Search, Upload, Trash2 } from "lucide-react";
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
  totalAmount: number;
  items: ReceiptItem[];
}

export default function Receipts() {
  const [search, setSearch] = useState("");
  const [receipts, setReceipts] = useState<Receipt[]>([]);

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/receipts", { credentials: "include" });
      if (res.ok) {
        setReceipts(await res.json());
      } else {
        console.error("Failed to load receipts");
      }
    })();
  }, []);

  const handleDeleteReceipt = async (id: string) => {
    const res = await fetch(`/api/receipts?id=${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (res.ok) {
      setReceipts((prev) => prev.filter((r) => r.id !== id));
    } else {
      console.error("Failed to delete receipt");
    }
  };

  const filtered = receipts.filter((r) =>
    r.storeName.toLowerCase().includes(search.toLowerCase())
  );

  const chartReceipts: ReceiptType[] = filtered.map((r) => ({
    id: Number(r.id),
    store: r.storeName,
    date: r.purchaseDate,
    total: r.totalAmount,
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <h1 className="text-2xl font-bold">Receipts</h1>
        <div className="flex gap-4 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-initial">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search receipts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Dialog>
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
              <form
                className="space-y-4"
                onSubmit={async (e: FormEvent<HTMLFormElement>) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  const res = await fetch("/api/receipts", {
                    method: "POST",
                    credentials: "include",
                    body: formData,
                  });
                  if (res.ok) {
                    setReceipts(await res.json());
                  } else {
                    console.error("Failed to upload receipt");
                  }
                }}
              >
                <Input type="file" name="file" accept="image/*" required />
                <Input name="storeName" placeholder="Store name" required />
                <Input name="purchaseDate" type="date" required />
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
                <p className="text-muted-foreground">{receipt.purchaseDate}</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-xl font-semibold">
                    ${receipt.totalAmount.toFixed(2)}
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
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {receipt.items.map((item, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell className="text-right">
                      ${item.totalPrice.toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        ))}
      </div>

      <h2 className="text-xl font-bold mt-8">Receipts Visualizations</h2>
      <ReceiptsLineChart receipts={chartReceipts} />
      <ReceiptsStoreChart receipts={chartReceipts} />
    </div>
  );
}


