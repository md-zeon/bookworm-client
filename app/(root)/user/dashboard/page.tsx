"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { api } from "@/lib/api";
import { toast } from "sonner";
import {
    BookOpen,
    Book,
    CheckCircle,
    BookMarked,
    Users,
    Star,
    Target,
    BarChart3,
    Loader2,
    ArrowRight,
} from "lucide-react";
import Image from "next/image";

interface DashboardStats {
	totalBooks: number;
	currentlyReading: number;
	wantToRead: number;
	read: number;
	annualGoal: number;
	currentProgress: number;
	recommendedBooks: Array<{
		_id: string;
		title: string;
		author: string;
		coverImage: string;
		genre: string;
		rating: number;
	}>;
	recentActivity: Array<{
		type: "review" | "progress" | "completed";
		bookTitle: string;
		bookAuthor: string;
		bookCover: string;
		description: string;
		timestamp: string;
	}>;
}

interface ReadingStatsResponse {
	goal: {
		annualGoal: number;
	} | null;
	stats: {
		booksRead: number;
		booksCurrentlyReading: number;
		booksWantToRead: number;
		totalPagesRead: number;
		totalPagesCurrentlyReading: number;
		year: number;
	};
	readingStreak: {
		current: number;
		longest: number;
		lastReadDate: string | null;
	};
}

interface ReviewData {
	_id: string;
	book?: {
		_id: string;
		title: string;
		author: string;
		coverImage: string;
	};
	rating: number;
	createdAt: string;
}

interface LibraryItem {
	_id: string;
	book: {
		_id: string;
		title: string;
		author: string;
		coverImage: string;
	};
	shelf: string;
	progress: number;
	updatedAt: string;
}

