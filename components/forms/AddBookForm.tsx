"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

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
import { Genre } from "@/types/global";
import Link from "next/link";

type Props = {
    genres: Genre[];
};

const AddBookForm = ({ genres }: Props) => {
    const router = useRouter();
    const [genre, setGenre] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!genre) {
            toast.error("Please select a genre");
            return;
        }

        const formData = new FormData(e.currentTarget);

        const title = formData.get("title") as string;
        const author = formData.get("author") as string;
        const description = formData.get("description") as string;
        const coverImage = formData.get("coverImage") as File;
        const totalPages = Number(formData.get("totalPages"));

        if (!coverImage || coverImage.size === 0) {
            toast.error("Please upload a cover image");
            return;
        }

        try {
            setLoading(true);
            toast.loading("Adding book...");

            const coverImageUrl = await uploadImage(coverImage);

            await api.books.create({
                title,
                author,
                genre,
                description,
                coverImage: coverImageUrl,
                totalPages,
            });

            toast.success("Book added successfully");
            router.push("/admin/books");
            router.refresh();
        } catch (error) {
            console.error(error);
            toast.error("Failed to add book");
        } finally {
            setLoading(false);
            toast.dismiss();
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <FieldGroup>
                {/* Book Info */}
                <FieldSet>
                    <FieldLegend>Book Information</FieldLegend>
                    <FieldDescription>
                        Enter the basic details of the book
                    </FieldDescription>

                    <FieldGroup>
                        <Field>
                            <FieldLabel htmlFor="title">Title</FieldLabel>
                            <Input
                                id="title"
                                name="title"
                                placeholder="The Great Gatsby"
                                required
                            />
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="author">Author</FieldLabel>
                            <Input
                                id="author"
                                name="author"
                                placeholder="F. Scott Fitzgerald"
                                required
                            />
                        </Field>

                        <Field>
                            <FieldLabel>Genre</FieldLabel>
                            <Select value={genre} onValueChange={setGenre}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a genre" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Genres</SelectLabel>
                                        {genres.map((g) => (
                                            <SelectItem
                                                key={g._id}
                                                value={g.name}
                                            >
                                                {g.name}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </Field>
                    </FieldGroup>
                </FieldSet>

                <FieldSeparator />

                {/* Book Details */}
                <FieldSet>
                    <FieldLegend>Book Details</FieldLegend>
                    <FieldDescription>
                        Additional information about the book
                    </FieldDescription>

                    <FieldGroup>
                        <Field>
                            <FieldLabel htmlFor="description">
                                Description
                            </FieldLabel>
                            <Textarea
                                id="description"
                                name="description"
                                placeholder="Write a short description..."
                                className="resize-none"
                            />
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="coverImage">
                                Cover Image
                            </FieldLabel>
                            <Input
                                id="coverImage"
                                name="coverImage"
                                type="file"
                                accept="image/*"
                                required
                            />
                            <FieldDescription>
                                Upload book cover image
                            </FieldDescription>
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="totalPages">
                                Total Pages
                            </FieldLabel>
                            <Input
                                id="totalPages"
                                name="totalPages"
                                type="number"
                                min={1}
                                placeholder="300"
                                required
                            />
                        </Field>
                    </FieldGroup>
                </FieldSet>

                {/* Actions */}
                <Field orientation="horizontal" className="pt-4 gap-3">
                    <Button type="submit" disabled={loading}>
                        {loading ? "Adding..." : "Add Book"}
                    </Button>

                    <Link href="/admin/books">
                        <Button variant="outline" type="button">
                            Cancel
                        </Button>
                    </Link>
                </Field>
            </FieldGroup>
        </form>
    );
};

export default AddBookForm;
