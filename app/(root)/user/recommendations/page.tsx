"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/api";
import { Book, Recommendation } from "@/types/global";
import Image from "next/image";
import {
	BookOpen,
	Sparkles,
	RefreshCw,
	Loader2,
	AlertCircle,
	Star,
	StarHalf,
} from "lucide-react";
import { toast } from "sonner";

export default function RecommendationsPage() {
	const [recommendations, setRecommendations] = useState<Recommendation | null>(null);
	const [loading, setLoading] = useState(true);
	const [refreshing, setRefreshing] = useState(false);

	const fetchRecommendations = async () => {
		setLoading(true);
		try {
			const res = await api.recommendations.getRecommendations(10);
			if (res.success) {
				setRecommendations(res.data as Recommendation);
			} else {
				toast.error("Error", { description: res.message });
			}
		} catch (error) {
			toast.error("Error", { description: "Failed to fetch recommendations" });
		} finally {
			setLoading(false);
		}
	};

	const refreshRecommendations = async () => {
		setRefreshing(true);
		try {
			const res = await api.recommendations.getRecommendations(10);
			if (res.success) {
				setRecommendations(res.data as Recommendation);
				toast.success("Recommendations refreshed");
			} else {
				toast.error("Error", { description: res.message });
			}
		} catch (error) {
			toast.error("Error", { description: "Failed to refresh recommendations" });
		} finally {
			setRefreshing(false);
		}
	};

	useEffect(() => {
		fetchRecommendations();
	}, []);

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
					<h1 className="text-3xl font-bold">Book Recommendations</h1>
					<p className="text-muted-foreground">Personalized recommendations based on your reading history</p>
				</div>
				<div className="flex gap-2">
					<Button 
						onClick={refreshRecommendations} 
						disabled={refreshing}
						variant="outline"
					>
						<RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
						Refresh
					</Button>
				</div>
			</div>

			{recommendations ? (
				<div className="space-y-6">
					{/* Recommendation Reason */}
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Sparkles className="h-5 w-5" />
								Why These Books?
							</CardTitle>
							<CardDescription>{recommendations.reason}</CardDescription>
						</CardHeader>
					</Card>

					{/* Recommended Books Grid */}
					<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
						{recommendations.recommendations.map((book) => (
							<Card key={book._id} className="overflow-hidden">
								<div className="aspect-[3/4] relative">
									<Image
										src={book.coverImage}
										alt={book.title}
										fill
										className="object-cover"
									/>
								</div>
								<CardContent className="p-4">
									<div className="flex items-start justify-between mb-2">
										<div>
											<h3 className="font-semibold text-lg line-clamp-2">{book.title}</h3>
											<p className="text-sm text-muted-foreground">{book.author}</p>
										</div>
										<Badge variant="secondary">{book.genre}</Badge>
									</div>
									
									<div className="flex items-center gap-2 mb-2">
										<div className="flex">
											{getStars(book.averageRating)}
										</div>
										<span className="text-sm text-muted-foreground">
											{book.averageRating.toFixed(1)}/5
										</span>
										<span className="text-sm text-muted-foreground">
											({book.totalReviews} reviews)
										</span>
									</div>

									<p className="text-sm text-muted-foreground line-clamp-3">
										{book.description || "No description available."}
									</p>

									<div className="flex gap-2 mt-4">
										<Button variant="outline" className="flex-1">
											<BookOpen className="h-4 w-4 mr-2" />
											View Details
										</Button>
										<Button className="flex-1">
											Add to Library
										</Button>
									</div>
								</CardContent>
							</Card>
						))}
					</div>
				</div>
			) : (
				<div className="text-center py-12">
					<AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
					<h3 className="text-lg font-semibold mb-2">No Recommendations Available</h3>
					<p className="text-muted-foreground mb-6">
						Build your reading history by adding books to your library and writing reviews to get personalized recommendations.
					</p>
					<Button>Start Reading</Button>
				</div>
			)}
		</div>
	);
}
