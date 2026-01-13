import DashboardHeader from "@/components/navigation/DashboardHeader";
import { AdminSidebar } from "@/components/sidebar/AdminSidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { cookies } from "next/headers"
import React from "react"

const AdminLayout = async ({ children }: { children: React.ReactNode }) => {
    const cookieStore = await cookies();
    const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

    return (
        <SidebarProvider defaultOpen={defaultOpen}>
            {/* Dashboard Sidebar */}
            <AdminSidebar />
            <SidebarInset>
                <DashboardHeader />
                {/* Dashboard Content */}
                {children}
            </SidebarInset>
        </SidebarProvider>
    )
}

export default AdminLayout