"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { api } from "@/lib/api";
import { ReadingStats, MonthlyProgress, GenreBreakdown } from "@/types/global";
import {
	BookOpen,
	Target,
	BarChart3,
	Calendar,
	Book,
	Loader2,
	AlertCircle,
} from "lucide-react";
import { toast } from "sonner";

export default function GoalsPage() {
	const [stats, setStats] = useState<ReadingStats | null>(null);
	const [monthlyProgress, setMonthlyProgress] = useState<MonthlyProgress | null>(null);
	const [genreBreakdown, setGenreBreakdown] = useState<GenreBreakdown | null>(null);
	const [loading, setLoading] = useState(true);
	const [goalInput, setGoalInput] = useState("");
	const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

	const fetchStats = async () => {
		setLoading(true);
		try {
			const [statsRes, monthlyRes, genreRes] = await Promise.all([
				api.goals.getReadingStats(),
				api.goals.getMonthlyProgress(currentYear),
				api.goals.getGenreBreakdown(),
			]);

			if (statsRes.success) setStats(statsRes.data as ReadingStats);
			if (monthlyRes.success) setMonthlyProgress(monthlyRes.data as MonthlyProgress);
			if (genreRes.success) setGenreBreakdown(genreRes.data as GenreBreakdown);
		} catch (error) {
			toast.error("Error", { description: "Failed to fetch reading stats" });
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchStats();
	}, [currentYear]);

	const handleSetGoal = async () => {
		const goal = parseInt(goalInput);
		if (!goal || goal <= 0) {
			toast.error("Error", { description: "Please enter a valid goal" });
			return;
		}

		try {
			const res = await api.goals.setReadingGoal(goal);
			if (res.success) {
				toast.success("Goal set successfully");
				setGoalInput("");
				fetchStats();
			} else {
				toast.error("Error", { description: res.message });
			}
		} catch (error) {
			toast.error("Error", { description: "Failed to set reading goal" });
		}
	};

	const getProgressPercentage = () => {
		if (!stats?.goal) return 0;
		return Math.round((stats.stats.booksRead / stats.goal.annualGoal) * 100);
	};

	const getDaysLeft = () => {
		const today = new Date();
		const endOfYear = new Date(currentYear, 11, 31);
		const diffTime = endOfYear.getTime() - today.getTime();
		return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
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
					<h1 className="text-3xl font-bold">Reading Goals</h1>
					<p className="text-muted-foreground">Track your reading progress and set new goals</p>
				</div>
				<div className="flex gap-2">
					<Input
						type="number"
						placeholder="Set annual goal"
						value={goalInput}
						onChange={(e) => setGoalInput(e.target.value)}
						className="w-48"
					/>
					<Button onClick={handleSetGoal}>Set Goal</Button>
				</div>
			</div>

			<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
				{/* Current Goal Progress */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Target className="h-5 w-5" />
							Current Goal
						</CardTitle>
						<CardDescription>
							{stats?.goal ? `Annual goal for ${stats.goal.currentYear}` : "No goal set"}
						</CardDescription>
					</CardHeader>
					<CardContent>
						{stats?.goal ? (
							<div className="space-y-4">
								<div className="flex justify-between items-center">
									<span className="text-2xl font-bold">{stats.goal.annualGoal}</span>
									<Badge>Books</Badge>
								</div>
								<Progress value={getProgressPercentage()} className="h-2" />
								<div className="flex justify-between text-sm text-muted-foreground">
									<span>{stats.stats.booksRead} books read</span>
									<span>{getProgressPercentage()}% complete</span>
								</div>
								<div className="flex justify-between text-sm text-muted-foreground">
									<span>{getDaysLeft()} days left</span>
									<span>{Math.ceil((stats.goal.annualGoal - stats.stats.booksRead) / (getDaysLeft() / 365))} books/day needed</span>
								</div>
							</div>
						) : (
							<div className="text-center py-8 text-muted-foreground">
								<AlertCircle className="h-8 w-8 mx-auto mb-2" />
								No reading goal set
							</div>
						)}
					</CardContent>
				</Card>

				{/* Reading Stats */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<BarChart3 className="h-5 w-5" />
							Reading Stats
						</CardTitle>
						<CardDescription>Current year statistics</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="grid grid-cols-2 gap-4">
							<div className="text-center">
								<div className="text-2xl font-bold">{stats?.stats.booksRead || 0}</div>
								<div className="text-sm text-muted-foreground">Books Read</div>
							</div>
							<div className="text-center">
								<div className="text-2xl font-bold">{stats?.stats.totalPagesRead || 0}</div>
								<div className="text-sm text-muted-foreground">Pages Read</div>
							</div>
							<div className="text-center">
								<div className="text-2xl font-bold">{stats?.stats.booksCurrentlyReading || 0}</div>
								<div className="text-sm text-muted-foreground">Currently Reading</div>
							</div>
							<div className="text-center">
								<div className="text-2xl font-bold">{stats?.stats.booksWantToRead || 0}</div>
								<div className="text-sm text-muted-foreground">Want to Read</div>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Reading Streak */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Calendar className="h-5 w-5" />
							Reading Streak
						</CardTitle>
						<CardDescription>Your consecutive reading days</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							<div className="flex justify-between items-center">
								<div>
									<div className="text-2xl font-bold">{stats?.readingStreak.current || 0}</div>
									<div className="text-sm text-muted-foreground">Current streak</div>
								</div>
								<div className="text-right">
									<div className="text-2xl font-bold">{stats?.readingStreak.longest || 0}</div>
									<div className="text-sm text-muted-foreground">Longest streak</div>
								</div>
							</div>
							{stats?.readingStreak.lastReadDate && (
								<div className="text-center text-sm text-muted-foreground">
									Last read: {new Date(stats.readingStreak.lastReadDate).toLocaleDateString()}
								</div>
							)}
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Monthly Progress */}
			<Card className="mt-6">
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Calendar className="h-5 w-5" />
						Monthly Progress
					</CardTitle>
					<CardDescription>Books read and pages by month</CardDescription>
				</CardHeader>
				<CardContent>
					<ScrollArea className="h-[300px]">
						<div className="grid grid-cols-12 gap-2">
							{monthlyProgress?.months.map((month, index) => (
								<div key={month.month} className="col-span-1">
									<div className="text-xs text-center text-muted-foreground mb-2">
										{new Date(0, month.month - 1).toLocaleString('default', { month: 'short' })}
									</div>
									<div className="space-y-1">
										<div className="text-center text-xs text-muted-foreground">
											{month.booksRead}
										</div>
										<div className="h-16 bg-gray-200 rounded-full relative">
											<div 
												className="h-full bg-primary rounded-full"
												style={{ 
													height: `${Math.min((month.booksRead / Math.max(...monthlyProgress.months.map(m => m.booksRead))) * 100, 100)}%` 
												}}
											/>
										</div>
										<div className="text-center text-xs text-muted-foreground mt-1">
											{month.totalPages}
										</div>
									</div>
								</div>
							))}
						</div>
					</ScrollArea>
				</CardContent>
			</Card>

			{/* Genre Breakdown */}
			<Card className="mt-6">
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Book className="h-5 w-5" />
						Genre Breakdown
					</CardTitle>
					<CardDescription>Books read by genre</CardDescription>
				</CardHeader>
				<CardContent>
					<ScrollArea className="h-[300px]">
						<div className="space-y-4">
							{genreBreakdown?.genres.map((genre) => (
								<div key={genre._id} className="flex items-center justify-between">
									<div>
										<div className="font-medium">{genre.genre}</div>
										<div className="text-sm text-muted-foreground">
											{genre.booksRead} books • {genre.totalPages} pages
										</div>
									</div>
									<div className="flex items-center gap-2">
										<div className="w-24 bg-gray-200 rounded-full h-2">
											<div 
												className="h-full bg-primary rounded-full"
												style={{ 
													width: `${Math.min((genre.booksRead / Math.max(...genreBreakdown.genres.map(g => g.booksRead))) * 100, 100)}%` 
												}}
											/>
										</div>
										<span className="text-sm font-medium">
											{Math.round((genre.booksRead / genreBreakdown.genres.reduce((acc, g) => acc + g.booksRead, 0)) * 100)}%
										</span>
									</div>
								</div>
							))}
						</div>
					</ScrollArea>
				</CardContent>
			</Card>
		</div>
	);
}
