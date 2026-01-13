export const uploadImage = async (file: File) => {
	const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
	const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

	const formData = new FormData();
	formData.append("file", file);
	formData.append("upload_preset", uploadPreset!);

	try {
		const res = await fetch(
			`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
			{
				method: "POST",
				body: formData,
			},
		);

		const data = await res.json();

		if (data.secure_url) {
			return data.secure_url;
		} else {
			throw new Error("Upload failed");
		}
	} catch (error) {
		console.error("Cloudinary Error:", error);
		return null;
	}
};
