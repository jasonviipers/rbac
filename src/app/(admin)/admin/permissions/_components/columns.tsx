"use client"

import { ColumnDef } from "@tanstack/react-table"
import CellAction from "./cell-action";

export type PermissionColumn = {
    id: string;
    name: string;
    description?: string;
    createdAt: string;
    updatedAt?: string | null;
}


export const columns: ColumnDef<PermissionColumn>[] = [
    {
        header: "Name",
        accessorKey: "name",
    },
    {
        header: "Date",
        accessorKey: "createdAt",
    },
    {
        id: "actions",
        cell: ({ row }) => <CellAction data={row.original} />
    }

];