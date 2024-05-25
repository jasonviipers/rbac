"use client";

import { useEffect, useRef } from "react";
import { useFormState } from "react-dom";
import { toast } from "sonner";
import { logout, resendVerificationEmail, verifyEmail } from "@/actions/auth";
import { Icons } from "../icons";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

export const VerifyCode = () => {
    const [verifyEmailState, verifyEmailAction] = useFormState(verifyEmail, null);
    const [resendState, resendAction] = useFormState(resendVerificationEmail, null);
    const codeFormRef = useRef<HTMLFormElement>(null);

    useEffect(() => {
        if (resendState?.success) {
            toast("Email sent!");
        }
        if (resendState?.error) {
            toast(resendState.error, {
                icon: <Icons.triangleAlert className="h-5 w-5 text-destructive" />,
            });
        }
    }, [resendState?.error, resendState?.success]);

    useEffect(() => {
        if (verifyEmailState?.error) {
            toast(verifyEmailState.error, {
                icon: <Icons.triangleAlert className="h-5 w-5 text-destructive" />,
            });
        }
    }, [verifyEmailState?.error]);

    return (
        <div className="flex flex-col gap-2">
            <form ref={codeFormRef} action={verifyEmailAction}>
                <Label htmlFor="code">Verification code</Label>
                <Input className="mt-2" type="text" id="code" name="code" required />
                <Button className="mt-4 w-full">Verify</Button>
            </form>
            <form action={resendAction}>
                <Button className="w-full" variant="secondary">
                    Resend Code
                </Button>
            </form>
            <form action={logout}>
                <Button variant="link" className="p-0 font-normal">
                    want to use another email? Log out now.
                </Button>
            </form>
        </div>
    );
};