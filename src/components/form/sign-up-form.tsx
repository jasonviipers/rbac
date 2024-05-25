"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { signupSchema, type SignupInput } from "@/lib/validators/auth";
import { signup } from "@/actions/auth";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const SignUpForm = () => {
    const form = useForm<SignupInput>({
        resolver: zodResolver(signupSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: ""
        },
    });

    const onSubmit = async (data: SignupInput) => {
        try {
            const formData = new FormData();
            formData.set('name', data.name);
            formData.set('email', data.email);
            formData.set('password', data.password);
            formData.set('confirmPassword', data.confirmPassword);
            const response = await signup(null, formData);
            if (response.formError) {
                toast.error(response.formError);
            }

        } catch (error) {
            toast.error('Something went wrong');

        }

    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input
                                    id="name"
                                    placeholder="Name"
                                    type="text"
                                    autoCapitalize="none"
                                    autoComplete="name"
                                    autoCorrect="off"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage className="pt-2 sm:text-sm" />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input
                                    id="email"
                                    placeholder="name@example.com"
                                    type="email"
                                    autoCapitalize="none"
                                    autoComplete="email"
                                    autoCorrect="off"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage className="pt-2 sm:text-sm" />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <Input
                                    id="password"
                                    placeholder="Password"
                                    type="password"
                                    autoComplete="current-password"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage className="pt-2 sm:text-sm" />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>confirm Password</FormLabel>
                            <FormControl>
                                <Input
                                    id="confirmPassword"
                                    placeholder="Password"
                                    type="password"
                                    autoComplete="current-password"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage className="pt-2 sm:text-sm" />
                        </FormItem>
                    )}
                />

                <Button type="submit">
                    Sign Up
                </Button>
            </form>
        </Form>
    )
}