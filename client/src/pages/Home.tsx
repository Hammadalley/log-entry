import { useState } from "react";
import { Plus } from "lucide-react";
import { LogEntry } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { sortLogEntries } from "@/lib/utils";
import { SortOptions } from "@/lib/types";
import { useLogEntries, useLogEntryMutations } from "@/lib/hooks";
import LogEntryCard from "@/components/LogEntryCard";
import LogEntryForm from "@/components/LogEntryForm";
import ConfirmDeleteDialog from "@/components/ConfirmDeleteDialog";
import EmptyState from "@/components/EmptyState";

export default function Home() {
  const [showForm, setShowForm] = useState(false);
  const [currentEntry, setCurrentEntry] = useState<LogEntry | undefined>(undefined);
  
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [entryToDelete, setEntryToDelete] = useState<LogEntry | null>(null);
  
  const [sortOptions, setSortOptions] = useState<SortOptions>({
    field: "date",
    direction: "desc",
  });
  const { toast } = useToast();
  const { data: logEntries = [], isLoading } = useLogEntries();
  const { createLogEntry, updateLogEntry, deleteLogEntry } = useLogEntryMutations();
  
  const handleNewEntry = () => {
    setCurrentEntry(undefined);
    setShowForm(true);
  };
  
  const handleEdit = (entry: LogEntry) => {
    setCurrentEntry(entry);
    setShowForm(true);
  };
  
  const handleDelete = (entry: LogEntry) => {
    setEntryToDelete(entry);
    setDeleteDialogOpen(true);
  };
  
  const handleSubmit = async (data: any) => {
    try {
      if (currentEntry) {
        await updateLogEntry.mutateAsync({ id: currentEntry.id, entry: data });
        toast({
          title: "Entry updated",
          description: "The log entry was updated successfully.",
        });
      } else {
        await createLogEntry.mutateAsync(data);
        toast({
          title: "Entry created",
          description: "The log entry was created successfully.",
        });
      }
      setShowForm(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save the log entry. Please try again.",
        variant: "destructive",
      });
      console.error("Error saving entry:", error);
    }
  };
  
  const handleConfirmDelete = async () => {
    if (!entryToDelete) return;
    
    try {
      await deleteLogEntry.mutateAsync(entryToDelete.id);
      toast({
        title: "Entry deleted",
        description: "The log entry was deleted successfully.",
      });
      setDeleteDialogOpen(false);
      setEntryToDelete(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete the log entry. Please try again.",
        variant: "destructive",
      });
      console.error("Error deleting entry:", error);
    }
  };
  
  const sortedEntries = sortLogEntries(logEntries, sortOptions);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold text-textColor">Log Entry Manager</h1>
        <Button
          onClick={handleNewEntry}
          className="bg-primary hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Entry
        </Button>
      </header>
      
      {/* Log Entry Form */}
      {showForm && (
        <LogEntryForm
          currentEntry={currentEntry}
          onSubmit={handleSubmit}
          onCancel={() => setShowForm(false)}
          isSubmitting={createLogEntry.isPending || updateLogEntry.isPending}
        />
      )}
      
      {/* Log Entries List */}
      <div>
        <h2 className="text-xl font-medium mb-4">Log Entries</h2>
        
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-lg p-5 shadow-card animate-pulse h-32"
              ></div>
            ))}
          </div>
        ) : sortedEntries.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-4">
            {sortedEntries.map((entry) => (
              <LogEntryCard
                key={entry.id}
                entry={entry}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
      
      {/* Delete Confirmation Dialog */}
      <ConfirmDeleteDialog
        isOpen={deleteDialogOpen}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteDialogOpen(false)}
        isDeleting={deleteLogEntry.isPending}
      />
    </div>
  );
}
