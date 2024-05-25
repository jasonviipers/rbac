"use client";

import { ResetPasswordInput, resetPasswordSchema } from "@/lib/validators/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { resetPassword } from "@/actions/auth";

export const ResetPassword = ({ token }: { token: string }) => {
    const form = useForm<ResetPasswordInput>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {
            token,
            password: "",
        },
    });

    const onSubmit = async (data: ResetPasswordInput) => {
        const formData = new FormData();
        formData.set('token', data.token);
        formData.set('password', data.password);
        await resetPassword(null, formData);

    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <Input
                                    id="password"
                                    type="password"
                                    autoComplete="new-password"
                                    autoCapitalize="none"
                                    autoCorrect="off"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage className="pt-2 sm:text-sm" />
                        </FormItem>
                    )}
                />
                <Button type="submit" className="w-full">
                    Reset Password
                </Button>
            </form>
        </Form>
    );
};