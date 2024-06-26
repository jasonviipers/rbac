import { VerifyCode } from "@/components/form/verify-code";
import { Icons } from "@/components/icons";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/validators/useAuth";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export const metadata = {
    title: "Verify Email",
    description: "Verify your email address",
};

export default async function Page() {
    const { user } = await useAuth();

    if (!user) redirect('/login');
    if (user.emailVerified) redirect('/');

    return (
        <div className="flex h-auto min-h-screen w-full items-center justify-center">
            <Link href="/" className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                "absolute left-4 top-4 md:left-8 md:top-8"
            )}>
                <Icons.chevronLeft className="mr-2 size-4" />
                Back
            </Link>
            <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                <div className="flex flex-col space-y-2 text-center">
                    <Icons.logo className="mx-auto size-6" />
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Welcome back
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Login to your account
                    </p>
                </div>
                <Suspense>
                    <VerifyCode />
                </Suspense>

            </div>
        </div>
    )
}