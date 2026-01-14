import { api } from "@/lib/api";
import { Genre, Book } from "@/types/global";
import EditBookForm from "./EditBookForm";

interface PageProps {
    params: {
        id: string;
    };
}

export default async function EditBookPage({ params }: PageProps) {
    const { data: book }: { data: Book } = await api.books.getById(params.id);
    const { data: genres }: { data: Genre[] } = await api.genres.getAll();

    return (
        <div className="w-full max-w-2xl mx-auto my-10">
            <EditBookForm book={book} genres={genres} />
        </div>
    );
}
