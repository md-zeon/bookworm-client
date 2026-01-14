"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { api } from "@/lib/api";
import { Book, Genre, UserLibrary } from "@/types/global";
import Image from "next/image";
import {
	Search,
	Filter,
	BookOpen,
	Plus,
	Loader2,
	Star,
	BookMarked,
	CheckCircle,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

export default function BrowsePage() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [books, setBooks] = useState<Book[]>([]);
	const [genres, setGenres] = useState<Genre[]>([]);
	const [userLibrary, setUserLibrary] = useState<UserLibrary[]>([]);
	const [loading, setLoading] = useState(true);
	const [searchQuery, setSearchQuery] = useState(searchParams.get("search") ?? "");
	const [selectedGenre, setSelectedGenre] = useState(searchParams.get("genre") ?? "all");
	const [sortBy, setSortBy] = useState(searchParams.get("sortBy") ?? "title");
	const [sortOrder, setSortOrder] = useState(searchParams.get("sortOrder") ?? "asc");

	const fetchBooks = async () => {
		setLoading(true);
		try {
			// Fetch all data in parallel
			const [booksRes, genresRes, libraryRes] = await Promise.all([
				api.books.getAll<Book[]>(),
				api.genres.getAll<Genre[]>(),
				api.library.getLibrary<UserLibrary[]>()
			]);

			if (booksRes.success && Array.isArray(booksRes.data)) {
				setBooks(booksRes.data);
			} else {
				toast.error("Error", { description: booksRes.message || "Failed to fetch books" });
			}

			if (genresRes.success && Array.isArray(genresRes.data)) {
				setGenres(genresRes.data);
			} else {
				toast.error("Error", { description: genresRes.message || "Failed to fetch genres" });
			}

			if (libraryRes.success && Array.isArray(libraryRes.data)) {
				setUserLibrary(libraryRes.data);
			} else {
				toast.error("Error", { description: libraryRes.message || "Failed to fetch library" });
			}
		} catch (error) {
			toast.error("Error", { description: "Failed to fetch data" });
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchBooks();
	}, []);

	const updateURLParams = () => {
		const params = new URLSearchParams();
		if (searchQuery) params.set("search", searchQuery);
		if (selectedGenre !== "all") params.set("genre", selectedGenre);
		if (sortBy !== "title") params.set("sortBy", sortBy);
		if (sortOrder !== "asc") params.set("sortOrder", sortOrder);
		router.push(`/user/browse?${params.toString()}`);
	};

	useEffect(() => {
		updateURLParams();
	}, [searchQuery, selectedGenre, sortBy, sortOrder]);

	const handleAddToLibrary = async (bookId: string, shelf: string) => {
		try {
			const res = await api.library.addToLibrary(bookId, { shelf });
			if (res.success) {
				toast.success("Book added to library");
				fetchBooks(); // Refresh library status
			} else {
				toast.error("Error", { description: res.message });
			}
		} catch (error) {
			toast.error("Error", { description: "Failed to add book to library" });
		}
	};

	const handleViewDetails = (bookId: string) => {
		router.push(`/user/browse/${bookId}`);
	};

	const getBookStatus = (bookId: string): string | null => {
		const libraryItem = userLibrary.find(item => item.bookId === bookId);
		return libraryItem?.shelf ?? null;
	};

	const getBooksForDisplay = () => {
		const filteredBooks = books.filter(book => {
			const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
				book.author.toLowerCase().includes(searchQuery.toLowerCase());
			const matchesGenre = selectedGenre === "all" || book.genre === selectedGenre;
			return matchesSearch && matchesGenre;
		});

		// Sort books
		filteredBooks.sort((a, b) => {
			let comparison = 0;
			switch (sortBy) {
				case "title":
					comparison = a.title.localeCompare(b.title);
					break;
				case "author":
					comparison = a.author.localeCompare(b.author);
					break;
				case "rating":
					comparison = b.averageRating - a.averageRating;
					break;
				case "date":
					comparison = new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
					break;
			}
			return sortOrder === "asc" ? comparison : -comparison;
		});

		return filteredBooks;
	};

	const filteredBooks = getBooksForDisplay();
	const bookStatuses = new Map(books.map(book => [book._id, getBookStatus(book._id) ?? null]));

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
					<h1 className="text-3xl font-bold">Discover Books</h1>
					<p className="text-muted-foreground">Find your next great read</p>
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
					<Select value={sortBy} onValueChange={setSortBy}>
						<SelectTrigger className="w-[180px]">
							<SelectValue placeholder="Sort by" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="title">Sort by Title</SelectItem>
							<SelectItem value="author">Sort by Author</SelectItem>
							<SelectItem value="rating">Sort by Rating</SelectItem>
							<SelectItem value="date">Sort by Date</SelectItem>
						</SelectContent>
					</Select>
				</div>
			</div>

			<div className="space-y-4">
				{/* Genre Filter Tabs */}
				<Tabs value={selectedGenre} onValueChange={setSelectedGenre}>
					<TabsList className="grid w-full grid-cols-6 lg:grid-cols-8">
						<TabsTrigger value="all">
							<Filter className="h-4 w-4 mr-2" />
							All
						</TabsTrigger>
						{genres.slice(0, 7).map((genre) => (
							<TabsTrigger key={genre._id} value={genre.name}>
								{genre.name}
							</TabsTrigger>
						))}
					</TabsList>
				</Tabs>

				{/* Books Grid */}
				{filteredBooks.length > 0 ? (
					<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
						{filteredBooks.map((book) => (
							<BookCard
								key={book._id}
								book={book}
								status={bookStatuses.get(book._id) ?? null}
								onAddToLibrary={handleAddToLibrary}
								onViewDetails={handleViewDetails}
							/>
						))}
					</div>
				) : (
					<div className="text-center py-12">
						<BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
						<h3 className="text-lg font-semibold mb-2">No books found</h3>
						<p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
						{searchQuery || selectedGenre !== "all" ? (
							<Button
								variant="outline"
								onClick={() => {
									setSearchQuery("");
									setSelectedGenre("all");
								}}
								className="mt-4"
							>
								Clear Filters
							</Button>
						) : null}
					</div>
				)}
			</div>
		</div>
	);
}

