"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ShoppingCart, UserCircle2, UserPlus, Users } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  async function handleGuest() {
    try {
      const res = await fetch("/api/auth/guest");
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("token", data.token);
        router.push("/dashboard");
      } else {
        console.error("Guest sign in failed");
      }
    } catch (err) {
      console.error("Error during guest sign in:", err);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-6xl">
            Smart Grocery Assistant
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
            Manage your groceries, track receipts, and keep your pantry organized with our intelligent assistant.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex flex-col items-center text-center space-y-4">
              <UserPlus className="h-12 w-12 text-primary" />
              <h2 className="text-2xl font-semibold">Sign Up</h2>
              <p className="text-muted-foreground">
                Create an account to save your lists and receipts.
              </p>
              <Button className="w-full" onClick={() => router.push("/auth/signup")}>
                Sign Up
              </Button>
            </div>
          </Card>
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex flex-col items-center text-center space-y-4">
              <UserCircle2 className="h-12 w-12 text-primary" />
              <h2 className="text-2xl font-semibold">Sign In</h2>
              <p className="text-muted-foreground">
                Access your personalized dashboard across devices.
              </p>
              <Button className="w-full" onClick={() => router.push("/auth/signin")}>
                Sign In
              </Button>
            </div>
          </Card>
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex flex-col items-center text-center space-y-4">
              <Users className="h-12 w-12 text-primary" />
              <h2 className="text-2xl font-semibold">Continue as Guest</h2>
              <p className="text-muted-foreground">
                Try out the features without creating an account.
              </p>
              <Button className="w-full" onClick={handleGuest}>
                Continue as Guest
              </Button>
            </div>
          </Card>
        </div>
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-center mb-8">
            Why Choose Our Assistant?
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="p-6">
              <div className="flex flex-col items-center text-center space-y-3">
                <ShoppingCart className="h-8 w-8 text-primary" />
                <h3 className="text-xl font-semibold">Smart Shopping Lists</h3>
                <p className="text-muted-foreground">
                  Create and manage shopping lists with intelligent suggestions.
                </p>
              </div>
            </Card>
            <Card className="p-6">
              <div className="flex flex-col items-center text-center space-y-3">
                <svg className="h-8 w-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <h3 className="text-xl font-semibold">Receipt Scanner</h3>
                <p className="text-muted-foreground">
                  Automatically extract and store items from your receipts.
                </p>
              </div>
            </Card>
            <Card className="p-6">
              <div className="flex flex-col items-center text-center space-y-3">
                <svg className="h-8 w-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                <h3 className="text-xl font-semibold">Pantry Management</h3>
                <p className="text-muted-foreground">
                  Keep track of your inventory with expiration date alerts.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
