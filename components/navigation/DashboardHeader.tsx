"use client"
import { SidebarTrigger } from "../ui/sidebar"
import { Separator } from "../ui/separator"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "../ui/breadcrumb"
import { usePathname } from "next/navigation"
import Link from "next/link"
import React from "react"

const DashboardHeader = () => {
    const pathname = usePathname() || "/"
    const segments = pathname.split("/").filter(Boolean)

    const pathSegments = segments.map((segment, idx) => {
        const url = "/" + segments.slice(0, idx + 1).join("/")
        const label = segment.charAt(0).toUpperCase() + segment.slice(1)
        return { label, url }
    })

    return (
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
                <SidebarTrigger className="-ml-1" />
                <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
                <Breadcrumb>
                    <BreadcrumbList>
                        {pathSegments.map((seg, idx) => {
                            const isLast = idx === pathSegments.length - 1
                            return (
                                <React.Fragment key={seg.url}>
                                    <BreadcrumbItem className={isLast ? "" : "hidden md:block"}>
                                        {isLast ? (
                                            <BreadcrumbPage>{seg.label}</BreadcrumbPage>
                                        ) : (
                                            <Link href={seg.url}>{seg.label}</Link>
                                        )}
                                    </BreadcrumbItem>
                                    {!isLast && <BreadcrumbSeparator className="hidden md:block" />}
                                </React.Fragment>
                            )
                        })}
                    </BreadcrumbList>
                </Breadcrumb>
            </div>
        </header>
    )
}

export default DashboardHeader
