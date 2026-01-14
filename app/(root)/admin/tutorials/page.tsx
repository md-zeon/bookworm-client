"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/lib/api";
import { toast } from "sonner";
import {
	Youtube,
	Plus,
	Edit,
	Trash2,
	Loader2,
	Search,
} from "lucide-react";

interface Tutorial {
	_id: string;
	title: string;
	description: string;
	videoUrl: string;
	createdAt: string;
	updatedAt: string;
}

export default function AdminTutorialsPage() {
	const [tutorials, setTutorials] = useState<Tutorial[]>([]);
	const [loading, setLoading] = useState(true);
	const [searchQuery, setSearchQuery] = useState("");
	const [isEditing, setIsEditing] = useState(false);
	const [editingTutorial, setEditingTutorial] = useState<Partial<Tutorial>>({});
	const [isAdding, setIsAdding] = useState(false);

	const fetchTutorials = async () => {
		setLoading(true);
		try {
			const res = await api.tutorials.getAll<Tutorial[]>();
			if (res.success && Array.isArray(res.data)) {
				setTutorials(res.data);
			} else {
				toast.error("Error", { description: res.message || "Failed to fetch tutorials" });
			}
		} catch (error) {
			toast.error("Error", { description: "Failed to fetch tutorials" });
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchTutorials();
	}, []);

	const handleAddTutorial = async () => {
		if (!editingTutorial.title || !editingTutorial.description || !editingTutorial.videoUrl) {
			toast.error("Error", { description: "Please fill in all fields" });
			return;
		}

		try {
			const res = await api.tutorials.create<Tutorial>({
				title: editingTutorial.title!,
				description: editingTutorial.description!,
				videoUrl: editingTutorial.videoUrl!,
			});
			if (res.success && res.data) {
				setTutorials([...tutorials, res.data]);
				setIsAdding(false);
				setEditingTutorial({});
				toast.success("Tutorial added successfully");
			}
		} catch (error) {
			toast.error("Error", { description: "Failed to add tutorial" });
		}
	};

	const handleUpdateTutorial = async () => {
		if (!editingTutorial._id) return;

		try {
			const res = await api.tutorials.update<Tutorial>(editingTutorial._id, {
				title: editingTutorial.title!,
				description: editingTutorial.description!,
				videoUrl: editingTutorial.videoUrl!,
			});
			if (res.success && res.data) {
				setTutorials(tutorials.map(tutorial => 
					tutorial._id === editingTutorial._id ? res.data! : tutorial
				));
				setIsEditing(false);
				setEditingTutorial({});
				toast.success("Tutorial updated successfully");
			} else {
				toast.error("Error", { description: res.message || "Failed to update tutorial" });
			}
		} catch (error) {
			toast.error("Error", { description: "Failed to update tutorial" });
		}
	};

	const handleDeleteTutorial = async (tutorialId: string) => {
		try {
			const res = await api.tutorials.delete(tutorialId);
			if (res.success) {
				setTutorials(tutorials.filter(tutorial => tutorial._id !== tutorialId));
				toast.success("Tutorial deleted successfully");
			} else {
				toast.error("Error", { description: res.message });
			}
		} catch (error) {
			toast.error("Error", { description: "Failed to delete tutorial" });
		}
	};

	const filteredTutorials = tutorials.filter(tutorial =>
		tutorial.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
		tutorial.description.toLowerCase().includes(searchQuery.toLowerCase())
	);

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
					<h1 className="text-3xl font-bold">Tutorial Management</h1>
					<p className="text-muted-foreground">Manage video tutorials for users</p>
				</div>
				<div className="flex gap-2">
					<Button onClick={fetchTutorials} variant="outline">
						Refresh
					</Button>
					<Button onClick={() => {
						setIsAdding(true);
						setEditingTutorial({});
					}}>
						<Plus className="h-4 w-4 mr-2" />
						Add Tutorial
					</Button>
				</div>
			</div>

			{/* Search Bar */}
			<div className="mb-6">
				<div className="relative max-w-sm">
					<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
					<Input
						placeholder="Search tutorials..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="pl-10"
					/>
				</div>
			</div>

			{/* Add/Edit Tutorial Form */}
			{(isAdding || isEditing) && (
				<Card className="mb-6">
					<CardHeader>
						<CardTitle>{isAdding ? "Add Tutorial" : "Edit Tutorial"}</CardTitle>
						<CardDescription>Fill in the tutorial details</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label htmlFor="title">Title</Label>
								<Input
									id="title"
									placeholder="Enter tutorial title"
									value={editingTutorial.title || ""}
									onChange={(e) => setEditingTutorial({...editingTutorial, title: e.target.value})}
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="videoUrl">Video URL</Label>
								<Input
									id="videoUrl"
									placeholder="Enter YouTube video URL"
									value={editingTutorial.videoUrl || ""}
									onChange={(e) => setEditingTutorial({...editingTutorial, videoUrl: e.target.value})}
								/>
							</div>
						</div>
						<div className="space-y-2">
							<Label htmlFor="description">Description</Label>
							<Textarea
								id="description"
								placeholder="Enter tutorial description"
								value={editingTutorial.description || ""}
								onChange={(e) => setEditingTutorial({...editingTutorial, description: e.target.value})}
								className="min-h-[120px]"
							/>
						</div>
						<div className="flex gap-2">
							<Button onClick={isAdding ? handleAddTutorial : handleUpdateTutorial}>
								{isAdding ? "Add Tutorial" : "Update Tutorial"}
							</Button>
							<Button variant="outline" onClick={() => {
								setIsAdding(false);
								setIsEditing(false);
								setEditingTutorial({});
							}}>
								Cancel
							</Button>
						</div>
					</CardContent>
				</Card>
			)}

			<Card>
				<CardHeader>
					<CardTitle>Tutorials</CardTitle>
					<CardDescription>Manage video tutorials for the platform</CardDescription>
				</CardHeader>
				<CardContent>
					{filteredTutorials.length === 0 ? (
						<div className="text-center py-8 text-muted-foreground">
							No tutorials found
						</div>
					) : (
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Title</TableHead>
									<TableHead>Description</TableHead>
									<TableHead>Video URL</TableHead>
									<TableHead>Created</TableHead>
									<TableHead>Updated</TableHead>
									<TableHead>Actions</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{filteredTutorials.map((tutorial) => (
									<TableRow key={tutorial._id}>
										<TableCell className="font-medium">{tutorial.title}</TableCell>
										<TableCell className="max-w-md">
											<div className="line-clamp-2 text-sm">{tutorial.description}</div>
										</TableCell>
										<TableCell>
											<a href={tutorial.videoUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
												Watch Video
											</a>
										</TableCell>
										<TableCell>{formatDate(tutorial.createdAt)}</TableCell>
										<TableCell>{formatDate(tutorial.updatedAt)}</TableCell>
										<TableCell>
											<div className="flex gap-2">
												<Button
													variant="outline"
													size="sm"
													onClick={() => {
														setIsEditing(true);
														setEditingTutorial(tutorial);
													}}
												>
													<Edit className="h-4 w-4 mr-1" />
													Edit
												</Button>
												<Button
													variant="outline"
													size="sm"
													onClick={() => handleDeleteTutorial(tutorial._id)}
													className="text-red-600 border-red-600 hover:bg-red-600 hover:text-white"
												>
													<Trash2 className="h-4 w-4 mr-1" />
													Delete
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
