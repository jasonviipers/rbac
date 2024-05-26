"use client"

import { ColumnDef } from "@tanstack/react-table"
import CellAction from "./cell-action";

export type RoleColumn = {
    id: string;
    name: string;
    teamId: string;
    teamName: string;
    description: string;
    createdAt: string;
}

export const columns: ColumnDef<RoleColumn>[] = [
    {
        header: "Name",
        accessorKey: "name",
    },
    {
        header: "Team",
        accessorKey: "teamName",
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