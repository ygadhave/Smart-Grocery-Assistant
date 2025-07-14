"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
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
import { Plus, Search, Pencil, Trash2 } from "lucide-react";
import type { PantryItem as PantryItemType } from "@/components/PantryBarChart";

const PantryBarChart = dynamic<{ pantryItems: PantryItemType[] }>(
  () => import("@/components/PantryBarChart"),
  { ssr: false }
);
const PantryPieChart = dynamic<{ pantryItems: PantryItemType[] }>(
  () => import("@/components/PantryPieChart"),
  { ssr: false }
);

interface RawPantryItem {
  id: string;
  name: string;
  quantity: number;
  unit?: string;
  expiryDate?: string;
}

export default function Dashboard() {
  const [search, setSearch] = useState("");
  const [pantryItems, setPantryItems] = useState<RawPantryItem[]>([]);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newItemName, setNewItemName] = useState("");
  const [newItemQuantity, setNewItemQuantity] = useState(1);
  const [newItemUnit, setNewItemUnit] = useState("");
  const [newItemExpiry, setNewItemExpiry] = useState("");

  const [editingItem, setEditingItem] = useState<RawPantryItem | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  useEffect(() => {
    fetchPantry();
  }, []);

  async function fetchPantry() {
    const res = await fetch("/api/pantry", { credentials: "include" });
    if (res.ok) {
      setPantryItems(await res.json());
    } else {
      console.error("Failed to load pantry items");
    }
  }

  async function handleAddSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/pantry", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: newItemName,
        quantity: newItemQuantity,
        unit: newItemUnit || null,
        expiryDate: newItemExpiry || null,
      }),
    });
    if (res.ok) {
      setNewItemName("");
      setNewItemQuantity(1);
      setNewItemUnit("");
      setNewItemExpiry("");
      setIsAddDialogOpen(false);
      fetchPantry();
    } else {
      console.error("Failed to add item");
    }
  }

  async function handleDelete(id: string) {
    const res = await fetch(`/api/pantry?id=${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (res.ok) {
      setPantryItems((prev) => prev.filter((item) => item.id !== id));
    } else {
      console.error("Failed to delete item");
    }
  }

  function handleEdit(item: RawPantryItem) {
    setEditingItem(item);
    setIsEditDialogOpen(true);
  }

  async function handleEditSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!editingItem) return;
    const res = await fetch("/api/pantry", {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editingItem),
    });
    if (res.ok) {
      setIsEditDialogOpen(false);
      setEditingItem(null);
      fetchPantry();
    } else {
      console.error("Failed to update item");
    }
  }

  const filtered = pantryItems.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  // Map to the type your charts expect
  const chartPantryItems: PantryItemType[] = filtered.map((item) => ({
    id: Number(item.id),
    name: item.name,
    quantity: item.quantity,
  }));

  return (
    <div className="space-y-6">
      {/* Header + Add Button */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <h1 className="text-2xl font-bold">Pantry Items</h1>
        <div className="flex gap-4 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-initial">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search items..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Item
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Pantry Item</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddSubmit} className="space-y-4">
                <Input
                  placeholder="Item name"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  required
                />
                <div className="flex gap-4">
                  <Input
                    type="number"
                    placeholder="Quantity"
                    value={newItemQuantity}
                    onChange={(e) =>
                      setNewItemQuantity(Number(e.target.value))
                    }
                    required
                  />
                  <Input
                    placeholder="Unit"
                    value={newItemUnit}
                    onChange={(e) => setNewItemUnit(e.target.value)}
                  />
                </div>
                <Input
                  type="date"
                  value={newItemExpiry}
                  onChange={(e) => setNewItemExpiry(e.target.value)}
                />
                <Button type="submit" className="w-full">
                  Add Item
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Pantry Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Unit</TableHead>
              <TableHead>Expiry Date</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>{item.unit}</TableCell>
                <TableCell>{item.expiryDate}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(item)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Pantry Item</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <Input
              placeholder="Item name"
              value={editingItem?.name || ""}
              onChange={(e) =>
                setEditingItem((prev) =>
                  prev ? { ...prev, name: e.target.value } : null
                )
              }
              required
            />
            <div className="flex gap-4">
              <Input
                type="number"
                placeholder="Quantity"
                value={editingItem?.quantity || 1}
                onChange={(e) =>
                  setEditingItem((prev) =>
                    prev
                      ? { ...prev, quantity: parseInt(e.target.value, 10) }
                      : null
                  )
                }
                required
              />
              <Input
                placeholder="Unit"
                value={editingItem?.unit || ""}
                onChange={(e) =>
                  setEditingItem((prev) =>
                    prev ? { ...prev, unit: e.target.value } : null
                  )
                }
              />
            </div>
            <Input
              type="date"
              value={editingItem?.expiryDate || ""}
              onChange={(e) =>
                setEditingItem((prev) =>
                  prev ? { ...prev, expiryDate: e.target.value } : null
                )
              }
            />
            <Button type="submit" className="w-full">
              Save Changes
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Visualizations */}
      <h2 className="text-xl font-bold mt-8">Pantry Visualizations</h2>
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-4">
          <PantryBarChart pantryItems={chartPantryItems} />
        </Card>
        <Card className="p-4">
          <PantryPieChart pantryItems={chartPantryItems} />
        </Card>
      </div>
    </div>
  );
}
