"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Genre } from "@/types/global";
import { api } from "@/lib/api";
import { toast } from "sonner";
import GenreForm from "@/components/forms/GenreForm";
import GenreTable from "@/components/tables/GenreTable";

export default function GenresPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [genres, setGenres] = useState<Genre[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchGenres = async () => {
        setLoading(true);
        try {
            const result = await api.genres.getAll<Genre[]>();
            if (result.success && result.data) {
                setGenres(result.data);
            } else {
                toast.error("Error", { description: result.message || "Failed to fetch genres" });
            }
        } catch (error) {
            toast.error("Error", { description: "Failed to fetch genres" });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGenres();
    }, []);

    const handleSearch = (searchValue: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (searchValue) {
            params.set("search", searchValue);
        } else {
            params.delete("search");
        }
        router.push(`/admin/genres?${params.toString()}`);
    };

    const handleSort = (columnId: string, direction: "asc" | "desc") => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("sortBy", columnId);
        params.set("sortOrder", direction);
        router.push(`/admin/genres?${params.toString()}`);
    };

    const handlePageChange = (pageIndex: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", pageIndex.toString());
        router.push(`/admin/genres?${params.toString()}`);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6 p-4">
            <h1 className="text-2xl font-semibold">Genres</h1>
            <GenreForm />
            <GenreTable genres={genres} />
        </div>
    );
}
