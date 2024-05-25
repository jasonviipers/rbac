"use client";

import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";

import { columns } from "./columns";
import Heading from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/ui/data-table";
import { Team } from "@/server/db/schema";

interface IUserClient {
    data: Team[];
}

export default function TeamClient({ data }: IUserClient) {
    const router = useRouter();

    return (
        <>
            <div className='flex items-center justify-between'>
                <Heading
                    title={`Team (${data.length})`}
                    description='Manage your team members here.'
                />
                <Button
                    onClick={() => router.push(`/admin/teams/new`)}
                >
                    <Plus className='h-4 w-4 mr-2' />
                    Create Team
                </Button>
            </div>
            <Separator />
            <DataTable columns={columns} data={data} searchKey='name' />
        </>
    )
}