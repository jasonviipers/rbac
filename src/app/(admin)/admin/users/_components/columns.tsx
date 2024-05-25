"use client"

import { ColumnDef } from "@tanstack/react-table"
import CellAction from "./cell-action";
import { User } from "@/server/db/schema";

export const columns: ColumnDef<User>[] = [
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