export interface Todo {
    id: string;
    title: string;
    description?: string;
    completed: boolean;
    dueDate?: Date | null;
    priority: "low" | "medium" | "high";
    projectId: string; // 'inbox' or custom
    createdAt: any; // Firestore Timestamp
}

export interface Expense {
    id: string;
    amount: number;
    category: string;
    note?: string;
    date: any; // Firestore Timestamp
    type: "income" | "expense";
}
