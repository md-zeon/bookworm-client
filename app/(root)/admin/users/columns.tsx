import { ColumnDef } from "@tanstack/react-table";
import { User } from "@/types/global";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { DeleteUserDialog } from "@/components/dialogs/DeleteUserDialog";
import { useState } from "react";

const ActionsCell = ({ user }: { user: User }) => {
    const router = useRouter();
    const [open, setOpen] = useState(false);

    const handleRoleChange = async () => {
        const newRole = user.role === "user" ? "admin" : "user";
        try {
            const res = await api.users.updateRole({ id: user._id, role: newRole });
            if (!res.success) toast.error("Error", { description: res.message });
            else {
                toast.success("Role updated");
                router.refresh();
            }
        } catch (err: any) {
            toast.error("Error", { description: err.message });
        }
    };

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={handleRoleChange}>
                        {user.role === "user" ? "Promote to admin" : "Demote to user"}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-600" onClick={() => setOpen(true)}>
                        Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <DeleteUserDialog id={user._id} open={open} onOpenChange={setOpen} />
        </>
    );
};

export const userColumns: ColumnDef<User>[] = [
    { accessorKey: "name", header: "Name" },
    { accessorKey: "email", header: "Email" },
    { accessorKey: "role", header: "Role" },
    {
        accessorKey: "actions",
        id: "actions",
        cell: ({ row }) => <ActionsCell user={row.original} />,
    },
];
