"use client";

import { useParams, useRouter } from "next/navigation";
import { Plus } from "lucide-react";

import {  PermissionColumn, columns } from "./columns";
import Heading from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/ui/data-table";

interface IPermissionClient {
    data: PermissionColumn[]
}

export default function PermissionClient({ data }: IPermissionClient) {
    const router = useRouter();
    const params = useParams();

    return (
        <>
            <div className='flex items-center justify-between'>
                <Heading
                    title={`Permission (${data.length})`}
                    description='Manage Roles'
                />
                <Button
                    onClick={() => router.push(`/permission/new`)}
                >
                    <Plus className='h-4 w-4 mr-2' />
                    Add new
                </Button>
            </div>
            <Separator />
            <DataTable columns={columns} data={data} searchKey='name' />
        </>
    )
}