"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/api";
import { Review } from "@/types/global";
import { toast } from "sonner";
import {
	Star,
	BookText,
	User,
	Calendar,
	Loader2,
	CheckCircle,
	XCircle,
	Eye,
} from "lucide-react";

export default function AdminReviewsPage() {
	const [reviews, setReviews] = useState<Review[]>([]);
	const [loading, setLoading] = useState(true);

	const fetchReviews = async () => {
		setLoading(true);
		try {
			const res = await api.adminReviews.getPendingReviews();
			if (res.success && Array.isArray(res.data)) {
				setReviews(res.data);
			} else {
				toast.error("Error", { description: res.message });
			}
		} catch (error) {
			toast.error("Error", { description: "Failed to fetch reviews" });
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchReviews();
	}, []);

	const handleApproveReview = async (reviewId: string) => {
		try {
			const res = await api.adminReviews.approveReview(reviewId);
			if (res.success) {
				toast.success("Review approved");
				fetchReviews();
			} else {
				toast.error("Error", { description: res.message });
			}
		} catch (error) {
			toast.error("Error", { description: "Failed to approve review" });
		}
	};

	const handleRejectReview = async (reviewId: string) => {
		try {
			const res = await api.adminReviews.rejectReview(reviewId);
			if (res.success) {
				toast.success("Review rejected");
				fetchReviews();
			} else {
				toast.error("Error", { description: res.message });
			}
		} catch (error) {
			toast.error("Error", { description: "Failed to reject review" });
		}
	};

	const formatDate = (date: string) => {
		return new Date(date).toLocaleDateString();
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
					<h1 className="text-3xl font-bold">Review Moderation</h1>
					<p className="text-muted-foreground">Manage pending book reviews</p>
				</div>
				<div className="flex gap-2">
					<Button onClick={fetchReviews} variant="outline">
						Refresh
					</Button>
				</div>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Pending Reviews</CardTitle>
					<CardDescription>Reviews awaiting approval</CardDescription>
				</CardHeader>
				<CardContent>
					{reviews.length === 0 ? (
						<div className="text-center py-8 text-muted-foreground">
							No pending reviews
						</div>
					) : (
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Book</TableHead>
									<TableHead>User</TableHead>
									<TableHead>Rating</TableHead>
									<TableHead>Review</TableHead>
									<TableHead>Date</TableHead>
									<TableHead>Status</TableHead>
									<TableHead>Actions</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{reviews.map((review) => (
									<TableRow key={review._id}>
										<TableCell className="font-medium">
											<div className="flex items-center gap-2">
												<BookText className="h-4 w-4" />
												<span>{review.book?.title || "Unknown Book"}</span>
											</div>
										</TableCell>
										<TableCell>
											<div className="flex items-center gap-2">
												<User className="h-4 w-4" />
												<span>{review.user?.name || "Anonymous"}</span>
											</div>
										</TableCell>
										<TableCell>
											<div className="flex items-center gap-1">
												<Star className="h-4 w-4 text-yellow-500" />
												<span className="font-semibold">{review.rating}</span>
											</div>
										</TableCell>
										<TableCell className="max-w-md">
											<div className="line-clamp-2 text-sm">{review.text}</div>
										</TableCell>
										<TableCell>
											<div className="flex items-center gap-1">
												<Calendar className="h-4 w-4" />
												<span>{formatDate(review.createdAt)}</span>
											</div>
										</TableCell>
										<TableCell>
											<Badge variant="secondary">Pending</Badge>
										</TableCell>
										<TableCell>
											<div className="flex gap-2">
												<Button
													variant="outline"
													size="sm"
													onClick={() => handleApproveReview(review._id)}
													className="text-green-600 border-green-600 hover:bg-green-600 hover:text-white"
												>
													<CheckCircle className="h-4 w-4 mr-1" />
													Approve
												</Button>
												<Button
													variant="outline"
													size="sm"
													onClick={() => handleRejectReview(review._id)}
													className="text-red-600 border-red-600 hover:bg-red-600 hover:text-white"
												>
													<XCircle className="h-4 w-4 mr-1" />
													Reject
												</Button>
											</div>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
