"use client"

import { ColumnDef } from "@tanstack/react-table"
import CellAction from "./cell-action";
import { Team } from "@/server/db/schema";

export const columns: ColumnDef<Team>[] = [
    {
        header: "Name",
        accessorKey: "name",
    },
    {
        header: "Owner",
        accessorKey: "ownerId",

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