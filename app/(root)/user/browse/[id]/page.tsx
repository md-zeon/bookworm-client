"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { api } from "@/lib/api";
import { Book, UserLibrary, Review } from "@/types/global";
import Image from "next/image";
import {
	BookOpen,
	BookMarked,
	Plus,
	Star,
	Loader2,
	Trash2,
	Edit,
	BookText,
	User,
	Calendar,
	CheckCircle,
} from "lucide-react";
import { toast } from "sonner";

export default function BookDetailsPage() {
	const router = useRouter();
	const params = useParams();
	const bookId = params.id as string;

	const [book, setBook] = useState<Book | null>(null);
	const [userLibrary, setUserLibrary] = useState<UserLibrary | null>(null);
	const [reviews, setReviews] = useState<Review[]>([]);
	const [loading, setLoading] = useState(true);
	const [isAdding, setIsAdding] = useState(false);
	const [isSubmittingReview, setIsSubmittingReview] = useState(false);
	const [reviewText, setReviewText] = useState("");
	const [rating, setRating] = useState(0);

	const fetchBookDetails = async () => {
		setLoading(true);
		try {
			const [bookRes, libraryRes, reviewsRes] = await Promise.all([
				api.books.getById<Book>(bookId),
				api.library.getLibrary<UserLibrary[]>(),
				api.reviews.getBookReviews<Review[]>(bookId),
			]);

			const bookData = bookRes.data;
			const libraryData = libraryRes.data;
			const reviewsData = reviewsRes.data;

			if (bookRes.success && bookData) {
				setBook(bookData);
			} else {
				toast.error("Error", { description: "Failed to fetch book details" });
				// router.push("/user/browse");
				return;
			}

			if (libraryRes.success && Array.isArray(libraryData)) {
				const libraryItem = libraryData.find((item: UserLibrary) => item.bookId === bookId);
				setUserLibrary(libraryItem || null);
			}

			if (reviewsRes.success && Array.isArray(reviewsData)) {
				setReviews(reviewsData);
			}
		} catch (error: unknown) {
			const errorMessage = error instanceof Error ? error.message : "Failed to fetch book details";
			toast.error("Error", { description: errorMessage });
			router.push("/user/browse");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (bookId) {
			fetchBookDetails();
		}
	}, [bookId]);

	const handleAddToLibrary = async (shelf: string) => {
		setIsAdding(true);
		try {
			const res = await api.library.addToLibrary(bookId, { shelf });

			if (!res.success) {
				throw new Error('Failed to add book to library');
			}

			toast.success("Book added to library");
			fetchBookDetails();
		} catch (error: unknown) {
			const errorMessage = error instanceof Error ? error.message : "Failed to add book to library";
			toast.error("Error", { description: errorMessage });
		} finally {
			setIsAdding(false);
		}
	};

	const handleUpdateProgress = async (progress: number) => {
		try {
			const res = await api.library.updateProgress(bookId, progress);

			if (!res.success) {
				throw new Error('Failed to update progress');
			}

			toast.success("Progress updated");
			fetchBookDetails();
		} catch (error: unknown) {
			const errorMessage = error instanceof Error ? error.message : "Failed to update progress";
			toast.error("Error", { description: errorMessage });
		}
	};

	const handleSubmitReview = async () => {
		if (!reviewText.trim() || rating === 0) {
			toast.error("Error", { description: "Please provide a review and rating" });
			return;
		}

		setIsSubmittingReview(true);
		try {
			const response = await api.reviews.submitReview(bookId, { rating, text: reviewText });

			if (!response.success) {
				throw new Error('Failed to submit review');
			}

			toast.success("Review submitted successfully");
			setReviewText("");
			setRating(0);
			fetchBookDetails();
		} catch (error: unknown) {
			const errorMessage = error instanceof Error ? error.message : "Failed to submit review";
			toast.error("Error", { description: errorMessage });
		} finally {
			setIsSubmittingReview(false);
		}
	};

	const handleDeleteReview = async (reviewId: string) => {
		try {
			const res = await api.reviews.deleteReview<null>(reviewId);

			if (!res.success) {
				throw new Error('Failed to delete review');
			}

			toast.success("Review deleted");
			fetchBookDetails();
		} catch (error) {
			toast.error("Error", { description: "Failed to delete review" });
		}
	};

	const getProgressPercentage = () => {
		if (!book || !userLibrary) return 0;
		return Math.round((userLibrary.progress / book.totalPages) * 100);
	};

	const getActionButtons = () => {
		if (!book) return null;

		if (userLibrary?.shelf === "read") {
			return (
				<div className="flex gap-2">
					<Button
						variant="outline"
						onClick={() => handleAddToLibrary("wantToRead")}
						className="text-orange-600 border-orange-600 hover:bg-orange-600 hover:text-white"
					>
						<BookMarked className="h-4 w-4 mr-2" />
						Read Again
					</Button>
					<Button
						variant="secondary"
						className="text-green-600"
					>
						<CheckCircle className="h-4 w-4 mr-2" />
						Completed
					</Button>
				</div>
			);
		}

		if (userLibrary?.shelf === "currentlyReading") {
			return (
				<div className="flex gap-2">
					<Button
						variant="outline"
						onClick={() => handleAddToLibrary("read")}
						className="text-green-600 border-green-600 hover:bg-green-600 hover:text-white"
					>
						<CheckCircle className="h-4 w-4 mr-2" />
						Mark as Read
					</Button>
					<Button
						variant="outline"
						onClick={() => {
							const newProgress = Math.min(userLibrary.progress + 10, book.totalPages);
							handleUpdateProgress(newProgress);
						}}
						className="text-blue-600 border-blue-600 hover:bg-blue-600 hover:text-white"
					>
						<Plus className="h-4 w-4 mr-2" />
						+10 Pages
					</Button>
				</div>
			);
		}

		if (userLibrary?.shelf === "wantToRead") {
			return (
				<div className="flex gap-2">
					<Button
						variant="outline"
						onClick={() => handleAddToLibrary("currentlyReading")}
						className="text-blue-600 border-blue-600 hover:bg-blue-600 hover:text-white"
					>
						<BookOpen className="h-4 w-4 mr-2" />
						Start Reading
					</Button>
					<Button
						variant="secondary"
						className="text-orange-600"
					>
						<BookMarked className="h-4 w-4 mr-2" />
						Want to Read
					</Button>
				</div>
			);
		}

		return (
			<div className="grid grid-cols-3 gap-2">
				<Button
					variant="outline"
					onClick={() => handleAddToLibrary("wantToRead")}
					disabled={isAdding}
					className="text-orange-600 border-orange-600 hover:bg-orange-600 hover:text-white"
				>
					Want
				</Button>
				<Button
					variant="outline"
					onClick={() => handleAddToLibrary("currentlyReading")}
					disabled={isAdding}
					className="text-blue-600 border-blue-600 hover:bg-blue-600 hover:text-white"
				>
					Reading
				</Button>
				<Button
					variant="outline"
					onClick={() => handleAddToLibrary("read")}
					disabled={isAdding}
					className="text-green-600 border-green-600 hover:bg-green-600 hover:text-white"
				>
					Read
				</Button>
			</div>
		);
	};

	if (loading) {
		return (
			<div className="flex items-center justify-center h-64">
				<Loader2 className="h-8 w-8 animate-spin text-primary" />
			</div>
		);
	}

	if (!book) {
		return (
			<div className="text-center py-12">
				<BookText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
				<h3 className="text-lg font-semibold mb-2">Book not found</h3>
				<p className="text-muted-foreground">The book you&apos;re looking for doesn&apos;t exist</p>
				<Button onClick={() => router.push("/user/browse")} className="mt-4">
					Back to Browse
				</Button>
			</div>
		);
	}

	return (
		<div className="container mx-auto py-8">
			<div className="grid md:grid-cols-3 gap-8">
				{/* Book Cover Section */}
				<div className="md:col-span-1">
					<Card className="overflow-hidden">
						<div className="relative aspect-[2/3]">
							<Image
								src={book.coverImage}
								alt={book.title}
								fill
								className="object-cover"
							/>
						</div>
						<CardContent className="p-6">
							<div className="flex items-center gap-2 mb-2">
								<Badge variant="secondary">{book.genre}</Badge>
								<div className="flex items-center gap-1 text-yellow-600">
									<Star className="h-4 w-4" />
									<span className="font-semibold">{book.averageRating.toFixed(1)}</span>
								</div>
							</div>
							<div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
								<div className="flex items-center gap-1">
									<BookText className="h-4 w-4" />
									<span>{book.totalPages} pages</span>
								</div>
							</div>
							{getActionButtons()}
						</CardContent>
					</Card>
				</div>

				{/* Book Details Section */}
				<div className="md:col-span-2 space-y-6">
					<Card>
						<CardHeader>
							<CardTitle className="text-2xl">{book.title}</CardTitle>
							<CardDescription className="text-lg">{book.author}</CardDescription>
						</CardHeader>
						<CardContent>
							<p className="text-muted-foreground leading-relaxed">{book.description || "No description available."}</p>
						</CardContent>
					</Card>

					{/* Progress Section */}
					{userLibrary && (
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<BookOpen className="h-5 w-5" />
									Reading Progress
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="space-y-2">
									<div className="flex justify-between text-sm">
										<span>Progress</span>
										<span>{userLibrary.progress} / {book.totalPages} pages</span>
									</div>
									<Progress value={getProgressPercentage()} className="h-2" />
									<div className="flex justify-between text-xs text-muted-foreground">
										<span>{getProgressPercentage()}% complete</span>
										<span>{book.totalPages - userLibrary.progress} pages remaining</span>
									</div>
								</div>
							</CardContent>
						</Card>
					)}

					{/* Reviews Section */}
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Star className="h-5 w-5" />
								Reviews ({reviews.length})
							</CardTitle>
						</CardHeader>
						<CardContent>
							{/* Submit Review Form */}
							{!userLibrary ? (
								<div className="text-center py-4 text-muted-foreground">
									Add this book to your library to write a review
								</div>
							) : (
								<div className="space-y-4">
									<div className="grid gap-2">
										<label className="text-sm font-medium">Your Rating</label>
										<div className="flex gap-1">
											{[1, 2, 3, 4, 5].map((star) => (
												<Button
													key={star}
													variant="ghost"
													size="sm"
													onClick={() => setRating(star)}
													className={rating >= star ? "text-yellow-500" : "text-muted-foreground"}
												>
													<Star className="h-5 w-5" />
												</Button>
											))}
										</div>
									</div>
									<div className="grid gap-2">
										<label className="text-sm font-medium">Your Review</label>
										<textarea
											value={reviewText}
											onChange={(e) => setReviewText(e.target.value)}
											placeholder="Share your thoughts about this book..."
											className="w-full p-3 border rounded-md resize-none min-h-[100px]"
										/>
									</div>
									<Button
										onClick={handleSubmitReview}
										disabled={isSubmittingReview || !reviewText.trim() || rating === 0}
										className="w-full"
									>
										{isSubmittingReview ? "Submitting..." : "Submit Review"}
									</Button>
								</div>
							)}

							{/* Reviews List */}
							{reviews.length > 0 && (
								<div className="mt-6 space-y-4">
									<Separator />
									{reviews.map((review) => (
										<div key={review._id} className="space-y-2">
											<div className="flex items-center justify-between">
												<div className="flex items-center gap-2">
													<div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
														<User className="h-4 w-4" />
													</div>
													<div>
														<div className="font-medium">{review.user?.name || "Anonymous"}</div>
														<div className="text-xs text-muted-foreground flex items-center gap-1">
															<Calendar className="h-3 w-3" />
															{new Date(review.createdAt).toLocaleDateString()}
														</div>
													</div>
												</div>
												<div className="flex items-center gap-1 text-yellow-600">
													<Star className="h-4 w-4" />
													<span className="font-semibold">{review.rating}</span>
												</div>
											</div>
											<p className="text-sm text-muted-foreground">{review.text}</p>
											{review.user?._id === "current-user-id" && (
												<div className="flex gap-2">
													<Button variant="outline" size="sm" className="text-blue-600">
														<Edit className="h-4 w-4 mr-1" />
														Edit
													</Button>
													<Button variant="outline" size="sm" className="text-red-600" onClick={() => handleDeleteReview(review._id)}>
														<Trash2 className="h-4 w-4 mr-1" />
														Delete
													</Button>
												</div>
											)}
										</div>
									))}
								</div>
							)}
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
