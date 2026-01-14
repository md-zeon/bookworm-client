"use client";

import { useEffect, useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { api } from "@/lib/api";
import { Book, Genre } from "@/types/global";

export default function BookTable() {
    const [books, setBooks] = useState<Book[]>([]);
    const [genres, setGenres] = useState<Genre[]>([]);
    const [search, setSearch] = useState("");
    const [genre, setGenre] = useState<string>("all");
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        fetchBooks();
    }, [search, genre]);

    const fetchGenres = async () => {
        const res = await api.genres.getAll();
        setGenres(res.data || []);
    };

    async function fetchBooks() {
        setLoading(true);

        const params = new URLSearchParams();
        if (search) params.append("search", search);
        if (genre !== "all") params.append("genre", genre);

        const res = await api.books.getAll(`?${params.toString()}`);
        setBooks(res.data || []);
        setLoading(false);
    };

    return (
        <div className="space-y-4">
            {/* Filters */}
            <div className="flex gap-3">
                <Input
                    placeholder="Search by title or author..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="max-w-sm"
                />

                <Select value={genre} onValueChange={setGenre}>
                    <SelectTrigger className="w-48">
                        <SelectValue placeholder="Filter by genre" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Genres</SelectItem>
                        {genres.map((g) => (
                            <SelectItem key={g._id} value={g._id}>
                                {g.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Table */}
            <div className="border rounded-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Title</TableHead>
                            <TableHead>Author</TableHead>
                            <TableHead>Genre</TableHead>
                            <TableHead>Pages</TableHead>
                            <TableHead>Rating</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-6">
                                    Loading books...
                                </TableCell>
                            </TableRow>
                        ) : books.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-6">
                                    No books found
                                </TableCell>
                            </TableRow>
                        ) : (
                            books.map((book) => (
                                <TableRow key={book._id}>
                                    <TableCell className="font-medium">
                                        {book.title}
                                    </TableCell>
                                    <TableCell>{book.author}</TableCell>
                                    <TableCell>{book.genre ?? "—"}</TableCell>
                                    <TableCell>{book.totalPages}</TableCell>
                                    <TableCell>{book.averageRating}</TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
