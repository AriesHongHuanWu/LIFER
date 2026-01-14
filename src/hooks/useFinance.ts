"use client";

import { useState, useEffect } from "react";
import {
    collection,
    query,
    onSnapshot,
    addDoc,
    deleteDoc,
    doc,
    serverTimestamp,
    orderBy,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { Expense } from "@/types";

export function useFinance() {
    const { user } = useAuth();
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            setExpenses([]);
            setLoading(false);
            return;
        }

        const q = query(
            collection(db, "users", user.uid, "expenses"),
            orderBy("date", "desc")
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const expenseList = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
                date: doc.data().date?.toDate(),
            })) as Expense[];
            setExpenses(expenseList);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user]);

    const addExpense = async (amount: number, category: string, type: "income" | "expense", note?: string) => {
        if (!user) return;
        await addDoc(collection(db, "users", user.uid, "expenses"), {
            amount,
            category,
            type,
            note: note || "",
            date: serverTimestamp(),
        });
    };

    const deleteExpense = async (id: string) => {
        if (!user) return;
        const ref = doc(db, "users", user.uid, "expenses", id);
        await deleteDoc(ref);
    };

    return { expenses, loading, addExpense, deleteExpense };
}
