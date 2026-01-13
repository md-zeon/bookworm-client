"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signUpAction } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldGroup, FieldDescription } from "@/components/ui/field";
import Link from "next/link";
import ROUTES from "@/constants/routes";
import { toast } from "sonner";

const SignUpForm = () => {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        const formData = new FormData(e.currentTarget);
        console.log("Form Data:", Object.fromEntries(formData.entries()));


        if (formData.get("password") !== formData.get("confirmPassword")) {
            setError("Passwords do not match");
            toast.error("Passwords do not match");
            setIsLoading(false);
            return;
        }

        const result = await signUpAction(formData);

        if (result.success) {
            const targetPath = result.role === 'admin' ? '/admin/dashboard' : '/user/library';
            router.push(targetPath);
        } else {
            setError(result.message);
            toast.error("Sign up failed.", {
                description: result.message || "Please check your details and try again.",
            });
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
                    <Input id="avatar" name="imageURL" type="file" accept="image/*" disabled={isLoading} />
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