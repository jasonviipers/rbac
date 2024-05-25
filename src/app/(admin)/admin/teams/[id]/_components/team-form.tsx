'use client';

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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Team, User } from "@/server/db/schema";
import { getFetch } from "@/lib/getFetch";
import { TeamsFormSchema, TeamsFormValue } from "@/lib/validators/schema";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface IUser {
  users: User[];
  initialData: Team | null;
}

export default function TeamForm({ initialData, users }: IUser) {
  const router = useRouter();
  const params = useParams();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = initialData ? "Edit Team" : "Create a new Team";
  const toastMessage = initialData ? "Team updated" : "Team created";
  const actionLabel = initialData ? "Save changes" : "Create";

  const form = useForm<TeamsFormValue>({
    resolver: zodResolver(TeamsFormSchema),
    defaultValues: {
      name: initialData?.name || "",
      ownerId: initialData?.ownerId || "",
    }
  });

  const onSubmit = async (values: TeamsFormValue) => {
    setLoading(true);
    try {
      const endpoint = initialData && params.id ? `/api/teams/${params.id}` : "/api/teams";
      const method = initialData ? 'PATCH' : 'POST';
      const data = await getFetch({ url: endpoint, method, body: values });

      if (!data) throw new Error("An error occurred while processing the request");

      toast.success(toastMessage);
      if (!initialData) {
        router.push("/admin/teams");
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
      const data = await getFetch({ url: `/api/teams/${params.id}`, method: 'DELETE' });

      if (data) {
        toast.success("User deleted");
        router.push("/admin/teams");
        router.refresh();
      } else {
        toast.error("An error occurred while deleting the user");
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
        <Heading title={title} description="User form" />
        {initialData && (
          <Button variant="destructive" size="icon" onClick={() => setOpen(true)}>
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
              name="ownerId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categories</FormLabel>
                  <Select
                    disabled={loading}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue defaultValue={field.value} placeholder="Select a owner" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {users.map((user) => (
                        <SelectItem key={user.id} value={user.id}>{user.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button disabled={loading} type="submit" className="ml-auto">
            {actionLabel}
          </Button>
        </form>
      </Form>
      <AlertModal
        isOpen={open}
        loading={loading}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
      />
    </>
  );
}
