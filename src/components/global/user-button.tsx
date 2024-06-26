"use client";
import { useState } from "react";
import Link from "next/link";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { logout } from "@/actions/auth";
import { toast } from "sonner";
import { Icons } from "@/components/icons";
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { LoadingButton } from "./loading-button";

type UserButtonProps = {
    email: string;
    avatar?: string | null;
    className?: string;
};

export default function UserButton({ email, avatar, className }: UserButtonProps) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger className={className}>
                <img
                    src={avatar ?? "https://source.boringavatars.com/marble/60/" + email}
                    alt="Avatar"
                    className="block h-10 w-10 rounded-full sm:h-8 sm:w-8 leading-none border-2 border-transparent hover:border-primary-foreground focus:border-primary-foreground transition duration-150 ease-in-out"
                ></img>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel className="text-muted-foreground">
                    {email}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem
                        className="cursor-pointer text-muted-foreground"
                        asChild
                    >
                        <Link href="/dashboard">Dashboard</Link>
                    </DropdownMenuItem>
                 
                </DropdownMenuGroup>
                <DropdownMenuSeparator />

                <DropdownMenuLabel className="p-0">
                    <SignoutConfirmation />
                </DropdownMenuLabel>
            </DropdownMenuContent>
        </DropdownMenu>
    );

}

const SignoutConfirmation = () => {
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSignout = async () => {
        setIsLoading(true);
        try {
            await logout();
            toast("Signed out successfully");
        } catch (error) {
            if (error instanceof Error) {
                toast(error.message, {
                    icon: (
                        <Icons.close className="h-5 w-5 text-red-500" />
                    ),
                });
            }
        } finally {
            setOpen(false);
            setIsLoading(false);
        }
    };

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger
                className="px-2 py-1.5 text-sm text-muted-foreground outline-none"
                asChild
            >
                <button>Sign out</button>
            </AlertDialogTrigger>
            <AlertDialogContent className="max-w-xs">
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-center">
                        Sign out of your account?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        You will be redirected to the home page.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-center">
                    <Button variant="outline" onClick={() => setOpen(false)}>
                        Cancel
                    </Button>
                    <LoadingButton loading={isLoading} onClick={handleSignout}>
                        Continue
                    </LoadingButton>
                </div>
            </AlertDialogContent>
        </AlertDialog>
    );
};