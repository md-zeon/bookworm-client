import AddBookForm from "@/components/forms/AddBookForm";
import { api } from "@/lib/api";
import { Genre } from "@/types/global";

export default async function AddNewBookPage() {
    const { data = [] } = await api.genres.getAll<Genre[]>();
    return (
        <div className="w-full max-w-2xl mx-auto my-10">
            <h1 className="text-3xl font-bold mb-6">Add New Book</h1>
            <AddBookForm genres={data} />
        </div>
    );
}
