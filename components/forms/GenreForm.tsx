"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";
import { toast } from "sonner";

export default function GenreForm() {
    const [name, setName] = useState<string>("");
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await api.genres.create(name);
            toast.success(`Genre "${res.data?.name}" created successfully`);
            setName("");
        } catch (error) {
            toast.error("Failed to create genre");
            console.error(error);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="flex gap-2"
        >
            <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Genre name"
                required
            />
            <Button type="submit">Create</Button>
        </form>
    );
}
