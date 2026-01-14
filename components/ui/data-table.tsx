"use client";

import { ColumnDef, flexRender, getCoreRowModel, getSortedRowModel, SortingState, useReactTable } from "@tanstack/react-table";
import { useEffect, useMemo, useState } from "react";
import { Skeleton } from "./skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./table";

interface DataTableProps<T> {
    columns: ColumnDef<T>[];
    data: T[];
    isLoading?: boolean;
    searchKeys?: (keyof T)[]; // support multiple columns
    pageSize?: number; // client-side pagination
}

export function DataTable<T>({
    columns,
    data,
    isLoading = false,
    searchKeys = [],
    pageSize = 5,
}: DataTableProps<T>) {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState(search);
    const [pageIndex, setPageIndex] = useState(0);

    // Debounce search
    useEffect(() => {
        const timeout = setTimeout(() => setDebouncedSearch(search), 300);
        return () => clearTimeout(timeout);
    }, [search]);

    // Filtered data
    const filteredData = useMemo(() => {
        if (!searchKeys.length || !debouncedSearch) return data;
        const lower = debouncedSearch.toLowerCase();
        return data.filter(item =>
            searchKeys.some(key => {
                const value = item[key];
                if (value === undefined || value === null) return false;
                return String(value).toLowerCase().includes(lower);
            })
        );
    }, [data, debouncedSearch, searchKeys]);

    // Paginated data
    const paginatedData = useMemo(() => {
        if (!pageSize) return filteredData;
        const start = pageIndex * pageSize;
        return filteredData.slice(start, start + pageSize);
    }, [filteredData, pageIndex, pageSize]);

    // Create table instance
    const table = useReactTable({
        data: paginatedData,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        state: { sorting },
        onSortingChange: setSorting,
    });

    // Total pages for pagination
    const pageCount = pageSize ? Math.ceil(filteredData.length / pageSize) : 1;

    return (
        <>
            {/* Search Bar */}
            {searchKeys.length > 0 && (
                <input
                    type="text"
                    placeholder={`Search...`}
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="mb-2 p-2 border rounded w-full"
                />
            )}

            {/* Loading Skeleton */}
            {isLoading ? (
                <div className="w-full space-y-2">
                    {[...Array(5)].map((_, i) => (
                        <Skeleton key={i} className="h-10 w-full rounded" />
                    ))}
                </div>
            ) : (
                <>
                    <Table>
                        <TableHeader>
                            {table.getHeaderGroups().map(headerGroup => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map(header => (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    ))}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {table.getRowModel().rows.map(row => (
                                <TableRow key={row.id}>
                                    {row.getVisibleCells().map(cell => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    {/* Pagination Controls */}
                    {pageSize > 0 && pageCount > 1 && (
                        <div className="flex justify-end items-center gap-2 mt-2 flex-wrap">
                            {/* Previous Button */}
                            <button
                                className="px-2 py-1 border rounded disabled:opacity-50"
                                disabled={pageIndex === 0}
                                onClick={() => setPageIndex(prev => Math.max(prev - 1, 0))}
                            >
                                Previous
                            </button>

                            {/* Page Numbers */}
                            {Array.from({ length: pageCount }, (_, i) => (
                                <button
                                    key={i}
                                    className={`px-2 py-1 border rounded ${i === pageIndex ? "bg-primary" : "hover:bg-gray-200"
                                        }`}
                                    onClick={() => setPageIndex(i)}
                                >
                                    {i + 1}
                                </button>
                            ))}

                            {/* Next Button */}
                            <button
                                className="px-2 py-1 border rounded disabled:opacity-50"
                                disabled={pageIndex >= pageCount - 1}
                                onClick={() => setPageIndex(prev => Math.min(prev + 1, pageCount - 1))}
                            >
                                Next
                            </button>
                        </div>
                    )}

                </>
            )}
        </>
    );
}
