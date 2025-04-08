import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ConfirmDeleteDialogProps {
    isOpen: boolean;
    onConfirm: () => void;
    onCancel: () => void;
    isDeleting: boolean;
}

export default function ConfirmDeleteDialog({
    isOpen,
    onConfirm,
    onCancel,
    isDeleting,
}: ConfirmDeleteDialogProps) {
    return (
        <AlertDialog open={isOpen} onOpenChange={(open: any) => !open && onCancel()}>
            <AlertDialogContent className="bg-white rounded-lg p-6 max-w-md w-full shadow-modal">
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-lg font-medium mb-2">
                        Confirm Deletion
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to delete this log entry? This action cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="mt-4">
                    <AlertDialogCancel
                        className="px-4 py-2 border border-borderColor rounded-md text-sm font-medium transition-colors hover:bg-gray-50"
                        disabled={isDeleting}
                    >
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                        onClick={onConfirm}
                        disabled={isDeleting}
                    >
                        {isDeleting ? "Deleting..." : "Delete"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
