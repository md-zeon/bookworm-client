import EditBookForm from "@/components/forms/EditBookForm";
import { api } from "@/lib/api";
import { Book, Genre } from "@/types/global";


interface PageProps {
    params: {
        id: string;
    };
}

export default async function EditBookPage({ params }: PageProps) {
    const { id } = await params;
    const { data: book }: { data: Book } = await api.books.getById(id);
    const { data: genres }: { data: Genre[] } = await api.genres.getAll();

    return (
        <div className="w-full max-w-2xl mx-auto my-10">
            <EditBookForm book={book} genres={genres} />
        </div>
    );
}
