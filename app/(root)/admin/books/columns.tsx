"use client"

import { ColumnDef } from "@tanstack/react-table"
import Image from "next/image"
import { MoreHorizontal, ArrowUpDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Book } from "@/types/global"
import { useRouter } from "next/navigation"

const ActionsCell = ({ book }: { book: Book }) => {
    const router = useRouter();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => router.push(`/admin/books/${book._id}/edit`)}>
                    Edit
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600">
                    Delete
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}



export const columns: ColumnDef<Book>[] = [
    {
        accessorKey: "coverImage",
        header: "Cover",
        cell: ({ row }) => (
            <Image
                src={row.getValue("coverImage")}
                alt="cover"
                width={40}
                height={60}
                className="rounded"
            />
        ),
    },
    {
        accessorKey: "title",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() =>
                    column.toggleSorting(column.getIsSorted() === "asc")
                }
            >
                Title
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
    },
    {
        accessorKey: "author",
        header: "Author",
    },
    {
        accessorKey: "averageRating",
        header: "Rating",
        cell: ({ row }) => `⭐ ${Number(row.getValue("averageRating")).toFixed(1)}`,
    },
    {
        accessorKey: "Actions",
        id: "actions",
        cell: ({ row }) => <ActionsCell book={row.original} />,
    },
]
