"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldGroup, FieldDescription } from "@/components/ui/field";
import Link from "next/link";
import ROUTES from "@/constants/routes";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { uploadImage } from "@/lib/upload";

const SignUpForm = () => {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const formData = new FormData(e.currentTarget);
            const name = formData.get("name") as string;
            const email = formData.get("email") as string;
            const password = formData.get("password") as string;
            const confirmPassword = formData.get("confirmPassword") as string;
            const photoFile = formData.get("photoFile") as File | null;

            if (password !== confirmPassword) {
                throw new Error("Passwords do not match");
            }

            // Upload image to Cloudinary if provided
            let photoURL: string | undefined;

            if (photoFile && photoFile.size > 0) {
                const uploadedUrl = await uploadImage(photoFile);
                if (!uploadedUrl) throw new Error("Failed to upload profile picture");
                photoURL = uploadedUrl;
            }

            console.log("photoURL", photoURL);
            const result = await api.auth.signUp({ name, email, password, photoURL });

            if (!result.success) {
                throw new Error(result.message || "Registration failed");
            }

            const targetPath = result.user.role === "admin" ? "/admin/dashboard" : "/user/library";

            router.push(targetPath);
        } catch (err) {
            const message =
                err instanceof Error
                    ? err.message
                    : "Something went wrong. Please try again.";

            setError(message);
            toast.error("Sign up failed", { description: message });
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <form onSubmit={handleSignUp} className="p-6 md:p-8">
            <FieldGroup>
                <div className="flex flex-col items-center gap-2 text-center">
                    <h1 className="text-2xl font-bold">Create an account</h1>
                    <p className="text-muted-foreground">Join the Bookworm community</p>
                </div>

                <Field>
                    <FieldLabel htmlFor="name">Full Name</FieldLabel>
                    <Input id="name" name="name" placeholder="John Doe" required disabled={isLoading} />
                </Field>

                <Field>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input id="email" type="email" name="email" placeholder="m@example.com" required disabled={isLoading} />
                </Field>

                <Field>
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                    <Input id="password" name="password" type="password" required disabled={isLoading} />
                </Field>

                <Field>
                    <FieldLabel htmlFor="confirmPassword">Confirm Password</FieldLabel>
                    <Input id="confirmPassword" name="confirmPassword" type="password" required disabled={isLoading} />
                </Field>

                <Field>
                    <FieldLabel htmlFor="avatar">Profile Picture (optional)</FieldLabel>
                    <Input id="avatar" name="photoFile" type="file" accept="image/*" disabled={isLoading} />
                </Field>

                {error && <div className="p-3 text-sm text-red-500 bg-red-50 border border-red-200 rounded-md">{error}</div>}

                <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Creating account..." : "Sign Up"}
                </Button>

                <FieldDescription className="text-center">
                    Already have an account? <Link href={ROUTES.SIGN_IN} className="font-medium underline">Sign In</Link>
                </FieldDescription>
            </FieldGroup>
        </form>
    );
};

export default SignUpForm;