import DashboardHeader from "@/components/navigation/DashboardHeader";
import { UserSidebar } from "@/components/sidebar/UserSidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { cookies } from "next/headers"
import React from "react"

const UserLayout = async ({ children }: { children: React.ReactNode }) => {
    const cookieStore = await cookies();
    const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

    return (
        <SidebarProvider defaultOpen={defaultOpen}>
            {/* User Sidebar */}
            <UserSidebar />
            <SidebarInset>
                <DashboardHeader />
                {/* User Content */}
                <main className="px-6">
                    {children}
                </main>
            </SidebarInset>
        </SidebarProvider>
    )
}

export default UserLayout
