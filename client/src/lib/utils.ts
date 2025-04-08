import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format } from "date-fns";
import { LogEntry } from "@shared/schema";
import { SortOptions } from "./types";

/**
 * Combines multiple class names using clsx and tailwind-merge
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/**
 * Formats a date to a more readable format
 */
export function formatDate(dateString: string): string {
    try {
        const date = new Date(dateString);
        // Check if the date is valid before formatting
        if (isNaN(date.getTime())) {
            return "Invalid Date";
        }
        return format(date, "MMMM d, yyyy");
    } catch (error) {
        return "Invalid Date";
    }
}

/**
 * Get today's date in ISO format (YYYY-MM-DD)
 */
export function getTodayISODate(): string {
    return new Date().toISOString().split("T")[0];
}

/**
 * Sort log entries by the specified field and direction
 */
export function sortLogEntries(entries: LogEntry[], options: SortOptions): LogEntry[] {
    return [...entries].sort((a, b) => {
        const aValue = a[options.field];
        const bValue = b[options.field];

        if (options.direction === "asc") {
            return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
        } else {
            return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
        }
    });
}

/**
 * Retrieve the last used username from localStorage
 */
export function getLastUserName(): string {
    return localStorage.getItem("lastUserName") || "";
}

/**
 * Save the username to localStorage for future use
 */
export function saveUserName(userName: string): void {
    localStorage.setItem("lastUserName", userName);
}
