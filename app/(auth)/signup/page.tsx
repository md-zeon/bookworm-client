import SignUpForm from '@/components/forms/SignUpFom'
import { Card, CardContent } from '@/components/ui/card'

const SignUpPage = () => {
    return (
        <section className="h-full grid place-items-center px-4 py-8 sm:px-6 lg:px-8">
            <Card className="overflow-hidden p-0 w-full max-w-xl">
                <CardContent >
                    <SignUpForm />
                </CardContent>
            </Card>
        </section>
    )
}

export default SignUpPage