"use client";

import { useEffect, useState } from "react";
import { DataTable } from "@/components/ui/data-table";
import { User } from "@/types/global";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { userColumns } from "./columns";

export default function ManageUsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchUsers = async () => {
        try {
            const res = await api.users.getAll();
            if (!res.success) toast.error("Error", { description: res.message });
            else setUsers(res.data!);
        } catch (err: any) {
            toast.error("Error", { description: err.message });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Manage Users</h1>
            <DataTable columns={userColumns} data={users} isLoading={loading} searchKeys={["name", "email"]} pageSize={10} />
        </div>
    );
}
