"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { DataTable } from "@/components/ui/data-table";
import { User } from "@/types/global";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { userColumns } from "./columns";

export default function ManageUsersPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await api.users.getAll();
            if (!res.success) toast.error("Error", { description: res.message });
            else setUsers(res.data!);
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
            toast.error("Error", { description: errorMessage });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleSearch = (searchValue: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (searchValue) {
            params.set("search", searchValue);
        } else {
            params.delete("search");
        }
        router.push(`/admin/users?${params.toString()}`);
    };

    const handleSort = (columnId: string, direction: "asc" | "desc") => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("sortBy", columnId);
        params.set("sortOrder", direction);
        router.push(`/admin/users?${params.toString()}`);
    };

    const handlePageChange = (pageIndex: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", pageIndex.toString());
        router.push(`/admin/users?${params.toString()}`);
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Manage Users</h1>
            <DataTable 
                columns={userColumns} 
                data={users} 
                isLoading={loading} 
                searchKeys={["name", "email"]} 
                pageSize={10}
            />
        </div>
    );
}
