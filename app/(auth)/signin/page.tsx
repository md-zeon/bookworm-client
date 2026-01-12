import SignInForm from "@/components/forms/SignInForm";
import { Card, CardContent } from "@/components/ui/card";
import { FieldDescription } from "@/components/ui/field";
import Link from "next/link";

const SignInPage = () => {

    return (
        <section className="h-full grid place-items-center px-4 py-8 sm:px-6 lg:px-8">
            <Card className="overflow-hidden p-0 w-full max-w-xl">
                <CardContent >
                    <SignInForm />
                </CardContent>
            </Card>
            <FieldDescription className="px-6 text-center">
                By clicking continue, you agree to our <Link href="#">Terms of Service</Link>{" "}
                and <Link href="#">Privacy Policy</Link>.
            </FieldDescription>
        </section >
    );
}

export default SignInPage;