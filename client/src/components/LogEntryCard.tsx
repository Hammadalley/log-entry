import { CalendarIcon, Pencil, Trash2 } from "lucide-react";
import { LogEntry } from "@shared/schema";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface LogEntryCardProps {
    entry: LogEntry;
    onEdit: (entry: LogEntry) => void;
    onDelete: (entry: LogEntry) => void;
}

export default function LogEntryCard({
    entry,
    onEdit,
    onDelete,
}: LogEntryCardProps) {
    return (
        <Card className="shadow-card transition-all hover:shadow-md">
            <CardContent className="p-5">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="font-medium text-base">{entry.userName}</h3>
                        <p className="text-sm text-gray-500">{entry.location}</p>
                    </div>
                    <div className="flex space-x-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-gray-400 hover:text-primary"
                            onClick={() => onEdit(entry)}
                            aria-label="Edit entry"
                        >
                            <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-gray-400 hover:text-red-500"
                            onClick={() => onDelete(entry)}
                            aria-label="Delete entry"
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
                <p className="my-3 text-textColor">{entry.description}</p>
                <p className="text-xs text-gray-500">
                    <CalendarIcon className="inline-block mr-1 h-3 w-3" />
                    {formatDate(entry.date)}
                </p>
            </CardContent>
        </Card>
    );
}
