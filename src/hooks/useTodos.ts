"use client";

import { useState, useEffect } from "react";
import {
    collection,
    query,
    onSnapshot,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    serverTimestamp,
    orderBy,
    where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { Todo } from "@/types";
import { parseTaskInput } from "@/lib/parser";

export function useTodos() {
    const { user } = useAuth();
    const [todos, setTodos] = useState<Todo[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            setTodos([]);
            setLoading(false);
            return;
        }

        const q = query(
            collection(db, "users", user.uid, "tasks"),
            orderBy("createdAt", "desc")
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const taskList = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
                // Convert Firestore Timestamp to Date object if needed for UI, 
                // but keeping as is for now or use helper. 
                // We'll simplisticly handle dates in UI.
                dueDate: doc.data().dueDate?.toDate() || null,
            })) as Todo[];
            setTodos(taskList);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user]);

    const addTodo = async (title: string, dueDate: Date | null = null, priority: Todo["priority"] = "medium") => {
        if (!user) return;

        // Use smart parsing if no explicit dates/priority overrides are passed (or if they match defaults)
        const parsed = parseTaskInput(title);

        // If the parsed title is different, use it.
        // If explicit dueDate is null, use parsed.
        // If explicit priority is medium (default), use parsed.
        // This allows programmatic override if needed, but defaults to smart parsing.

        const finalTitle = parsed.title;
        const finalDueDate = dueDate || parsed.dueDate || null;

        // Only override priority if it was default 'medium' AND we found something else
        // Or should we always prefer parsed? Let's prefer parsed if it's there.
        const finalPriority = (priority === 'medium' && parsed.priority) ? parsed.priority : priority;

        await addDoc(collection(db, "users", user.uid, "tasks"), {
            title: finalTitle,
            completed: false,
            dueDate: finalDueDate,
            priority: finalPriority,
            projectId: "inbox",
            createdAt: serverTimestamp(),
        });
    };

    const toggleTodo = async (id: string, completed: boolean) => {
        if (!user) return;
        const todoRef = doc(db, "users", user.uid, "tasks", id);
        await updateDoc(todoRef, { completed });
    };

    const deleteTodo = async (id: string) => {
        if (!user) return;
        const todoRef = doc(db, "users", user.uid, "tasks", id);
        await deleteDoc(todoRef);
    };

    const updateTodo = async (id: string, data: Partial<Todo>) => {
        if (!user) return;
        const todoRef = doc(db, "users", user.uid, "tasks", id);
        await updateDoc(todoRef, data);
    }

    return { todos, loading, addTodo, toggleTodo, deleteTodo, updateTodo };
}
