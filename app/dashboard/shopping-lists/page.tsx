"use client";

import React, { useState, useEffect, FormEvent } from "react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Search, Trash2 } from "lucide-react";
import type { ShoppingList as ShoppingListType } from "@/components/ShoppingListsBarChart";

const ShoppingListsBarChart = dynamic<{ lists: ShoppingListType[] }>(
  () => import("@/components/ShoppingListsBarChart"),
  { ssr: false }
);
const ShoppingListsCompletionChart = dynamic<{ lists: ShoppingListType[] }>(
  () => import("@/components/ShoppingListsCompletionChart"),
  { ssr: false }
);

interface ShoppingListItem {
  id: string;
  name: string;
  quantity: number;
  unit?: string;
  isChecked: boolean;
}
interface ShoppingList {
  id: string;
  name: string;
  createdAt?: string;
  items: ShoppingListItem[];
}

export default function ShoppingLists() {
  const [search, setSearch] = useState("");
  const [lists, setLists] = useState<ShoppingList[]>([]);
  const [newListName, setNewListName] = useState("");
  const [currentListId, setCurrentListId] = useState<string | null>(null);
  const [newItemName, setNewItemName] = useState("");
  const [newItemQuantity, setNewItemQuantity] = useState(1);
  const [newItemUnit, setNewItemUnit] = useState("");

  const fetchLists = async () => {
    const res = await fetch("/api/shopping-lists", { credentials: "include" });
    const data = await res.json();
    if (res.ok) setLists(data);
    else console.error("Failed to fetch lists", data);
  };

  useEffect(() => {
    fetchLists();
  }, []);

  const handleCreateList = async (e: FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/shopping-lists", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newListName }),
    });
    if (res.ok) {
      setNewListName("");
      fetchLists();
    } else {
      console.error("Failed to create list");
    }
  };

  const handleDeleteList = async (listId: string) => {
    const res = await fetch(`/api/shopping-lists?id=${listId}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (res.ok) fetchLists();
    else console.error("Failed to delete list");
  };

  const handleAddItem = async (e: FormEvent) => {
    e.preventDefault();
    if (!currentListId) return;
    const res = await fetch("/api/shopping-lists/items", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        listId: currentListId,
        name: newItemName,
        quantity: newItemQuantity,
        unit: newItemUnit || null,
      }),
    });
    if (res.ok) {
      setNewItemName("");
      setNewItemQuantity(1);
      setNewItemUnit("");
      fetchLists();
    } else {
      console.error("Failed to add item");
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    const res = await fetch(`/api/shopping-lists/items?id=${itemId}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (res.ok) fetchLists();
    else console.error("Failed to delete item");
  };

  const filteredLists = lists.filter((list) =>
    list.name.toLowerCase().includes(search.toLowerCase())
  );

  const chartLists: ShoppingListType[] = filteredLists.map((list) => ({
    id: Number(list.id),
    name: list.name,
    items: list.items.map((item) => ({
      id: Number(item.id),
      name: item.name,
      checked: item.isChecked,
    })),
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <h1 className="text-2xl font-bold">Shopping Lists</h1>
        <div className="flex gap-4 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-initial">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search lists..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New List
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Shopping List</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreateList} className="space-y-4">
                <Input
                  placeholder="List name"
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                  required
                />
                <Button type="submit" className="w-full">
                  Create List
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {filteredLists.map((list) => (
          <Card key={list.id} className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">{list.name}</h2>
              <div className="flex items-center space-x-2">
                <Dialog
                  onOpenChange={(open) => {
                    if (open) setCurrentListId(list.id);
                  }}
                >
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Item
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Item to {list.name}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleAddItem} className="space-y-4">
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
                      <Button type="submit" className="w-full">
                        Add Item
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteList(list.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              {list.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center space-x-2 p-2 rounded hover:bg-accent"
                >
                  <Checkbox checked={item.isChecked} />
                  <span
                    className={
                      item.isChecked ? "line-through text-muted-foreground" : ""
                    }
                  >
                    {item.name} ({item.quantity} {item.unit})
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteItem(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>

      <h2 className="text-xl font-bold mt-8">Shopping Lists Visualizations</h2>
      <ShoppingListsBarChart lists={chartLists} />
      <ShoppingListsCompletionChart lists={chartLists} />
    </div>
  );
}
