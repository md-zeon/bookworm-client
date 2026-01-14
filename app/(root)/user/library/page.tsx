"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { api } from "@/lib/api";
import { UserLibrary } from "@/types/global";
import Image from "next/image";
import {
	BookOpen,
	Book,
	CheckCircle,
	BookMarked,
	Plus,
	Search,
	Loader2,
	Trash2,
} from "lucide-react";
import { toast } from "sonner";

export default function LibraryPage() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [library, setLibrary] = useState<UserLibrary[]>([]);
	const [loading, setLoading] = useState(true);
	const [searchQuery, setSearchQuery] = useState(searchParams.get("search") ?? "");
	const [activeTab, setActiveTab] = useState(searchParams.get("shelf") ?? "wantToRead");

	const updateURLParams = () => {
		const params = new URLSearchParams();
		if (searchQuery) params.set("search", searchQuery);
		if (activeTab !== "wantToRead") params.set("shelf", activeTab);
		router.push(`/user/library?${params.toString()}`);
	};

	const fetchLibrary = async () => {
		setLoading(true);
		try {
			const res = await api.library.getLibrary<UserLibrary[]>();
			if (res.success && Array.isArray(res.data)) {
				setLibrary(res.data);
			} else {
				toast.error("Error", { description: res.message || "Failed to fetch library" });
			}
		} catch (error) {
			toast.error("Error", { description: "Failed to fetch library" });
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchLibrary();
	}, []);

	useEffect(() => {
		updateURLParams();
	}, [searchQuery, activeTab]);

	const handleAddToLibrary = async (bookId: string, shelf: string) => {
		try {
			const res = await api.library.addToLibrary(bookId, { shelf });
			if (res.success) {
				toast.success("Book added to library");
				fetchLibrary();
			} else {
				toast.error("Error", { description: res.message });
			}
		} catch (error) {
			toast.error("Error", { description: "Failed to add book to library" });
		}
	};

	const handleUpdateProgress = async (bookId: string, progress: number) => {
		try {
			const res = await api.library.updateProgress(bookId, progress);
			if (res.success) {
				toast.success("Progress updated");
				fetchLibrary();
			} else {
				toast.error("Error", { description: res.message });
			}
		} catch (error) {
			toast.error("Error", { description: "Failed to update progress" });
		}
	};

	const handleRemoveFromLibrary = async (bookId: string) => {
		try {
			const res = await api.library.removeFromLibrary(bookId);
			if (res.success) {
				toast.success("Book removed from library");
				fetchLibrary();
			} else {
				toast.error("Error", { description: res.message });
			}
		} catch (error) {
			toast.error("Error", { description: "Failed to remove book from library" });
		}
	};

	const filteredLibrary = library.filter((item) =>
		item.book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
		item.book.author.toLowerCase().includes(searchQuery.toLowerCase())
	);

	const getShelfBooks = (shelf: string) =>
		filteredLibrary.filter((item) => item.shelf === shelf);

	const getProgressPercentage = (book: UserLibrary) => {
		return Math.round((book.progress / book.book.totalPages) * 100);
	};

	if (loading) {
		return (
			<div className="flex items-center justify-center h-64">
				<Loader2 className="h-8 w-8 animate-spin text-primary" />
			</div>
		);
	}

	return (
		<div className="container mx-auto py-8">
			<div className="flex items-center justify-between mb-6">
				<div>
					<h1 className="text-3xl font-bold">My Library</h1>
					<p className="text-muted-foreground">Track your reading journey</p>
				</div>
				<div className="flex gap-2">
					<div className="relative max-w-sm">
						<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
						<Input
							placeholder="Search books..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="pl-10"
						/>
					</div>
				</div>
			</div>

			<Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
				<TabsList className="grid w-full grid-cols-3">
					<TabsTrigger value="wantToRead">
						<BookMarked className="h-4 w-4 mr-2" />
						Want to Read
					</TabsTrigger>
					<TabsTrigger value="currentlyReading">
						<BookOpen className="h-4 w-4 mr-2" />
						Currently Reading
					</TabsTrigger>
					<TabsTrigger value="read">
						<CheckCircle className="h-4 w-4 mr-2" />
						Read
					</TabsTrigger>
				</TabsList>

				<TabsContent value="wantToRead">
					<LibraryShelf
						books={getShelfBooks("wantToRead")}
						onUpdateProgress={handleUpdateProgress}
						onRemove={handleRemoveFromLibrary}
						onMoveToReading={(bookId) => handleAddToLibrary(bookId, "currentlyReading")}
						onMarkAsRead={(bookId) => handleAddToLibrary(bookId, "read")}
					/>
				</TabsContent>

				<TabsContent value="currentlyReading">
					<LibraryShelf
						books={getShelfBooks("currentlyReading")}
						onUpdateProgress={handleUpdateProgress}
						onRemove={handleRemoveFromLibrary}
						onMarkAsRead={(bookId) => handleAddToLibrary(bookId, "read")}
						showProgress
					/>
				</TabsContent>

				<TabsContent value="read">
					<LibraryShelf
						books={getShelfBooks("read")}
						onRemove={handleRemoveFromLibrary}
						showProgress
						readOnly
					/>
				</TabsContent>
			</Tabs>
		</div>
	);
}

