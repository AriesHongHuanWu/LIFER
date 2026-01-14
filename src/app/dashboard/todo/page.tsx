"use client";

import { useState } from "react";
import { useTodos } from "@/hooks/useTodos";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Calendar as CalendarIcon, Flag } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

export default function TodoPage() {
    const { todos, loading, addTodo, toggleTodo, deleteTodo, updateTodo } = useTodos();
    const [newTask, setNewTask] = useState("");
    const [isAdding, setIsAdding] = useState(false);

    // Basic sorting/grouping could happen here.
    // For now, simple list.

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTask.trim()) return;
        addTodo(newTask);
        setNewTask("");
        setIsAdding(false);
    };

    if (loading) {
        return <div className="p-8">Loading tasks...</div>;
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Inbox</h1>
                <div className="text-sm text-muted-foreground">
                    {format(new Date(), "EEEE, MMM d")}
                </div>
            </div>

            <div className="space-y-4">
                {/* Add Task Button / Input */}
                {!isAdding ? (
                    <button
                        onClick={() => setIsAdding(true)}
                        className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors group px-2"
                    >
                        <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                            <Plus className="h-4 w-4" />
                        </div>
                        <span className="font-medium">Add task</span>
                    </button>
                ) : (
                    <form onSubmit={handleSubmit} className="border rounded-xl p-4 bg-card shadow-sm space-y-3">
                        <input
                            autoFocus
                            type="text"
                            placeholder="Task name"
                            value={newTask}
                            onChange={(e) => setNewTask(e.target.value)}
                            className="w-full bg-transparent text-lg font-medium focus:outline-none placeholder:text-muted-foreground/50"
                        />
                        <div className="flex justify-between items-center pt-2">
                            <div className="flex gap-2">
                                <button type="button" className="p-1.5 hover:bg-secondary rounded-lg text-muted-foreground">
                                    <CalendarIcon className="h-4 w-4" />
                                </button>
                                <button type="button" className="p-1.5 hover:bg-secondary rounded-lg text-muted-foreground">
                                    <Flag className="h-4 w-4" />
                                </button>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={() => setIsAdding(false)}
                                    className="px-3 py-1.5 text-sm font-medium hover:bg-secondary rounded-lg"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={!newTask.trim()}
                                    className="px-3 py-1.5 text-sm font-medium bg-primary text-primary-foreground rounded-lg disabled:opacity-50"
                                >
                                    Add task
                                </button>
                            </div>
                        </div>
                    </form>
                )}

                <div className="space-y-1">
                    <AnimatePresence initial={false}>
                        {todos.map((todo) => (
                            <motion.div
                                key={todo.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, height: 0 }}
                                className="group flex items-start gap-3 p-3 hover:bg-secondary/30 rounded-xl transition-colors"
                            >
                                <button
                                    onClick={() => toggleTodo(todo.id, !todo.completed)}
                                    className={cn(
                                        "mt-1 h-5 w-5 rounded-full border-2 flex items-center justify-center transition-colors",
                                        todo.completed
                                            ? "bg-primary border-primary text-primary-foreground"
                                            : "border-muted-foreground/30 hover:border-primary"
                                    )}
                                >
                                    {todo.completed && <CheckSquare className="h-3 w-3" />}
                                </button>

                                <div className="flex-1 min-w-0">
                                    <p className={cn(
                                        "text-sm font-medium leading-normal transition-all duration-200",
                                        todo.completed && "text-muted-foreground line-through"
                                    )}>
                                        {todo.title}
                                    </p>
                                    {todo.dueDate && (
                                        <div className="flex items-center gap-1 mt-1 text-xs text-red-500">
                                            <CalendarIcon className="h-3 w-3" />
                                            {format(todo.dueDate, "MMM d")}
                                        </div>
                                    )}
                                </div>

                                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => deleteTodo(todo.id)}
                                        className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {todos.length === 0 && !loading && (
                        <div className="text-center py-20 text-muted-foreground">
                            <div className="inline-flex items-center justify-center p-4 bg-secondary/50 rounded-full mb-4">
                                <CheckSquare className="h-8 w-8 opacity-50" />
                            </div>
                            <p>All tasks completed! Nice work.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function CheckSquare({ className }: { className?: string }) {
    return (
        <svg
            className={className}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <polyline points="20 6 9 17 4 12" />
        </svg>
    )
}
