"use client"
import { useParams, useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import { RoleFormSchema, RoleFormValue } from "@/lib/validators/schema";
import { Role } from "@/server/db/schema";
import { Separator } from "@/components/ui/separator";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { getFetch } from "@/lib/getFetch";
import { toast } from "sonner";
import AlertModal from "@/components/modals/alert-modal";

interface IRole {
    initialData: Role
}

export default function RoleForm({ initialData }: IRole) {
    const router = useRouter();
    const params = useParams();

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const name = initialData ? 'Edit Role' : 'Create Role'
    const descriptions = initialData ? 'Edit Role' : 'Create Role'
    const toastMessage = initialData ? "Role updated" : "Role created";

    const form = useForm<RoleFormValue>({
        resolver: zodResolver(RoleFormSchema),
        defaultValues: {
            name: "",
            description: "",
            teamId: "",
        }
    });

    const onSubmit = async (values: RoleFormValue) => {
        setLoading(true);
        try {
            const endpoint = initialData && params.id ? `/api/roles/${params.id}` : "/api/roles";
            const method = initialData ? 'PATCH' : 'POST';
            const data = await getFetch({ url: endpoint, method, body: values });

            if (!data) throw new Error("An error occurred while processing the request");

            toast.success(toastMessage);
            if (!initialData) {
                router.push("/admin/roles");
                router.refresh();
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    const onDelete = async () => {
        setLoading(true);
        try {
            const data = await getFetch({ url: `/api/roles/${params.id}`, method: 'DELETE' });

            if (data) {
                toast.success("Role deleted");
                router.push("/admin/roles");
                router.refresh();
            } else {
                toast.error("An error occurred while deleting the Role");
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="flex items-center justify-between">
                <Heading title={name} description={descriptions} />
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
                                        <Input disabled={loading} placeholder="Role name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </form>
            </Form>
            <AlertModal
                isOpen={open}
                loading={loading}
                onClose={() => setOpen(false)}
                onConfirm={onDelete}
            />
        </>
    )
}