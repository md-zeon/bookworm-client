import { Genre } from "@/types/global";

export default function GenreTable({ genres }: { genres: Genre[] }) {
    return (
        <table className="w-full border rounded">
            <thead>
                <tr className="border-b">
                    <th className="p-2 text-left">Name</th>
                </tr>
            </thead>
            <tbody>
                {genres.map((genre) => (
                    <tr key={genre._id} className="border-b">
                        <td className="p-2">{genre.name}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
