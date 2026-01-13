import Image from "next/image";
import BookShelfImage from "@/public/images/bookshelf.svg";

const AuthLayout = ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => {
    return (
        <main className="min-h-screen grid lg:grid-cols-2" suppressHydrationWarning>
            {children}
            <div className="bg-beige hidden lg:flex items-center justify-center">
                <Image src={BookShelfImage} alt="Bookshelf" width={550} height={350} />
            </div>
        </main>
    );
}

export default AuthLayout