"use client"

import { ColumnDef } from "@tanstack/react-table"
import CellAction from "./cell-action";

export type Teamcolumns = {
    id: string;
    name: string;
    ownerId?: string;
    ownerName: string;
    createdAt: string
  }
export const columns: ColumnDef<Teamcolumns>[] = [
    {
        header: "Name",
        accessorKey: "name",
    },
    {
        header: "Owner",
        accessorKey: "ownerName",

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