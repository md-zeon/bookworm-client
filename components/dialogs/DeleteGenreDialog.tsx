"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { api } from "@/lib/api";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface DeleteGenreDialogProps {
    id: string;
}

export default function DeleteGenreDialog({ id }: DeleteGenreDialogProps) {
    const router = useRouter();
    const handleDelete = async () => {
        try {
            const res = await api.genres.delete(id);
            if (!res.success) toast.error("Error", { description: res.message || "Failed to delete" });
            else {
                toast.success("Success", { description: "Genre deleted successfully" });
                router.refresh();
            }
        } catch (err: any) {
            console.error(err);
            toast.error("Error", { description: err.message || "Something went wrong" });
        }
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="bg-red-500 hover:bg-red-700 text-white p-2 rounded">
                    <Trash />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Confirm Delete</DialogTitle>
                </DialogHeader>
                <p>Are you sure you want to delete this genre? This action cannot be undone.</p>
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
