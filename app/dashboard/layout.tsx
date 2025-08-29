"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  ShoppingCart,
  Receipt,
  Package,
  Menu,
  X,
  LogOut,
  Sun,
  Moon,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { useToast } from "@/hooks/use-toast";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const { toast } = useToast();

  const navigation = [
    { name: "Pantry", href: "/dashboard", icon: Package },
    { name: "Shopping Lists", href: "/dashboard/shopping-lists", icon: ShoppingCart },
    { name: "Receipts", href: "/dashboard/receipts", icon: Receipt },
  ];

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",   // make sure browser sees the Set-Cookie header
      });
      if (!res.ok) throw new Error("Logout failed");

      // Clear out any stale token you might have stored
      localStorage.removeItem("token");

      toast({
        title: "Logged out",
        description: "You have been successfully logged out",
      });
      router.push("/");
    } catch (err) {
      console.error(err);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not log you out. Please try again.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile sidebar backdrop */}
      <div
        className={cn(
          "fixed inset-0 z-50 bg-background/80 backdrop-blur-sm lg:hidden",
          sidebarOpen ? "block" : "hidden"
        )}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Mobile sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-card transform transition-transform duration-200 ease-in-out lg:hidden",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-16 items-center justify-between px-4">
          <h1 className="text-lg font-semibold">Smart Grocery</h1>
          <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)}>
            <X className="h-6 w-6" />
          </Button>
        </div>
        <nav className="space-y-1 px-2">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center px-4 py-2 text-sm rounded-md",
                pathname === item.href
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-accent"
              )}
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.name}
            </Link>
          ))}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t space-y-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>
          <Button variant="outline" className="w-full" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow bg-card border-r">
          <div className="flex h-16 items-center px-4">
            <h1 className="text-lg font-semibold">Smart Grocery</h1>
          </div>
          <nav className="flex-1 space-y-1 px-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center px-4 py-2 text-sm rounded-md",
                  pathname === item.href
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-accent"
                )}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </Link>
            ))}
          </nav>
          <div className="p-4 border-t space-y-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
            <Button variant="outline" className="w-full" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile top bar */}
      <div className="lg:hidden">
        <div className="flex h-16 items-center gap-x-4 border-b px-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </Button>
          <h1 className="text-lg font-semibold">Smart Grocery</h1>
        </div>
      </div>

      {/* Main content */}
      <main className="lg:pl-64">
        <div className="px-4 py-6 sm:px-6 lg:px-8">{children}</div>
      </main>
    </div>
  );
}
