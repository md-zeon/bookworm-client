"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/api";
import { User } from "@/types/global";
import { toast } from "sonner";
import {
	Mail,
	Calendar,
	Shield,
	Edit,
	Save,
	Loader2,
	Upload,
	User as UserIcon,
} from "lucide-react";

export default function ProfilePage() {
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);
	const [editing, setEditing] = useState(false);
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [photoFile, setPhotoFile] = useState<File | null>(null);
	const [photoPreview, setPhotoPreview] = useState<string | null>(null);
	const [saving, setSaving] = useState(false);

	const fetchUser = async () => {
		setLoading(true);
		try {
			const result = await api.users.getCurrentUser<User>();
			if (result.success && result.data) {
				setUser(result.data);
				setName(result.data.name);
				setEmail(result.data.email);
				setPhotoPreview(result.data.photoURL || null);
			} else {
				throw new Error(result.message || "Failed to fetch user profile");
			}
		} catch (error) {
			toast.error("Error", { 
				description: error instanceof Error ? error.message : "Failed to fetch user profile" 
			});
		} finally {
			setLoading(false);
		}
	};

	const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			setPhotoFile(file);
			const reader = new FileReader();
			reader.onload = () => {
				setPhotoPreview(reader.result as string);
			};
			reader.readAsDataURL(file);
		}
	};

	const handleSave = async () => {
		setSaving(true);
		try {
			// Prepare update data
			const updateData: Partial<User> = {
				name,
				email,
			};

			// Handle photo upload if a new photo was selected
			if (photoFile && photoPreview) {
				// In a real app, you would upload the photo to a service like Cloudinary
				// For now, we'll use the preview URL
				updateData.photoURL = photoPreview;
			}

			// Call the API to update the user profile
			const result = await api.users.updateProfile(updateData);
			
			if (result.success && result.data) {
				// Update local state with the response
				setUser(result.data);
				setEditing(false);
				toast.success("Profile updated successfully");
			} else {
				throw new Error(result.message || "Failed to update profile");
			}
		} catch (error) {
			toast.error("Error", { 
				description: error instanceof Error ? error.message : "Failed to update profile" 
			});
		} finally {
			setSaving(false);
		}
	};

	useEffect(() => {
		fetchUser();
	}, []);

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
					<h1 className="text-3xl font-bold">Profile</h1>
					<p className="text-muted-foreground">Manage your account settings and preferences</p>
				</div>
			</div>

			<div className="grid gap-6 md:grid-cols-2">
				{/* Profile Information */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<UserIcon className="h-5 w-5" />
							Personal Information
						</CardTitle>
						<CardDescription>Update your account information</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="flex items-center gap-4">
							<Avatar className="h-20 w-20">
								<AvatarImage src={photoPreview || user?.photoURL} alt={user?.name} />
								<AvatarFallback>{user?.name.split(' ').map((n: string) => n[0]).join('')}</AvatarFallback>
							</Avatar>
							<div className="space-y-2">
								<Label htmlFor="photo" className="text-sm font-medium cursor-pointer">
									<Upload className="h-4 w-4 mr-1 inline" />
									Change Photo
								</Label>
								<Input
									id="photo"
									type="file"
									accept="image/*"
									onChange={handlePhotoChange}
									className="hidden"
								/>
								<p className="text-xs text-muted-foreground">
									JPG, PNG, or GIF up to 5MB
								</p>
							</div>
						</div>

						<div className="space-y-2">
							<Label htmlFor="name">Name</Label>
							<Input
								id="name"
								value={name}
								onChange={(e) => setName(e.target.value)}
								disabled={!editing}
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="email">Email</Label>
							<Input
								id="email"
								type="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								disabled={!editing}
							/>
						</div>

						<div className="flex gap-2">
							{editing ? (
								<>
									<Button onClick={handleSave} disabled={saving}>
										<Save className="h-4 w-4 mr-2" />
										{saving ? "Saving..." : "Save Changes"}
									</Button>
									<Button
										variant="outline"
										onClick={() => {
											setEditing(false);
											setName(user?.name || "");
											setEmail(user?.email || "");
											setPhotoPreview(user?.photoURL || null);
										}}
									>
										Cancel
									</Button>
								</>
							) : (
								<Button onClick={() => setEditing(true)}>
									<Edit className="h-4 w-4 mr-2" />
									Edit Profile
								</Button>
							)}
						</div>
					</CardContent>
				</Card>

				{/* Account Details */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Shield className="h-5 w-5" />
							Account Details
						</CardTitle>
						<CardDescription>Your account information and statistics</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-2">
								<Mail className="h-4 w-4 text-muted-foreground" />
								<span className="text-sm font-medium">Email</span>
							</div>
							<span className="text-sm text-muted-foreground">{user?.email}</span>
						</div>

						<div className="flex items-center justify-between">
							<div className="flex items-center gap-2">
								<Shield className="h-4 w-4 text-muted-foreground" />
								<span className="text-sm font-medium">Role</span>
							</div>
							<Badge variant={user?.role === "admin" ? "default" : "secondary"}>
								{user?.role}
							</Badge>
						</div>

						<div className="flex items-center justify-between">
							<div className="flex items-center gap-2">
								<Calendar className="h-4 w-4 text-muted-foreground" />
								<span className="text-sm font-medium">Member Since</span>
							</div>
							<span className="text-sm text-muted-foreground">
								{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
							</span>
						</div>

						<div className="flex items-center justify-between">
							<div className="flex items-center gap-2">
								<Calendar className="h-4 w-4 text-muted-foreground" />
								<span className="text-sm font-medium">Last Updated</span>
							</div>
							<span className="text-sm text-muted-foreground">
								{user?.updatedAt ? new Date(user.updatedAt).toLocaleDateString() : "N/A"}
							</span>
						</div>

						{user?.readingGoals && (
							<div className="space-y-2 pt-4 border-t">
								<h4 className="font-medium">Reading Goals</h4>
								<div className="grid grid-cols-2 gap-2 text-sm">
									<div className="flex justify-between">
										<span className="text-muted-foreground">Annual Goal:</span>
										<span>{user.readingGoals.annualGoal} books</span>
									</div>
									<div className="flex justify-between">
										<span className="text-muted-foreground">Current Year:</span>
										<span>{user.readingGoals.currentYear}</span>
									</div>
									<div className="flex justify-between">
										<span className="text-muted-foreground">Start Date:</span>
										<span>
											{user.readingGoals.startDate
												? new Date(user.readingGoals.startDate).toLocaleDateString()
												: "N/A"}
										</span>
									</div>
								</div>
							</div>
						)}

						{user?.readingStreak && (
							<div className="space-y-2 pt-4 border-t">
								<h4 className="font-medium">Reading Streak</h4>
								<div className="grid grid-cols-2 gap-2 text-sm">
									<div className="flex justify-between">
										<span className="text-muted-foreground">Current:</span>
										<span>{user.readingStreak.current} days</span>
									</div>
									<div className="flex justify-between">
										<span className="text-muted-foreground">Longest:</span>
										<span>{user.readingStreak.longest} days</span>
									</div>
									<div className="flex justify-between">
										<span className="text-muted-foreground">Last Read:</span>
										<span>
											{user.readingStreak.lastReadDate
												? new Date(user.readingStreak.lastReadDate).toLocaleDateString()
												: "N/A"}
										</span>
									</div>
								</div>
							</div>
						)}
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
