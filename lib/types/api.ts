export interface SignInParams {
	email: string;
	password: string;
}

export interface SignUpParams {
	name: string;
	email: string;
	password: string;
	photoURL?: string;
}

export interface Settings {
	_id?: string;
	// General Settings
	siteName: string;
	siteDescription: string;
	maintenanceMode: boolean;
	
	// User Settings
	allowRegistration: boolean;
	requireEmailVerification: boolean;
	maxBooksPerUser: number;
	
	// Review Settings
	requireReviewApproval: boolean;
	minReviewLength: number;
	maxReviewLength: number;
	
	// Library Settings
	defaultShelf: "wantToRead" | "currentlyReading" | "finished";
	maxProgressPerDay: number;
	allowDuplicateBooks: boolean;
	
	// Audit fields
	lastUpdatedBy?: string;
	updatedAt?: Date;
	createdAt?: Date;
}