export default function DashboardPage() {
    const router = useRouter();
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
			const [statsRes, recommendationsRes, activityRes] = await Promise.all([
				api.goals.getReadingStats<ReadingStatsResponse>(),
				api.recommendations.getRecommendations<DashboardStats["recommendedBooks"]>(),
				fetchRecentActivity()
			]);

			if (statsRes.success && statsRes.data) {
				// Transform the API response to match DashboardStats interface
				const transformedStats: DashboardStats = {
					totalBooks: statsRes.data.stats.booksRead + statsRes.data.stats.booksCurrentlyReading + statsRes.data.stats.booksWantToRead,
					currentlyReading: statsRes.data.stats.booksCurrentlyReading,
					wantToRead: statsRes.data.stats.booksWantToRead,
					read: statsRes.data.stats.booksRead,
					annualGoal: statsRes.data.goal?.annualGoal || 0,
					currentProgress: statsRes.data.stats.totalPagesCurrentlyReading,
					recommendedBooks: recommendationsRes.success ? (recommendationsRes.data || []) : [],
					recentActivity: activityRes
				};
				
				setStats(transformedStats);
            } else {
                toast.error("Error", { description: statsRes.message || "Failed to load dashboard" });
            }
        } catch (error) {
            toast.error("Error", { description: "Failed to load dashboard data" });
        } finally {
            setLoading(false);
        }
    };

    const fetchRecentActivity = async () => {
        try {
            const reviewsRes = await api.reviews.getUserReviews<ReviewData[]>();
            const libraryRes = await api.library.getLibrary<LibraryItem[]>();

            const activity: DashboardStats["recentActivity"] = [];

            if (reviewsRes.success && Array.isArray(reviewsRes.data)) {
                reviewsRes.data.forEach((review) => {
                    activity.push({
                        type: "review",
                        bookTitle: review.book?.title || "Unknown",
                        bookAuthor: review.book?.author || "Unknown",
                        bookCover: review.book?.coverImage || "/images/bookshelf.svg",
                        description: `Reviewed "${review.book?.title || "Unknown"}" with ${review.rating} stars`,
                        timestamp: review.createdAt
                    });
                });
            }

            if (libraryRes.success && Array.isArray(libraryRes.data)) {
                libraryRes.data.forEach((item) => {
                    if (item.shelf === "read") {
                        activity.push({
                            type: "completed",
                            bookTitle: item.book.title,
                            bookAuthor: item.book.author,
                            bookCover: item.book.coverImage,
                            description: `Finished reading "${item.book.title}"`,
                            timestamp: item.updatedAt
                        });
                    } else if (item.shelf === "currentlyReading" && item.progress > 0) {
                        activity.push({
                            type: "progress",
                            bookTitle: item.book.title,
                            bookAuthor: item.book.author,
                            bookCover: item.book.coverImage,
                            description: `Reading "${item.book.title}" - ${item.progress} pages`,
                            timestamp: item.updatedAt
                        });
                    }
                });
            }

            return activity
                .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                .slice(0, 5);
        } catch (error) {
            return [];
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const handleViewLibrary = () => {
        router.push("/user/library");
    };

    const handleViewRecommendations = () => {
        router.push("/user/recommendations");
    };

    const handleViewGoals = () => {
        router.push("/user/goals");
    };

    const getGoalPercentage = () => {
        if (!stats?.annualGoal || stats.annualGoal === 0) return 0;
        return Math.min(Math.round((stats.read / stats.annualGoal) * 100), 100);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!stats) {
        return (
            <div className="container mx-auto py-8">
                <Card>
                    <CardContent className="py-8 text-center">
                        <p className="text-muted-foreground">Unable to load dashboard data</p>
                        <Button onClick={fetchDashboardData} className="mt-4">
                            Retry
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold">Dashboard</h1>
                    <p className="text-muted-foreground">Your reading journey at a glance</p>
                </div>
                <div className="flex gap-2">
                    <Button onClick={handleViewLibrary} variant="outline">
                        View Library
                        <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                    <Button onClick={handleViewRecommendations} variant="outline">
                        Discover Books
                        <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
                {/* Total Books Card */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Books</CardTitle>
                        <Book className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalBooks}</div>
                        <p className="text-xs text-muted-foreground">
                            Across all shelves
                        </p>
                    </CardContent>
                </Card>

                {/* Currently Reading Card */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Currently Reading</CardTitle>
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.currentlyReading}</div>
                        <p className="text-xs text-muted-foreground">
                            Active reading sessions
                        </p>
                    </CardContent>
                </Card>

                {/* Want to Read Card */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Want to Read</CardTitle>
                        <BookMarked className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.wantToRead}</div>
                        <p className="text-xs text-muted-foreground">
                            Books on your list
                        </p>
                    </CardContent>
                </Card>

                {/* Read Books Card */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Books Read</CardTitle>
                        <CheckCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.read}</div>
                        <p className="text-xs text-muted-foreground">
                            Completed books
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Reading Goal Progress */}
            {stats.annualGoal > 0 && (
                <Card className="mb-8">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="flex items-center gap-2">
                                    <Target className="h-5 w-5" />
                                    Reading Goal
                                </CardTitle>
                                <CardDescription>
                                    Annual reading challenge
                                </CardDescription>
                            </div>
                            <Button onClick={handleViewGoals} variant="outline" size="sm">
                                Manage Goals
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">
                                {stats.read} / {stats.annualGoal} books
                            </span>
                            <span className="text-sm text-muted-foreground">
                                {getGoalPercentage()}% complete
                            </span>
                        </div>
                        <Progress value={getGoalPercentage()} className="h-3" />
                    </CardContent>
                </Card>
            )}

            <div className="grid gap-8 lg:grid-cols-2">
                {/* Recommended Books */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Star className="h-5 w-5" />
                            Recommended for You
                        </CardTitle>
                        <CardDescription>
                            Books we think you'll love based on your reading history
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {stats.recommendedBooks.length > 0 ? (
                            <div className="space-y-4">
                                {stats.recommendedBooks.slice(0, 3).map((book) => (
                                    <div key={book._id} className="flex items-center gap-4 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                                        <div className="w-16 h-24 flex-shrink-0">
                                            <Image
                                                src={book.coverImage}
                                                alt={book.title}
                                                width={64}
                                                height={96}
                                                className="object-cover rounded w-full h-full"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-semibold truncate">{book.title}</h4>
                                            <p className="text-sm text-muted-foreground">{book.author}</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <Badge variant="secondary">{book.genre}</Badge>
                                                <div className="flex items-center gap-1 text-sm text-yellow-600">
                                                    <Star className="h-4 w-4 fill-yellow-600" />
                                                    {book.rating.toFixed(1)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {stats.recommendedBooks.length > 3 && (
                                    <Button
                                        variant="outline"
                                        onClick={handleViewRecommendations}
                                        className="w-full"
                                    >
                                        View All Recommendations
                                        <ArrowRight className="h-4 w-4 ml-2" />
                                    </Button>
                                )}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-muted-foreground">
                                <Star className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                <p>No recommendations available yet</p>
                                <p className="text-sm">Start reading books to get personalized recommendations</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <BarChart3 className="h-5 w-5" />
                            Recent Activity
                        </CardTitle>
                        <CardDescription>
                            Your latest reading updates
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {stats.recentActivity.length > 0 ? (
                            <ScrollArea className="h-[300px] pr-4">
                                <div className="space-y-4">
                                    {stats.recentActivity.map((activity, index) => (
                                        <div key={index} className="flex items-center gap-3">
                                            <div className="w-12 h-16 flex-shrink-0">
                                                <Image
                                                    src={activity.bookCover}
                                                    alt={activity.bookTitle}
                                                    width={48}
                                                    height={64}
                                                    className="object-cover rounded w-full h-full"
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium">{activity.description}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    {activity.bookTitle} • {activity.bookAuthor}
                                                </p>
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    {new Date(activity.timestamp).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </ScrollArea>
                        ) : (
                            <div className="text-center py-8 text-muted-foreground">
                                <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                <p>No recent activity</p>
                                <p className="text-sm">Start reading and reviewing books to see activity here</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
