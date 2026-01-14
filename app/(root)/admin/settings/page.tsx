"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import {
	Settings as SettingsIcon,
	Shield,
	Database,
	Users,
	AlertTriangle,
	Loader2,
	Save,
} from "lucide-react";
import { api } from "@/lib/api";
import { Settings } from "@/lib/types/api";

export default function AdminSettingsPage() {
	const [loading, setLoading] = useState(false);
	const [settings, setSettings] = useState<Settings>({
		// General Settings
		siteName: "Bookworm",
		siteDescription: "Your personal reading companion",
		maintenanceMode: false,

		// User Settings
		allowRegistration: true,
		requireEmailVerification: true,
		maxBooksPerUser: 100,

		// Review Settings
		requireReviewApproval: true,
		minReviewLength: 10,
		maxReviewLength: 1000,

		// Library Settings
		defaultShelf: "wantToRead",
		maxProgressPerDay: 50,
		allowDuplicateBooks: false,
	});

	// Fetch initial settings from API
	useEffect(() => {
		const fetchSettings = async () => {
			try {
				const res = await api.settings.get();
				if (res.success && res.data) {
					setSettings(res.data);
				} else {
					toast.error("Error", { description: res.message || "Failed to fetch settings" });
				}
			} catch (error) {
				toast.error("Error", { description: "Failed to fetch settings" });
			}
		};

		fetchSettings();
	}, []);

	const handleSaveSettings = async () => {
		setLoading(true);
		try {
			const res = await api.settings.update(settings);
			if (res.success && res.data) {
				setSettings(res.data);
				toast.success("Settings saved successfully");
			} else {
				toast.error("Error", { description: res.message || "Failed to save settings" });
			}
		} catch (error) {
			toast.error("Error", { description: "Failed to save settings" });
		} finally {
			setLoading(false);
		}
	};

	const handleResetSettings = async () => {
		setLoading(true);
		try {
			const res = await api.settings.reset();
			if (res.success && res.data) {
				setSettings(res.data);
				toast.success("Settings reset to defaults");
			} else {
				toast.error("Error", { description: res.message || "Failed to reset settings" });
			}
		} catch (error) {
			toast.error("Error", { description: "Failed to reset settings" });
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="container mx-auto py-8">
			<div className="flex items-center justify-between mb-6">
				<div>
					<h1 className="text-3xl font-bold">Admin Settings</h1>
					<p className="text-muted-foreground">Configure platform settings and preferences</p>
				</div>
				<div className="flex gap-2">
					<Button onClick={handleResetSettings} variant="outline" disabled={loading}>
						<AlertTriangle className="h-4 w-4 mr-2" />
						Reset to Defaults
					</Button>
					<Button onClick={handleSaveSettings} disabled={loading}>
						{loading ? (
							<Loader2 className="h-4 w-4 mr-2 animate-spin" />
						) : (
							<Save className="h-4 w-4 mr-2" />
						)}
						Save Settings
					</Button>
				</div>
			</div>

			<div className="grid gap-6 md:grid-cols-2">
				{/* General Settings */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<SettingsIcon className="h-5 w-5" />
							General Settings
						</CardTitle>
						<CardDescription>Basic platform configuration</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="siteName">Site Name</Label>
							<Input
								id="siteName"
								value={settings.siteName}
								onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="siteDescription">Site Description</Label>
							<Textarea
								id="siteDescription"
								value={settings.siteDescription}
								onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
								className="min-h-[80px]"
							/>
						</div>
						<div className="flex items-center justify-between">
							<div>
								<Label htmlFor="maintenanceMode" className="text-sm font-medium">Maintenance Mode</Label>
								<p className="text-xs text-muted-foreground">Temporarily disable user access</p>
							</div>
							<Switch
								id="maintenanceMode"
								checked={settings.maintenanceMode}
								onCheckedChange={(checked) => setSettings({ ...settings, maintenanceMode: checked })}
							/>
						</div>
					</CardContent>
				</Card>

				{/* User Settings */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Users className="h-5 w-5" />
							User Settings
						</CardTitle>
						<CardDescription>User registration and management</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="flex items-center justify-between">
							<div>
								<Label htmlFor="allowRegistration" className="text-sm font-medium">Allow Registration</Label>
								<p className="text-xs text-muted-foreground">Enable new user signups</p>
							</div>
							<Switch
								id="allowRegistration"
								checked={settings.allowRegistration}
								onCheckedChange={(checked) => setSettings({ ...settings, allowRegistration: checked })}
							/>
						</div>
						<div className="flex items-center justify-between">
							<div>
								<Label htmlFor="requireEmailVerification" className="text-sm font-medium">Require Email Verification</Label>
								<p className="text-xs text-muted-foreground">Users must verify email</p>
							</div>
							<Switch
								id="requireEmailVerification"
								checked={settings.requireEmailVerification}
								onCheckedChange={(checked) => setSettings({ ...settings, requireEmailVerification: checked })}
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="maxBooksPerUser">Max Books Per User</Label>
							<Input
								id="maxBooksPerUser"
								type="number"
								value={settings.maxBooksPerUser}
								onChange={(e) => setSettings({ ...settings, maxBooksPerUser: parseInt(e.target.value) })}
							/>
						</div>
					</CardContent>
				</Card>

				{/* Review Settings */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Shield className="h-5 w-5" />
							Review Settings
						</CardTitle>
						<CardDescription>Review moderation and validation</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="flex items-center justify-between">
							<div>
								<Label htmlFor="requireReviewApproval" className="text-sm font-medium">Require Review Approval</Label>
								<p className="text-xs text-muted-foreground">Admin must approve reviews</p>
							</div>
							<Switch
								id="requireReviewApproval"
								checked={settings.requireReviewApproval}
								onCheckedChange={(checked) => setSettings({ ...settings, requireReviewApproval: checked })}
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="minReviewLength">Minimum Review Length</Label>
							<Input
								id="minReviewLength"
								type="number"
								value={settings.minReviewLength}
								onChange={(e) => setSettings({ ...settings, minReviewLength: parseInt(e.target.value) })}
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="maxReviewLength">Maximum Review Length</Label>
							<Input
								id="maxReviewLength"
								type="number"
								value={settings.maxReviewLength}
								onChange={(e) => setSettings({ ...settings, maxReviewLength: parseInt(e.target.value) })}
							/>
						</div>
					</CardContent>
				</Card>

				{/* Library Settings */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Database className="h-5 w-5" />
							Library Settings
						</CardTitle>
						<CardDescription>Library management and limits</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="defaultShelf">Default Shelf</Label>
							<Select
								value={settings.defaultShelf}
								onValueChange={(value: "wantToRead" | "currentlyReading" | "finished") =>
									setSettings({ ...settings, defaultShelf: value })
								}
							>
								<SelectTrigger>
									<SelectValue placeholder="Select default shelf" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="wantToRead">Want to Read</SelectItem>
									<SelectItem value="currentlyReading">Currently Reading</SelectItem>
									<SelectItem value="finished">Finished</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<div className="space-y-2">
							<Label htmlFor="maxProgressPerDay">Max Progress Per Day</Label>
							<Input
								id="maxProgressPerDay"
								type="number"
								value={settings.maxProgressPerDay}
								onChange={(e) => setSettings({ ...settings, maxProgressPerDay: parseInt(e.target.value) })}
							/>
						</div>
						<div className="flex items-center justify-between">
							<div>
								<Label htmlFor="allowDuplicateBooks" className="text-sm font-medium">Allow Duplicate Books</Label>
								<p className="text-xs text-muted-foreground">Users can add same book multiple times</p>
							</div>
							<Switch
								id="allowDuplicateBooks"
								checked={settings.allowDuplicateBooks}
								onCheckedChange={(checked) => setSettings({ ...settings, allowDuplicateBooks: checked })}
							/>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
