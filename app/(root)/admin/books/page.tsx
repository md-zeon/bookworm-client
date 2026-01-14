"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { columns } from "./columns"
import { DataTable } from "@/components/ui/data-table";
import { api } from "@/lib/api"
import { toast } from "sonner";
import { Book } from "@/types/global";

export default function BooksPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchBooks = async () => {
        setLoading(true);
        try {
            const { data } = await api.books.getAll();
            setBooks(data || []);
        } catch (error) {
            toast.error("Error", { description: "Failed to fetch books" });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBooks();
    }, []);

    const handleSearch = (searchValue: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (searchValue) {
            params.set("search", searchValue);
        } else {
            params.delete("search");
        }
        router.push(`/admin/books?${params.toString()}`);
    };

    const handleSort = (columnId: string, direction: "asc" | "desc") => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("sortBy", columnId);
        params.set("sortOrder", direction);
        router.push(`/admin/books?${params.toString()}`);
    };

    const handlePageChange = (pageIndex: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", pageIndex.toString());
        router.push(`/admin/books?${params.toString()}`);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-8">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Book Management</h1>
            </div>

            <DataTable 
                columns={columns} 
                data={books} 
                pageSize={10} 
                searchKeys={["title", "author"]}
            />
        </div>
    )
}
