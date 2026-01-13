import { Genre } from "@/types/global";
import { api } from "@/lib/api";
import GenreForm from "@/components/forms/GenreForm";
import GenreTable from "@/components/tables/GenreTable";

export default async function GenresPage() {
    const genres = await api.genres.getAll<Genre[]>();
    console.log("Genres:", genres);

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-semibold">Genres</h1>

            {/* Client Component only for mutation */}
            <GenreForm />

            <GenreTable genres={genres.data!} />
        </div>
    );
}
