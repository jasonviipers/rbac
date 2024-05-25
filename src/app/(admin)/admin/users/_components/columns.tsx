"use client"

import { ColumnDef } from "@tanstack/react-table"
import CellAction from "./cell-action";

export type UserColumns = {
    name: string;
    id: string;
    email: string;
    currentTeamId: string | null;
    createdAt: string;
}

export const columns: ColumnDef<UserColumns>[] = [
    {
        header: "Name",
        accessorKey: "name",
    },
    {
        header: "Email",
        accessorKey: "email",
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