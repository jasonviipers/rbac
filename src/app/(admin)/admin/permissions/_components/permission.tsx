"use client";

import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";

import Heading from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/ui/data-table";
import { Permission } from "@/server/db/schema";
import { columns } from "./columns";

interface IPermissionClient {
    data: Permission[]
}

export default function PermissionClient({ data }: IPermissionClient) {
    const router = useRouter();

    return (
        <>
            <div className='flex items-center justify-between'>
                <Heading
                    title={`Permission (${data.length})`}
                    description='Manage Roles'
                />
                <Button
                    onClick={() => router.push(`/admin/permissions/new`)}
                >
                    <Plus className='h-4 w-4 mr-2' />
                    Create Permission
                </Button>
            </div>
            <Separator />
            <DataTable columns={columns} data={data} searchKey='name' />
        </>
    )
}