import { columns } from "./columns"
import { DataTable } from "@/components/ui/data-table";
import { api } from "@/lib/api"

export default async function BooksPage() {
    const { data: books } = await api.books.getAll();

    return (
        <div className="container mx-auto py-8">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Book Management</h1>
            </div>

            <DataTable columns={columns} data={books!} pageSize={10} searchKeys={["title", "author"]} />
        </div>
    )
}
