const CONFIG = {
	API_URL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1",
	NODE_ENV: process.env.NODE_ENV || "development",
	CLOUDINARY_CLOUD_NAME: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
	CLOUDINARY_UPLOAD_PRESET:
		process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "bookworm_uploads",
};

export default CONFIG;
