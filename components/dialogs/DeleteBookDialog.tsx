"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface DeleteBookDialogProps {
    id: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function DeleteBookDialog({ id, open, onOpenChange }: DeleteBookDialogProps) {
    const router = useRouter();
    const handleDelete = async () => {
        try {
            const res = await api.books.delete(id);
            if (!res.success) toast.error("Error", { description: res.message || "Failed to delete" });
            else {
                toast.success("Success", { description: "Book deleted successfully" });
                router.refresh();
            }
        } catch (err: any) {
            console.error(err);
            toast.error("Error", { description: err.message || "Something went wrong" });
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Confirm Delete</DialogTitle>
                </DialogHeader>
                <p>Are you sure you want to delete this book? This action cannot be undone.</p>
                <DialogFooter className="flex justify-end gap-2">
                    <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button onClick={handleDelete} className="bg-red-500 hover:bg-red-700 text-white">
                        Delete
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
