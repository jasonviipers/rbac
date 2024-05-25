"use client"
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { toast } from "sonner";

import { Icons } from "@/components/icons";
import AlertModal from "@/components/modals/alert-modal";
import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { UserFormSchema, UserFormValue } from "@/lib/validators/schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { User } from "@/server/db/schema";
import { getFetch } from "@/lib/getFetch";


interface IUser {
    initialData: User | null;
}

export default function UserForm({ initialData }: IUser) {
    const router = useRouter();
    const params = useParams();

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const name = initialData ? 'Edit User' : 'Create a new';
    const toastMesage = initialData ? "User updated" : "User created";
    const action = initialData ? "Save changes" : "Create";

    const form = useForm<UserFormValue>({
        resolver: zodResolver(UserFormSchema),
        defaultValues: {
            name: initialData?.name || "",
            email: initialData?.email || "",
            hashedPassword: "",
        }
    });

    const onSubmit = async (values: UserFormValue) => {
        try {
            setLoading(true);
            let data;
            if (initialData) {
                data = await getFetch({
                    url: `/api/users/${params.id}`,
                    method: 'PATCH', body: values
                });
                toast.success("User updated");
            } else {
                data = await getFetch({
                    url: "/api/users",
                    method: "POST", body: values
                });
                toast.success("User created");
                router.push("/admin/users");
                router.refresh();
            }
            toast.success(toastMesage);
        } catch (error) {
            console.error('Error:', error)
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    const onDelete = async () => {
        try {
            setLoading(true);
            await getFetch({
                url: `/api/users/${params.id}`,
                method: "DELETE",
            });
            router.push("/admin/users");
            router.refresh();
            toast.success("User deleted");
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
            setOpen(false);
        }
    };

    return (
        <>
            <div className="flex items-center justify-between">
                <Heading title={name} description={'User form'} />
                {initialData && (
                    <Button variant="destructive"
                        size="icon" onClick={() => setOpen(true)}>
                        <Icons.trash className="h-4 w-4" />
                    </Button>
                )}
            </div>
            <Separator />
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
                    <div className="grid grid-cols-3 gap-8">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input disabled={loading} placeholder="User name" {...field} />
                                    </FormControl>
                                    <FormMessage />
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
                                        <Input disabled={loading} placeholder="User email" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {!initialData && (
                            <FormField
                                control={form.control}
                                name="hashedPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <Input disabled={loading} placeholder="User password" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}

                    </div>
                    <Button
                        disabled={loading}
                        type="submit"
                        className="ml-auto"
                    >
                        {action}
                    </Button>
                </form>
            </Form>
            <AlertModal
                // title="Delete User"
                // description="Are you sure you want to delete this user?"
                isOpen={open}
                loading={loading}
                onClose={() => setOpen(false)}
                onConfirm={onDelete}
            />
        </>
    )
}