"use client";

import { useState } from "react";
import { useTodos } from "@/hooks/useTodos";
import {
    format,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    eachDayOfInterval,
    isSameMonth,
    isSameDay,
    addMonths,
    subMonths
} from "date-fns";
import { ChevronLeft, ChevronRight, CheckSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

export default function CalendarPage() {
    const { todos, loading } = useTodos();
    const [currentDate, setCurrentDate] = useState(new Date());

    if (loading) {
        return (
            <div className="h-full flex flex-col p-4 space-y-4">
                <div className="flex justify-between items-center">
                    <Skeleton className="h-8 w-48" />
                    <div className="flex gap-2">
                        <Skeleton className="h-9 w-9" />
                        <Skeleton className="h-9 w-9" />
                    </div>
                </div>
                <Skeleton className="flex-1 w-full rounded-xl" />
            </div>
        );
    }

    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const days = eachDayOfInterval({ start: startDate, end: endDate });

    const tasksWithDates = todos.filter(t => t.dueDate);

    const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
    const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));
    const today = () => setCurrentDate(new Date());

    return (
        <div className="h-full flex flex-col space-y-4">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Calendar</h1>
                <div className="flex items-center gap-2">
                    <button onClick={prevMonth} className="p-2 hover:bg-secondary rounded-lg">
                        <ChevronLeft className="h-5 w-5" />
                    </button>
                    <span className="font-semibold w-32 text-center">
                        {format(currentDate, "MMMM yyyy")}
                    </span>
                    <button onClick={nextMonth} className="p-2 hover:bg-secondary rounded-lg">
                        <ChevronRight className="h-5 w-5" />
                    </button>
                    <button onClick={today} className="ml-4 px-3 py-1.5 text-sm font-medium bg-secondary rounded-lg hover:bg-secondary/80">
                        Today
                    </button>
                </div>
            </div>

            <div className="flex-1 bg-card border rounded-2xl overflow-hidden flex flex-col shadow-sm">
                {/* Days Header */}
                <div className="grid grid-cols-7 border-b bg-secondary/30">
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
                        <div key={day} className="py-2 text-center text-sm font-medium text-muted-foreground border-r last:border-r-0">
                            {day}
                        </div>
                    ))}
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 grid-rows-5 flex-1">
                    {days.map((day, idx) => {
                        const dayTasks = tasksWithDates.filter(t => isSameDay(t.dueDate!, day));
                        const isCurrentMonth = isSameMonth(day, monthStart);
                        const isToday = isSameDay(day, new Date());

                        return (
                            <div
                                key={day.toISOString()}
                                className={cn(
                                    "min-h-[100px] p-2 border-r border-b relative group hover:bg-secondary/10 transition-colors",
                                    !isCurrentMonth && "bg-secondary/5 text-muted-foreground/30",
                                    idx % 7 === 6 && "border-r-0"
                                )}
                            >
                                <div className={cn(
                                    "text-sm font-medium mb-1 h-7 w-7 flex items-center justify-center rounded-full",
                                    isToday && "bg-primary text-primary-foreground"
                                )}>
                                    {format(day, "d")}
                                </div>

                                <div className="space-y-1 overflow-y-auto max-h-[80%] custom-scrollbar">
                                    {dayTasks.map(task => (
                                        <div
                                            key={task.id}
                                            className={cn(
                                                "text-xs px-1.5 py-0.5 rounded truncate flex items-center gap-1",
                                                task.completed ? "bg-secondary text-muted-foreground line-through" : "bg-primary/10 text-primary"
                                            )}
                                            title={task.title}
                                        >
                                            {task.completed && <CheckSquare className="h-2 w-2" />}
                                            {task.title}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    );
}
