import { useState, useEffect } from "react";
import { LogEntry, InsertLogEntry } from "@shared/schema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "./queryClient";
import { saveUserName } from "./utils";

// Hook for log entry mutations
export function useLogEntryMutations() {
    const queryClient = useQueryClient();

    const createLogEntry = useMutation({
        mutationFn: async (entry: InsertLogEntry) => {
            // Save the username for future entries
            if (entry.userName) {
                saveUserName(entry.userName);
            }

            const res = await apiRequest("POST", "/api/log-entries", entry);
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/log-entries"] });
        },
    });

    const updateLogEntry = useMutation({
        mutationFn: async ({ id, entry }: { id: number; entry: InsertLogEntry }) => {
            // Save the username for future entries
            if (entry.userName) {
                saveUserName(entry.userName);
            }

            const res = await apiRequest("PUT", `/api/log-entries/${id}`, entry);
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/log-entries"] });
        },
    });

    const deleteLogEntry = useMutation({
        mutationFn: async (id: number) => {
            await apiRequest("DELETE", `/api/log-entries/${id}`);
            return id;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/log-entries"] });
        },
    });

    return {
        createLogEntry,
        updateLogEntry,
        deleteLogEntry,
    };
}

export function useLogEntries() {
    return useQuery<LogEntry[]>({
        queryKey: ["/api/log-entries"],
    });
}
