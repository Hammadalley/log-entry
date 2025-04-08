import { LogEntry } from "@shared/schema";

export type SortDirection = "asc" | "desc";

export type EntryFormData = {
    userName: string;
    description: string;
    date: string;
    location: string;
};

export type SortOptions = {
    field: keyof LogEntry;
    direction: SortDirection;
};
