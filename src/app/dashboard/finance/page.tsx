"use client";

import { useState } from "react";
import { useFinance } from "@/hooks/useFinance";
import { cn } from "@/lib/utils";
import { DollarSign, TrendingUp, TrendingDown, Plus, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

export default function FinancePage() {
    const { expenses, loading, addExpense, deleteExpense } = useFinance();
    const [isAdding, setIsAdding] = useState(false);

    // Form State
    const [amount, setAmount] = useState("");
    const [category, setCategory] = useState("");
    const [type, setType] = useState<"income" | "expense">("expense");
    const [note, setNote] = useState("");

    const totalBalance = expenses.reduce((acc, curr) => {
        return curr.type === "income" ? acc + curr.amount : acc - curr.amount;
    }, 0);

    const totalIncome = expenses
        .filter((e) => e.type === "income")
        .reduce((acc, curr) => acc + curr.amount, 0);

    const totalExpense = expenses
        .filter((e) => e.type === "expense")
        .reduce((acc, curr) => acc + curr.amount, 0);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!amount || !category) return;
        addExpense(parseFloat(amount), category, type, note);
        setAmount("");
        setCategory("");
        setNote("");
        setIsAdding(false);
    };

    if (loading) {
        return (
            <div className="max-w-5xl mx-auto space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Skeleton className="h-32 rounded-2xl" />
                    <Skeleton className="h-32 rounded-2xl" />
                    <Skeleton className="h-32 rounded-2xl" />
                </div>
                <Skeleton className="h-64 rounded-2xl" />
            </div>
        )
    }

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Finance</h1>
                <button
                    onClick={() => setIsAdding(true)}
                    className="bg-primary text-primary-foreground px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 hover:bg-primary/90 transition-colors"
                >
                    <Plus className="h-4 w-4" />
                    Add Transaction
                </button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-card border p-6 rounded-2xl shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-xl">
                            <DollarSign className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Total Balance</p>
                            <h2 className="text-2xl font-bold">${totalBalance.toFixed(2)}</h2>
                        </div>
                    </div>
                </div>

                <div className="bg-card border p-6 rounded-2xl shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-xl">
                            <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Total Income</p>
                            <h2 className="text-2xl font-bold text-green-600 dark:text-green-500">
                                +${totalIncome.toFixed(2)}
                            </h2>
                        </div>
                    </div>
                </div>

                <div className="bg-card border p-6 rounded-2xl shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-xl">
                            <TrendingDown className="h-6 w-6 text-red-600 dark:text-red-400" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Total Expenses</p>
                            <h2 className="text-2xl font-bold text-red-600 dark:text-red-500">
                                -${totalExpense.toFixed(2)}
                            </h2>
                        </div>
                    </div>
                </div>
            </div>

            {/* Add Transaction Modal/Form (Inline for simplicity) */}
            {isAdding && (
                <div className="bg-card border p-6 rounded-2xl shadow-sm animate-in fade-in slide-in-from-top-4">
                    <h3 className="text-lg font-semibold mb-4">New Transaction</h3>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Type</label>
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={() => setType("expense")}
                                    className={cn(
                                        "flex-1 py-2 rounded-lg text-sm font-medium transition-colors border",
                                        type === "expense"
                                            ? "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400"
                                            : "bg-transparent hover:bg-secondary"
                                    )}
                                >
                                    Expense
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setType("income")}
                                    className={cn(
                                        "flex-1 py-2 rounded-lg text-sm font-medium transition-colors border",
                                        type === "income"
                                            ? "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400"
                                            : "bg-transparent hover:bg-secondary"
                                    )}
                                >
                                    Income
                                </button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Amount</label>
                            <input
                                type="number"
                                step="0.01"
                                placeholder="0.00"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="w-full px-3 py-2 bg-transparent border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Category</label>
                            <input
                                type="text"
                                placeholder="e.g. Food, Rent, Salary"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full px-3 py-2 bg-transparent border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Note (Optional)</label>
                            <input
                                type="text"
                                placeholder="Details..."
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                className="w-full px-3 py-2 bg-transparent border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                            />
                        </div>

                        <div className="md:col-span-2 flex justify-end gap-2 pt-2">
                            <button
                                type="button"
                                onClick={() => setIsAdding(false)}
                                className="px-4 py-2 text-sm font-medium hover:bg-secondary rounded-lg"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg"
                            >
                                Save Transaction
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Transactions List */}
            <div className="bg-card border rounded-2xl overflow-hidden">
                <div className="p-4 border-b">
                    <h3 className="font-semibold">Recent Transactions</h3>
                </div>
                <div className="divide-y">
                    {expenses.map((expense) => (
                        <div key={expense.id} className="p-4 flex items-center justify-between hover:bg-secondary/20 transition-colors group">
                            <div className="flex items-center gap-4">
                                <div
                                    className={cn(
                                        "h-10 w-10 rounded-full flex items-center justify-center",
                                        expense.type === "income"
                                            ? "bg-green-100 text-green-600 dark:bg-green-900/20"
                                            : "bg-red-100 text-red-600 dark:bg-red-900/20"
                                    )}
                                >
                                    {expense.type === "income" ? (
                                        <TrendingUp className="h-5 w-5" />
                                    ) : (
                                        <TrendingDown className="h-5 w-5" />
                                    )}
                                </div>
                                <div>
                                    <p className="font-medium">{expense.category}</p>
                                    <p className="text-xs text-muted-foreground">
                                        {expense.date ? format(expense.date, "MMM d, yyyy") : "No date"}
                                        {expense.note && ` • ${expense.note}`}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <span
                                    className={cn(
                                        "font-bold",
                                        expense.type === "income" ? "text-green-600" : "text-foreground"
                                    )}
                                >
                                    {expense.type === "income" ? "+" : "-"}${expense.amount.toFixed(2)}
                                </span>
                                <button
                                    onClick={() => deleteExpense(expense.id)}
                                    className="opacity-0 group-hover:opacity-100 p-2 text-muted-foreground hover:text-destructive transition-all"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                    {expenses.length === 0 && (
                        <div className="p-8 text-center text-muted-foreground">
                            No transactions yet.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