interface LibraryShelfProps {
	books: UserLibrary[];
	onUpdateProgress?: (bookId: string, progress: number) => void;
	onRemove?: (bookId: string) => void;
	onMoveToReading?: (bookId: string) => void;
	onMarkAsRead?: (bookId: string) => void;
	showProgress?: boolean;
	readOnly?: boolean;
}

function LibraryShelf({
	books,
	onUpdateProgress,
	onRemove,
	onMoveToReading,
	onMarkAsRead,
	showProgress = false,
	readOnly = false,
}: LibraryShelfProps) {
	if (books.length === 0) {
		return (
			<div className="text-center py-12">
				<Book className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
				<h3 className="text-lg font-semibold mb-2">No books in this shelf</h3>
				<p className="text-muted-foreground">Start adding books to your library!</p>
			</div>
		);
	}

	return (
		<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
			{books.map((item) => (
				<Card key={item._id} className="overflow-hidden">
					<div className="flex">
						<div className="w-24 flex-shrink-0">
							<Image
								src={item.book.coverImage}
								alt={item.book.title}
								width={96}
								height={144}
								className="object-cover h-full w-full"
							/>
						</div>
						<div className="flex-1 flex flex-col p-4">
							<div className="flex-1">
								<CardTitle className="text-lg mb-1">{item.book.title}</CardTitle>
								<CardDescription>{item.book.author}</CardDescription>
								<Badge variant="secondary" className="mt-2">
									{item.book.genre}
								</Badge>
								
								{showProgress && (
									<div className="mt-3">
										<div className="flex justify-between text-sm text-muted-foreground mb-1">
											<span>Progress</span>
											<span>{item.progress} / {item.book.totalPages} pages</span>
										</div>
										<Progress value={getProgressPercentage(item)} className="h-2" />
									</div>
								)}
							</div>

							{!readOnly && (
								<div className="flex gap-2 mt-3">
									{onUpdateProgress && (
										<Button
											variant="outline"
											size="sm"
											onClick={() => {
												const newProgress = Math.min(item.progress + 10, item.book.totalPages);
												onUpdateProgress(item.book._id, newProgress);
											}}
										>
											<Plus className="h-4 w-4 mr-1" />
											+10 pages
										</Button>
									)}
									
									{onMoveToReading && (
										<Button
											variant="outline"
											size="sm"
											onClick={() => onMoveToReading(item.book._id)}
										>
											<BookOpen className="h-4 w-4 mr-1" />
											Reading
										</Button>
									)}

									{onMarkAsRead && (
										<Button
											variant="outline"
											size="sm"
											onClick={() => onMarkAsRead(item.book._id)}
										>
											<CheckCircle className="h-4 w-4 mr-1" />
											Read
										</Button>
									)}

									{onRemove && (
										<Button
											variant="outline"
											size="sm"
											onClick={() => onRemove(item.book._id)}
											className="text-red-600 hover:text-red-700"
										>
											<Trash2 className="h-4 w-4 mr-1" />
											Remove
										</Button>
									)}
								</div>
							)}
						</div>
					</div>
				</Card>
			))}
		</div>
	);
}

function getProgressPercentage(book: UserLibrary) {
	return Math.round((book.progress / book.book.totalPages) * 100);
}
