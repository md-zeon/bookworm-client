import Image from "next/image";

const AuthLayout = ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => {
    return (
        <main className="min-h-screen grid lg:grid-cols-2" suppressHydrationWarning>
            {children}
            <div className="bg-beige hidden lg:flex items-center justify-center">
                <Image src="/images/bookshelf.svg" alt="Bookshelf" width={550} height={350} className="" />
            </div>
        </main>
    );
}

export default AuthLayout