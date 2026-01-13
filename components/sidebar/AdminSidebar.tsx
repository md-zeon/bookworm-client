"use client"

import * as React from "react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarRail,
} from "@/components/ui/sidebar"

import {
    LayoutDashboard,
    BookOpen,
    Users,
    Tags,
    MessageSquareQuote,
    Youtube,
    Settings,
    Library,
} from "lucide-react"

export const data = {
    user: {
        name: "Admin",
        email: "admin@bookworm.app",
        avatar: "/avatars/admin.png",
    },

    navMain: [
        {
            title: "Dashboard",
            url: "/admin/dashboard",
            icon: LayoutDashboard,
            items: [],
        },
        {
            title: "Books",
            url: "/admin/books",
            icon: BookOpen,
            items: [
                {
                    title: "All Books",
                    url: "/admin/books",
                },
                {
                    title: "Add Book",
                    url: "/admin/books/new",
                },
            ],
        },
        {
            title: "Genres",
            url: "/admin/genres",
            icon: Tags,
            items: [],
        },
        {
            title: "Reviews",
            url: "/admin/reviews",
            icon: MessageSquareQuote,
            items: [],
        },
        {
            title: "Tutorials",
            url: "/admin/tutorials",
            icon: Youtube,
            items: [],
        },
        {
            title: "Users",
            url: "/admin/users",
            icon: Users,
            items: [],
        },
        {
            title: "Settings",
            url: "/admin/settings",
            icon: Settings,
            items: [],
        },
    ],
}

export function AdminSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <h1 className="font-bold text-xl flex items-center gap-2"><Library className="size-5" /> Bookworm</h1>
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={data.navMain} />
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={data.user} />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}
