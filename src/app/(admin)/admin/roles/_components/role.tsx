"use client";

import { useParams, useRouter } from "next/navigation";
import { Plus } from "lucide-react";

import { RoleColumn, columns } from "./columns";
import Heading from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/ui/data-table";

interface IRoleClient {
    data: RoleColumn[]
}

export default function RoleClient({ data }: IRoleClient) {
    const router = useRouter();
    const params = useParams();

    return (
        <>
            <div className='flex items-center justify-between'>
                <Heading
                    title={`Roles (${data.length})`}
                    description='Manage Roles'
                />
                <Button
                    onClick={() => router.push(`/roles/new`)}
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