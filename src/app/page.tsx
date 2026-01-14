"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { ArrowRight, CheckSquare, Calendar, DollarSign } from "lucide-react";

export default function Home() {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && user) {
            router.push("/dashboard/todo");
        }
    }, [user, loading, router]);

    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
            </div>
        )
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-8">
            <div className="max-w-3xl text-center space-y-8">
                <h1 className="text-5xl md:text-7xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    Organize your life.
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    One app for your tasks, schedule, and finances.
                    Simple, beautiful, and syncs across all your devices.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                    <Link
                        href="/login"
                        className="px-8 py-4 bg-primary text-primary-foreground rounded-2xl font-semibold text-lg hover:opacity-90 transition-opacity flex items-center gap-2"
                    >
                        Get Started <ArrowRight className="h-5 w-5" />
                    </Link>
                    <Link
                        href="/dashboard/demo"
                        className="px-8 py-4 bg-secondary text-secondary-foreground rounded-2xl font-semibold text-lg hover:bg-secondary/80 transition-opacity"
                    >
                        Live Demo
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12 text-left">
                    <div className="p-6 bg-secondary/20 rounded-2xl border border-border/50">
                        <CheckSquare className="h-8 w-8 text-blue-500 mb-4" />
                        <h3 className="font-semibold text-lg mb-2">Todo Lists</h3>
                        <p className="text-muted-foreground text-sm">Create tasks, set priorities, and get things done with a Todoist-inspired interface.</p>
                    </div>
                    <div className="p-6 bg-secondary/20 rounded-2xl border border-border/50">
                        <Calendar className="h-8 w-8 text-indigo-500 mb-4" />
                        <h3 className="font-semibold text-lg mb-2">Calendar</h3>
                        <p className="text-muted-foreground text-sm">Visualize your schedule. Tasks with due dates automatically appear here.</p>
                    </div>
                    <div className="p-6 bg-secondary/20 rounded-2xl border border-border/50">
                        <DollarSign className="h-8 w-8 text-green-500 mb-4" />
                        <h3 className="font-semibold text-lg mb-2">Finance</h3>
                        <p className="text-muted-foreground text-sm">Track income and expenses across accounts. Know where your money goes.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
