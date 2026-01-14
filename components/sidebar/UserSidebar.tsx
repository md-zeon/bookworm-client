"use client"

import * as React from "react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenuButton,
    SidebarRail,
} from "@/components/ui/sidebar"

import {
    LayoutDashboard,
    Library,
    Star,
    Users,
    BookText,
    Bookmark,
    Calendar,
} from "lucide-react"
import ROUTES from "@/constants/routes"
import Link from "next/link"
import { api } from "@/lib/api"

export const userData = {
    navMain: [
        {
            title: "Dashboard",
            url: ROUTES.USER.DASHBOARD,
            icon: LayoutDashboard,
            items: [],
        },
        {
            title: "Library",
            url: "/user/library",
            icon: Library,
            items: [
                {
                    title: "Want to Read",
                    url: "/user/library?shelf=wantToRead",
                },
                {
                    title: "Currently Reading",
                    url: "/user/library?shelf=currentlyReading",
                },
                {
                    title: "Read",
                    url: "/user/library?shelf=read",
                },
            ],
        },
        {
            title: "Browse Books",
            url: "/user/browse",
            icon: BookText,
            items: [],
        },
        {
            title: "My Reviews",
            url: "/user/reviews",
            icon: Star,
            items: [],
        },
        {
            title: "Reading Goals",
            url: "/user/goals",
            icon: Bookmark,
            items: [],
        },
        {
            title: "Recommendations",
            url: "/user/recommendations",
            icon: Calendar,
            items: [],
        },
        {
            title: "Profile",
            url: "/user/profile",
            icon: Users,
            items: [],
        },
    ],
}

export function UserSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const [user, setUser] = React.useState<{
        name: string
        email: string
        avatar: string
    }>({
        name: "User",
        email: "user@bookworm.com",
        avatar: "",
    })
    React.useEffect(() => {
        async function fetchUserData() {
            const response = await api.users.getCurrentUser();
            if (response.success) {
                if (response.data) {
                    setUser({
                        name: response.data.name,
                        email: response.data.email,
                        avatar: response.data.photoURL || "",
                    });
                }
            }
        }
        fetchUserData();
    }, []);
    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <SidebarMenuButton asChild tooltip="Bookworm">
                    <Link href={ROUTES.USER.DASHBOARD} className="flex items-center gap-2">
                        <Library className="w-5 h-5" />
                        <span>Bookworm</span>
                    </Link>
                </SidebarMenuButton>
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={userData.navMain} />
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={user} />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar >
    )
}
