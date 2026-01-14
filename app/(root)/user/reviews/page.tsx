"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { api } from "@/lib/api";
import { Review, Book } from "@/types/global";
import {
	Star,
	StarHalf,
	Edit,
	Trash2,
	Loader2,
	Search,
} from "lucide-react";
import { toast } from "sonner";

export default function ReviewsPage() {
	const [reviews, setReviews] = useState<Review[]>([]);
	const [books, setBooks] = useState<Book[]>([]);
	const [loading, setLoading] = useState(true);
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedBook, setSelectedBook] = useState<string>("");
	const [rating, setRating] = useState(0);
	const [reviewText, setReviewText] = useState("");
	const [editingReview, setEditingReview] = useState<string | null>(null);

	const fetchReviews = async () => {
		setLoading(true);
		try {
			const res = await api.reviews.getUserReviews<Review[]>();
			if (res.success && Array.isArray(res.data)) {
				setReviews(res.data);
			} else {
				toast.error("Error", { description: res.message || "Failed to fetch reviews" });
			}
		} catch (error: any) {
			toast.error("Error", { description: error.message || "Failed to fetch reviews" });
		} finally {
			setLoading(false);
		}
	};

	const fetchBooks = async () => {
		try {
			const res = await api.books.getAll();
			if (res.success) {
				setBooks(res.data || []);
			}
		} catch (error) {
			console.error("Failed to fetch books:", error);
		}
	};

	useEffect(() => {
		fetchReviews();
		fetchBooks();
	}, []);

	const handleSubmitReview = async () => {
		if (!selectedBook || rating === 0 || !reviewText.trim()) {
			toast.error("Error", { description: "Please fill all fields" });
			return;
		}

		try {
			const res = await api.reviews.submitReview(selectedBook, {
				rating,
				text: reviewText,
			});
			if (res.success) {
				toast.success("Review submitted successfully");
				setSelectedBook("");
				setRating(0);
				setReviewText("");
				fetchReviews();
			} else {
				toast.error("Error", { description: res.message });
			}
		} catch (error: any) {
			toast.error("Error", { description: error.message || "Failed to submit review" });
		}
	};

	const handleUpdateReview = async () => {
		if (!editingReview || rating === 0 || !reviewText.trim()) {
			toast.error("Error", { description: "Please fill all fields" });
			return;
		}

		try {
			const res = await api.reviews.updateReview(editingReview, {
				rating,
				text: reviewText,
			});
			if (res.success) {
				toast.success("Review updated successfully");
				setEditingReview(null);
				setSelectedBook("");
				setRating(0);
				setReviewText("");
				fetchReviews();
			} else {
				toast.error("Error", { description: res.message });
			}
		} catch (error) {
			toast.error("Error", { description: "Failed to update review" });
		}
	};

	const handleDeleteReview = async (reviewId: string) => {
		try {
			const res = await api.reviews.deleteReview(reviewId);
			if (res.success) {
				toast.success("Review deleted successfully");
				fetchReviews();
			} else {
				toast.error("Error", { description: res.message });
			}
		} catch (error) {
			toast.error("Error", { description: "Failed to delete review" });
		}
	};

	const handleEditReview = (review: Review) => {
		setEditingReview(review._id);
		setSelectedBook(review.bookId);
		setRating(review.rating);
		setReviewText(review.text);
	};

	const getStars = (rating: number) => {
		const stars = [];
		for (let i = 1; i <= 5; i++) {
			if (i <= rating) {
				stars.push(<Star key={i} className="h-4 w-4 text-yellow-500 fill-yellow-500" />);
			} else if (i - 0.5 === rating) {
				stars.push(<StarHalf key={i} className="h-4 w-4 text-yellow-500 fill-yellow-500" />);
			} else {
				stars.push(<Star key={i} className="h-4 w-4 text-gray-300" />);
			}
		}
		return stars;
	};

	const filteredReviews = reviews.filter((review) =>
		review.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
		review.user?.name.toLowerCase().includes(searchQuery.toLowerCase())
	);

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
					<h1 className="text-3xl font-bold">My Reviews</h1>
					<p className="text-muted-foreground">Manage your book reviews</p>
				</div>
			</div>

			<div className="grid gap-6 lg:grid-cols-3">
				{/* Review Form */}
				<Card className="lg:col-span-1">
					<CardHeader>
						<CardTitle>{editingReview ? "Edit Review" : "Write a Review"}</CardTitle>
						<CardDescription>
							{editingReview ? "Update your review" : "Share your thoughts about a book"}
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="book">Book</Label>
							<select
								id="book"
								value={selectedBook}
								onChange={(e) => setSelectedBook(e.target.value)}
								className="w-full p-2 border rounded-md"
								disabled={!!editingReview}
							>
								<option value="">Select a book</option>
								{books.map((book) => (
									<option key={book._id} value={book._id}>
										{book.title} by {book.author}
									</option>
								))}
							</select>
						</div>

						<div className="space-y-2">
							<Label>Rating</Label>
							<div className="flex gap-1">
								{[1, 2, 3, 4, 5].map((star) => (
									<button
										key={star}
										type="button"
										onClick={() => setRating(star)}
										className="focus:outline-none"
									>
										{star <= rating ? (
											<Star className="h-6 w-6 text-yellow-500 fill-yellow-500" />
										) : (
											<Star className="h-6 w-6 text-gray-300" />
										)}
									</button>
								))}
							</div>
						</div>

						<div className="space-y-2">
							<Label htmlFor="review">Review</Label>
							<Textarea
								id="review"
								placeholder="Write your review..."
								value={reviewText}
								onChange={(e) => setReviewText(e.target.value)}
								className="min-h-[120px]"
							/>
						</div>

						<div className="flex gap-2">
							<Button
								onClick={editingReview ? handleUpdateReview : handleSubmitReview}
								className="flex-1"
							>
								{editingReview ? "Update Review" : "Submit Review"}
							</Button>
							{editingReview && (
								<Button
									variant="outline"
									onClick={() => {
										setEditingReview(null);
										setSelectedBook("");
										setRating(0);
										setReviewText("");
									}}
								>
									Cancel
								</Button>
							)}
						</div>
					</CardContent>
				</Card>

				{/* Reviews List */}
				<Card className="lg:col-span-2">
					<CardHeader>
						<div className="flex items-center justify-between">
							<div>
								<CardTitle>My Reviews</CardTitle>
								<CardDescription>
									{reviews.length} review{reviews.length !== 1 ? "s" : ""}
								</CardDescription>
							</div>
							<div className="relative">
								<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
								<Input
									placeholder="Search reviews..."
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
									className="pl-10"
								/>
							</div>
						</div>
					</CardHeader>
					<CardContent>
						<ScrollArea className="h-[400px] pr-4">
							{filteredReviews.length === 0 ? (
								<div className="text-center py-8 text-muted-foreground">
									No reviews found
								</div>
							) : (
								<div className="space-y-4">
									{filteredReviews.map((review) => (
										<div key={review._id} className="border rounded-lg p-4">
											<div className="flex items-start justify-between mb-2">
												<div className="flex items-center gap-3">
													<div className="w-12 h-16 bg-gray-200 rounded">
														{/* Book cover would go here */}
													</div>
													<div>
														<h3 className="font-semibold">
															{review.user?.name || "Unknown User"}
														</h3>
														<div className="flex items-center gap-2">
															{getStars(review.rating)}
															<span className="text-sm text-muted-foreground">
																{review.rating}/5
															</span>
														</div>
													</div>
												</div>
												<div className="flex gap-2">
													<Button
														variant="outline"
														size="sm"
														onClick={() => handleEditReview(review)}
													>
														<Edit className="h-4 w-4 mr-1" />
														Edit
													</Button>
													<Button
														variant="outline"
														size="sm"
														onClick={() => handleDeleteReview(review._id)}
														className="text-red-600 hover:text-red-700"
													>
														<Trash2 className="h-4 w-4 mr-1" />
														Delete
													</Button>
												</div>
											</div>
											<p className="text-sm text-muted-foreground">{review.text}</p>
											<div className="flex items-center justify-between mt-2">
												<Badge variant="secondary">
													{review.status === "approved"
														? "Approved"
														: review.status === "pending"
															? "Pending"
															: "Rejected"}
												</Badge>
												<span className="text-xs text-muted-foreground">
													{new Date(review.createdAt).toLocaleDateString()}
												</span>
											</div>
										</div>
									))}
								</div>
							)}
						</ScrollArea>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
