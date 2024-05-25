"use client"
import { useParams, useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import { PermissionFormSchema, PermissionFormValue} from "@/lib/validators/schema";
import { Permission } from "@/server/db/schema";
import { Separator } from "@/components/ui/separator";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface IPermission{
    initialData?: Permission
}

export default function PermissionForm({ initialData }: IPermission) {
    const router = useRouter();
    const params = useParams();

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const name = initialData ? 'Edit Permission' : 'Create Permission'
    const descriptions = initialData ? 'Edit Permission' : 'Create Permission'

    const form = useForm<PermissionFormValue>({
        resolver: zodResolver(PermissionFormSchema),
        defaultValues: {
            name: "",
            description: "",
        }
    });

    const onSubmit = async (values: PermissionFormValue) => { };

    const onDelete = async () => { };

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
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea disabled={loading} placeholder="Role description" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </form>
            </Form>
        </>
    )
}