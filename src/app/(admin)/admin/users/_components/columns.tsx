"use client"

import { ColumnDef } from "@tanstack/react-table"
import CellAction from "./cell-action";

export type UserColumn = {
    id: string;
    name: string;
    discordId: string | null;
    githubId: string | null;
    email: string;
    emailVerified: boolean;
    hashedPassword: string | null;
    avatar: string | null;
    currentTeamId: string | null;
    createdAt: Date;
    updatedAt: Date | null;
}


export const columns: ColumnDef<UserColumn>[] = [
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