import { ClipboardList } from "lucide-react";

export default function EmptyState() {
    return (
        <div className="bg-white rounded-lg p-8 text-center shadow-card">
            <div className="flex justify-center mb-4">
                <ClipboardList className="h-12 w-12 text-gray-300" />
            </div>
            <p className="text-gray-500">No log entries yet. Create your first entry to get started.</p>
        </div>
    );
}
