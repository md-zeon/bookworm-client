"use client";

import { Button } from "@/components/ui/button";
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
    FieldLegend,
    FieldSeparator,
    FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/lib/api";
import { uploadImage } from "@/lib/upload";
import { Book, Genre } from "@/types/global";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Props {
    book: Book;
    genres: Genre[];
}

const EditBookForm = ({ book, genres }: Props) => {
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const formData = new FormData(e.currentTarget);

            const title = formData.get("title") as string;
            const author = formData.get("author") as string;
            const genre = formData.get("genre") as string;
            const description = formData.get("description") as string;
            const totalPages = Number(formData.get("totalPages"));
            const coverImage = formData.get("coverImage") as File;

            let coverImageUrl = book.coverImage;

            // Upload new image only if user selected one
            if (coverImage && coverImage.size > 0) {
                coverImageUrl = await uploadImage(coverImage);
            }

            await api.books.update(book._id, {
                title,
                author,
                genre,
                description,
                totalPages,
                coverImage: coverImageUrl,
            });

            toast.success("Book updated successfully");
            router.push("/admin/books");
            router.refresh();
        } catch (error) {
            toast.error("Failed to update book");
            console.error(error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <FieldGroup>
                {/* Book Info */}
                <FieldSet>
                    <FieldLegend>Edit Book</FieldLegend>
                    <FieldDescription>
                        Update book information
                    </FieldDescription>

                    <FieldGroup>
                        <Field>
                            <FieldLabel>Title</FieldLabel>
                            <Input
                                name="title"
                                defaultValue={book.title}
                                required
                            />
                        </Field>

                        <Field>
                            <FieldLabel>Author</FieldLabel>
                            <Input
                                name="author"
                                defaultValue={book.author}
                                required
                            />
                        </Field>

                        <Field>
                            <FieldLabel>Genre</FieldLabel>
                            <Select name="genre" defaultValue={book.genre}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select genre" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Genres</SelectLabel>
                                        {genres.map((genre) => (
                                            <SelectItem
                                                key={genre._id}
                                                value={genre.name}
                                            >
                                                {genre.name}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </Field>
                    </FieldGroup>
                </FieldSet>

                <FieldSeparator />

                {/* Details */}
                <FieldSet>
                    <FieldLegend>Details</FieldLegend>

                    <FieldGroup>
                        <Field>
                            <FieldLabel>Description</FieldLabel>
                            <Textarea
                                name="description"
                                defaultValue={book.description}
                                className="resize-none"
                            />
                        </Field>

                        <Field>
                            <FieldLabel>Cover Image</FieldLabel>
                            <Input name="coverImage" type="file" />
                            <FieldDescription>
                                Leave empty to keep existing image
                            </FieldDescription>
                        </Field>

                        <Field>
                            <FieldLabel>Total Pages</FieldLabel>
                            <Input
                                name="totalPages"
                                type="number"
                                min={1}
                                defaultValue={book.totalPages}
                                required
                            />
                        </Field>
                    </FieldGroup>
                </FieldSet>

                {/* Actions */}
                <Field orientation="horizontal" className="pt-4">
                    <Button type="submit">Update Book</Button>
                    <Link href="/admin/books">
                        <Button type="button" variant="outline">
                            Cancel
                        </Button>
                    </Link>
                </Field>
            </FieldGroup>
        </form>
    );
};

export default EditBookForm;