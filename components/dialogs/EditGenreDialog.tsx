"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Edit } from "lucide-react";

interface EditGenreDialogProps {
    id: string;
    currentName: string;
}

export default function EditGenreDialog({ id, currentName }: EditGenreDialogProps) {
    const [name, setName] = useState(currentName);
    const router = useRouter();

    const handleUpdate = async () => {
        if (!name.trim()) {
            toast.error("Error", { description: "Genre name cannot be empty" });
            return;
        }

        try {
            const res = await api.genres.update(id, name.trim());
            if (!res.success) toast.error("Error", { description: res.message || "Failed to update" });
            else {
                toast.success("Success", { description: "Genre updated successfully" });
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
                <Button className="text-white p-2 rounded">
                    <Edit />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Genre</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4">
                    <Input value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <DialogFooter className="flex justify-end gap-2">
                    <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <DialogClose asChild>
                        <Button onClick={handleUpdate}>Save</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
