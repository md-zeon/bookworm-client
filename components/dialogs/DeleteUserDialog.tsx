"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

interface DeleteUserDialogProps {
    id: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function DeleteUserDialog({ id, open, onOpenChange }: DeleteUserDialogProps) {
    const router = useRouter();

    const handleDelete = async () => {
        try {
            const res = await api.users.delete(id);
            if (!res.success) toast.error("Error", { description: res.message });
            else {
                toast.success("Deleted successfully");
                router.refresh();
                onOpenChange(false);
            }
        } catch (err: any) {
            toast.error("Error", { description: err.message });
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Confirm Delete</DialogTitle>
                </DialogHeader>
                <p>Are you sure you want to delete this user? This action cannot be undone.</p>
                <DialogFooter className="flex justify-end gap-2">
                    <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button className="bg-red-500 hover:bg-red-700 text-white" onClick={handleDelete}>
                        Delete
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
