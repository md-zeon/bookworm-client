import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Genre } from "@/types/global";
import EditGenreDialog from "../dialogs/EditGenreDialog";
import DeleteGenreDialog from "../dialogs/DeleteGenreDialog";

interface GenreTableProps {
    genres: Genre[];
}

export default function GenreTable({ genres }: GenreTableProps) {
    return (
        <div className="overflow-x-auto border rounded-lg shadow-sm">
            <Table className="min-w-100">
                <TableHeader>
                    <TableRow>
                        <TableHead className="text-left">Name</TableHead>
                        <TableHead className="text-left w-12">Edit</TableHead>
                        <TableHead className="text-left w-12">Delete</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {genres.map((genre) => (
                        <TableRow key={genre._id} className="hover:bg-gray-100 transition-colors">
                            <TableCell>{genre.name}</TableCell>
                            <TableCell className="flex gap-2">
                                <EditGenreDialog id={genre._id} currentName={genre.name} />
                            </TableCell>
                            <TableCell>
                                <DeleteGenreDialog id={genre._id} />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div >
    );
}
