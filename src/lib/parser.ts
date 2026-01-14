export interface ParsedTask {
    title: string;
    priority?: "low" | "medium" | "high";
    dueDate?: Date;
}

export function parseTaskInput(input: string): ParsedTask {
    let title = input;
    let priority: ParsedTask["priority"] | undefined;
    let dueDate: Date | undefined;

    // 1. Detect Priority (P1, P2, P3)
    // P1 -> High, P2 -> Medium, P3 -> Low (Mapping to Todoist style commonly inverted or specific, 
    // but usually P1 is highest). 
    // User requested: "P1 P2 P3 in title detects and changes". 
    // Let's assume P1 = High, P2 = Medium, P3 = Low/Normal.

    // Case insensitive P1, P2, P3 at end or standalone
    const p1Regex = /\bP1\b/i;
    const p2Regex = /\bP2\b/i;
    const p3Regex = /\bP3\b/i;

    if (p1Regex.test(title)) {
        priority = "high";
        title = title.replace(p1Regex, "").trim();
    } else if (p2Regex.test(title)) {
        priority = "medium";
        title = title.replace(p2Regex, "").trim();
    } else if (p3Regex.test(title)) {
        priority = "low";
        title = title.replace(p3Regex, "").trim();
    }

    // 2. Detect Date (MM/DD)
    // Regex for M/D or MM/DD at end or standalone words.
    // Example: "Buy milk 1/15" or "10/20 Meeting"
    const dateRegex = /\b(\d{1,2})\/(\d{1,2})\b/;
    const dateMatch = title.match(dateRegex);

    if (dateMatch) {
        const month = parseInt(dateMatch[1], 10);
        const day = parseInt(dateMatch[2], 10);
        const currentYear = new Date().getFullYear();

        // Simple date construction
        const dateObj = new Date(currentYear, month - 1, day);

        // If date is in past, maybe next year? (Todoist logic usually sophisticated, keeping simple for now)
        // If user types 1/1 and it's Dec, likely next year. 
        if (dateObj.getTime() < new Date().setHours(0, 0, 0, 0)) {
            dateObj.setFullYear(currentYear + 1);
        }

        dueDate = dateObj;
        title = title.replace(dateRegex, "").trim();
    }

    // Cleanup extra spaces
    title = title.replace(/\s+/g, " ").trim();

    return { title, priority, dueDate };
}
