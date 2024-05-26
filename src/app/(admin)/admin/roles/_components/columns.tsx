"use client"

import { ColumnDef } from "@tanstack/react-table"
import CellAction from "./cell-action";

export type RoleColumn = {
    id: string;
    name: string;
    teamId: string;
    teamName: string;
    descriptions: string;
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
        header: "Descriptions",
        accessorKey: "descriptions",
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