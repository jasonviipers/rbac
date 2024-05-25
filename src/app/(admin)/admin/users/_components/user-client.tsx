"use client";

import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";

import { UserColumns, columns } from "./columns";
import Heading from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/ui/data-table";

interface IUserClient {
    data: UserColumns[];
}

export default function UserClient({ data }: IUserClient) {
    const router = useRouter();

    return (
        <>
            <div className='flex items-center justify-between'>
                <Heading
                    title={`User (${data.length})`}
                    description='Manage Users'
                />
                <Button
                    onClick={() => router.push(`/admin/users/new`)}
                >
                    <Plus className='h-4 w-4 mr-2' />
                    Create User
                </Button>
            </div>
            <Separator />
            <DataTable columns={columns} data={data} searchKey='name' />
        </>
    )
}