interface BookCardProps {
	book: Book;
	status: string | null;
	onAddToLibrary: (bookId: string, shelf: string) => void;
	onViewDetails: (bookId: string) => void;
}

function BookCard({ book, status, onAddToLibrary, onViewDetails }: BookCardProps) {
	const [isAdding, setIsAdding] = useState(false);

	const handleAdd = async (shelf: string) => {
		setIsAdding(true);
		try {
			onAddToLibrary(book._id, shelf);
		} finally {
			setIsAdding(false);
		}
	};

	const getActionButtons = () => {
		if (status === "read") {
			return (
				<div className="flex gap-2">
					<Button
						variant="outline"
						size="sm"
						onClick={() => onViewDetails(book._id)}
						className="flex-1"
					>
						<BookMarked className="h-4 w-4 mr-2" />
						View Details
					</Button>
					<Button
						variant="secondary"
						size="sm"
						className="text-green-600"
					>
						<CheckCircle className="h-4 w-4" />
					</Button>
				</div>
			);
		}

		if (status === "currentlyReading") {
			return (
				<div className="flex gap-2">
					<Button
						variant="outline"
						size="sm"
						onClick={() => onViewDetails(book._id)}
						className="flex-1"
					>
						<BookMarked className="h-4 w-4 mr-2" />
						View Details
					</Button>
					<Button
						variant="secondary"
						size="sm"
						className="text-blue-600"
					>
						<BookOpen className="h-4 w-4" />
					</Button>
				</div>
			);
		}

		if (status === "wantToRead") {
			return (
				<div className="flex gap-2">
					<Button
						variant="outline"
						size="sm"
						onClick={() => onViewDetails(book._id)}
						className="flex-1"
					>
						<BookMarked className="h-4 w-4 mr-2" />
						View Details
					</Button>
					<Button
						variant="secondary"
						size="sm"
						className="text-orange-600"
					>
						<Plus className="h-4 w-4" />
					</Button>
				</div>
			);
		}

		return (
			<div className="grid grid-cols-3 gap-2">
				<Button
					variant="outline"
					size="sm"
					onClick={() => handleAdd("wantToRead")}
					disabled={isAdding}
					className="text-orange-600 border-orange-600 hover:bg-orange-600 hover:text-white"
				>
					Want
				</Button>
				<Button
					variant="outline"
					size="sm"
					onClick={() => handleAdd("currentlyReading")}
					disabled={isAdding}
					className="text-blue-600 border-blue-600 hover:bg-blue-600 hover:text-white"
				>
					Reading
				</Button>
				<Button
					variant="outline"
					size="sm"
					onClick={() => handleAdd("read")}
					disabled={isAdding}
					className="text-green-600 border-green-600 hover:bg-green-600 hover:text-white"
				>
					Read
				</Button>
			</div>
		);
	};

	return (
		<Link href={`/user/browse/${book._id}`}>
			<Card className="overflow-hidden group hover:shadow-lg transition-shadow">
				<div className="relative aspect-3/4">
					<Image
						src={book.coverImage}
						alt={book.title}
						fill
						className="object-cover group-hover:scale-105 transition-transform duration-300"
					/>
					<div className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-sm">
						{book.averageRating.toFixed(1)}
						<Star className="inline h-3 w-3 ml-1 text-yellow-400" />
					</div>
				</div>

				<CardContent className="p-4">
					<CardTitle className="text-lg mb-1 line-clamp-2">{book.title}</CardTitle>
					<CardDescription className="text-sm text-muted-foreground mb-2">{book.author}</CardDescription>

					<div className="flex items-center gap-2 mb-3">
						<Badge variant="secondary">{book.genre}</Badge>
						<span className="text-xs text-muted-foreground">{book.totalPages} pages</span>
					</div>

					{getActionButtons()}
				</CardContent>
			</Card>
		</Link>
	);
}
