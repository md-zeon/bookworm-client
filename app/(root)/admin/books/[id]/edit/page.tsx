import { notFound } from "next/navigation";
import EditBookForm from "@/components/forms/EditBookForm";
import { api } from "@/lib/api";
import { Book, Genre } from "@/types/global";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function EditBookPage({ params }: PageProps) {
    const { id } = await params;

    let book: Book | null = null;
    let genres: Genre[] = [];

    try {
        const [bookRes, genresRes] = await Promise.all([
            api.books.getById(id),
            api.genres.getAll()
        ]);

        book = bookRes.data ?? null;
        genres = Array.isArray(genresRes.data) ? genresRes.data : (genresRes.data as { data: Genre[] }).data || [];

    } catch (error) {
        console.error("Failed to fetch book data:", error);
        throw new Error("Could not load the editing form.");
    }

    if (!book) {
        return notFound();
    }

    return (
        <div className="w-full max-w-2xl mx-auto my-10">
            <h1 className="text-2xl font-bold mb-6">Edit Book</h1>
            <EditBookForm book={book} genres={genres} />
        </div>
    );
}