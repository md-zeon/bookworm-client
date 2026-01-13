"use client";

import { Button } from "@/components/ui/button";

interface Props {
    onEdit: () => void;
    onDelete: () => void;
}

export default function GenreActions({ onEdit, onDelete }: Props) {
    return (
        <div className="flex gap-2 justify-center">
            <Button size="sm" variant="outline" onClick={onEdit}>
                Edit
            </Button>
            <Button size="sm" variant="destructive" onClick={onDelete}>
                Delete
            </Button>
        </div>
    );
}
