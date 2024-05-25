"use client"
import { useParams, useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { toast } from "sonner";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import { PermissionFormSchema, PermissionFormValue } from "@/lib/validators/schema";
import { Permission, Team, teams } from "@/server/db/schema";
import { Separator } from "@/components/ui/separator";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { getFetch } from "@/lib/getFetch";
import AlertModal from "@/components/modals/alert-modal";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface IPermission {
    teams: Team[];
    initialData: Permission | null;
}

export default function PermissionForm({ initialData, teams }: IPermission) {
    const router = useRouter();
    const params = useParams();

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const title = initialData ? 'Edit Permission' : 'Create Permission'
    const descriptions = initialData ? 'Edit Permission' : 'Create Permission'
    const toastMessage = initialData ? 'Permission updated' : 'Permission created';

    const form = useForm<PermissionFormValue>({
        resolver: zodResolver(PermissionFormSchema),
        defaultValues: {
            name: initialData?.name || "",
            description: initialData?.description || "",
            teamId: initialData?.teamId || "",
        }
    });

    const onSubmit = async (values: PermissionFormValue) => {
        setLoading(true);
        try {
            const endpoint = initialData && params.id ? `/api/permissions/${params.id}` : "/api/permissions";
            const method = initialData ? 'PATCH' : 'POST';
            const data = await getFetch({ url: endpoint, method, body: values });

            if (!data) throw new Error("An error occurred while processing the request");

            toast.success(toastMessage);
            if (!initialData) {
                router.push("/admin/permissions");
                router.refresh();
            }

        } catch (error) {
            console.error('Error:', error);
            toast.error("Failed to create permission");
        } finally {
            setLoading(false);
        }
    };

    const onDelete = async () => {
        setLoading(true);
        try {
            const data = await getFetch({ url: `/api/permissions/${params.id}`, method: 'DELETE' });
            router.refresh();
            toast.success("Permission deleted");
        } catch (error) {
            toast.error("Failed to delete permission");
        } finally {
            setLoading(false);
            setOpen(false);
        }
    };

    return (
        <>
            <div className="flex items-center justify-between">
                <Heading title={title} description={descriptions} />
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
                            name="teamId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Team</FormLabel>
                                    <Select disabled={loading}
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue defaultValue={field.value} placeholder="Select a team" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectContent>
                                                {teams && teams.map((team) => (
                                                    <SelectItem key={team.id} value={team.id}>{team.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </SelectContent>
                                    </Select>
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
            <AlertModal
                isOpen={open}
                loading={loading}
                onClose={() => setOpen(false)}
                onConfirm={onDelete}
            />
        </>
    )
}