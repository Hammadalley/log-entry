import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertLogEntrySchema, LogEntry } from "@shared/schema";
import { z } from "zod";
import { getTodayISODate, getLastUserName } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const formSchema = insertLogEntrySchema.extend({
    date: z.string().min(1, "Date is required"),
});

type FormValues = z.infer<typeof formSchema>;

interface LogEntryFormProps {
    currentEntry?: LogEntry;
    onSubmit: (data: FormValues) => void;
    onCancel: () => void;
    isSubmitting: boolean;
}

export default function LogEntryForm({
    currentEntry,
    onSubmit,
    onCancel,
    isSubmitting,
}: LogEntryFormProps) {
    const [isEditing, setIsEditing] = useState(false);

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            userName: getLastUserName(),
            description: "",
            date: getTodayISODate(),
            location: "",
        },
    });

    useEffect(() => {
        if (currentEntry) {
            setIsEditing(true);
            form.reset({
                userName: currentEntry.userName,
                description: currentEntry.description,
                date: currentEntry.date,
                location: currentEntry.location,
            });
        } else {
            setIsEditing(false);
            form.reset({
                userName: getLastUserName(), // Persist username
                description: "",
                date: getTodayISODate(),
                location: "",
            });
        }
    }, [currentEntry, form]);

    const handleSubmit = (data: FormValues) => {
        onSubmit(data);
    };

    return (
        <Card className="bg-white rounded-lg shadow-card mb-8">
            <CardContent className="p-6">
                <h2 className="text-lg font-medium mb-4">
                    {isEditing ? "Edit Log Entry" : "Create New Log Entry"}
                </h2>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="userName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-medium text-textColor">
                                        User Name
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            required
                                            placeholder="Enter your name"
                                            {...field}
                                            className="w-full px-3 py-2 border border-borderColor rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-medium text-textColor">
                                        Event Description
                                    </FormLabel>
                                    <FormControl>
                                        <Textarea
                                            required
                                            placeholder="Describe the event"
                                            rows={3}
                                            {...field}
                                            className="w-full px-3 py-2 border border-borderColor rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="date"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm font-medium text-textColor">
                                            Date
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                required
                                                type="date"
                                                {...field}
                                                className="w-full px-3 py-2 border border-borderColor rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="location"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm font-medium text-textColor">
                                            Location
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                required
                                                placeholder="Where did it happen"
                                                {...field}
                                                className="w-full px-3 py-2 border border-borderColor rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="flex justify-end space-x-3">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onCancel}
                                className="px-4 py-2 border border-borderColor rounded-md text-sm font-medium"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="bg-primary hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                            >
                                {isSubmitting ? "Saving..." : "Save Entry"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
