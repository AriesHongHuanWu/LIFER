"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CheckSquare, Calendar, DollarSign, LogOut, Settings, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";

const navItems = [
    { name: "Todo List", href: "/dashboard/todo", icon: CheckSquare },
    { name: "Calendar", href: "/dashboard/calendar", icon: Calendar },
    { name: "Finance", href: "/dashboard/finance", icon: DollarSign },
];

export function Sidebar() {
    const pathname = usePathname();
    const { user, logout } = useAuth();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            {/* Mobile Toggle */}
            <div className="md:hidden fixed top-4 left-4 z-50">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="p-2 bg-background border rounded-full shadow-md"
                >
                    <Menu className="h-6 w-6" />
                </button>
            </div>

            {/* Sidebar Container */}
            <aside
                className={cn(
                    "fixed inset-y-0 left-0 z-40 w-64 bg-background border-r transform transition-transform duration-200 ease-in-out md:translate-x-0",
                    isOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                <div className="flex flex-col h-full border-r bg-card/50 backdrop-blur-xl">
                    {/* Header */}
                    <div className="h-16 flex items-center px-6 border-b">
                        <h1 className="text-xl font-bold bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent">
                            LIFER
                        </h1>
                    </div>

                    {/* Nav Items */}
                    <div className="flex-1 py-6 px-3 space-y-1">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = pathname.startsWith(item.href);
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setIsOpen(false)}
                                    className={cn(
                                        "flex items-center gap-x-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
                                        isActive
                                            ? "bg-primary/10 text-primary"
                                            : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                                    )}
                                >
                                    <Icon className="h-5 w-5" />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </div>

                    {/* User Section */}
                    <div className="p-4 border-t bg-secondary/20">
                        {user ? (
                            <div className="flex items-center gap-x-3">
                                <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                                    {user.email?.[0].toUpperCase()}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium truncate">{user.displayName || "User"}</p>
                                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                                </div>
                                <button
                                    onClick={() => logout()}
                                    className="p-2 hover:bg-destructive/10 hover:text-destructive rounded-lg transition-colors"
                                >
                                    <LogOut className="h-4 w-4" />
                                </button>
                            </div>
                        ) : (
                            <Link
                                href="/login"
                                className="flex items-center justify-center w-full py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
                            >
                                Sign In
                            </Link>
                        )}
                    </div>
                </div>
            </aside>

            {/* Overlay for mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-30 bg-black/50 md:hidden backdrop-blur-sm"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </>
    );
}
