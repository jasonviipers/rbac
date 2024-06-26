"use client"

import { ColumnDef } from "@tanstack/react-table"
import CellAction from "./cell-action";
import { Permission } from "@/server/db/schema";


export const columns: ColumnDef<Permission>[] = [
    {
        header: "Name",
        accessorKey: "name",
    },
    {
        header: "Description",
        accessorKey: "description",
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