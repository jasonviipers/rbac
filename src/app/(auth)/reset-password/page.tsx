import { Icons } from "@/components/icons";
import { SendResetEmail } from "@/components/form/send-reset-email";
import { useAuth } from "@/lib/validators/useAuth";
import { redirect } from "next/navigation";


export const metadata = {
    title: "Forgot Password",
    description: "Forgot Password Page",
};

export default async function Page() {
    const { user } = await useAuth();

    if (user) redirect("/");

    return (
        <div className="flex h-auto min-h-screen w-full items-center justify-center">
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
                <SendResetEmail />
            </div>
        </div>
    );
}