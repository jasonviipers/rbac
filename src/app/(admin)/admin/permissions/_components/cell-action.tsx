"use client"
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Copy, Edit, MoreHorizontal, Trash } from "lucide-react";

import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
    DropdownMenuSeparator, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import AlertModal from "@/components/modals/alert-modal";
import { toast } from "sonner";
import { Permission } from "@/server/db/schema";
import { getFetch } from "@/lib/getFetch";

interface ICellAction {
    data: Permission
}

export default function CellAction({ data }: ICellAction) {
    const router = useRouter();

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const onCopy = (id: string) => {
        navigator.clipboard.writeText(id);
        toast.success("Id copied to clipboard");
    }

    const onDelete = async () => {
        try {
            setLoading(true);
            await getFetch({
                url: `/api/permissions/${data.id}`,
                method: "DELETE"
            });
            router.refresh();
            toast.success("Permission deleted");
        } catch (error) {
            toast.error("Failed to delete permission");
        } finally {
            setLoading(false);
            setOpen(false);
        }
    }

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open Menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => onCopy(data.id)}>
                        <Copy className="mr-2 h-4 w-4" />
                        Copy Id
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push(`permissions/${data.id}`)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Update
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setOpen(true)}>
                        <Icons.trash className="mr-2 h-4 w-4 " />
                        Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            <AlertModal
                isOpen={open}
                loading={loading}
                onClose={() => setOpen(false)}
                onConfirm={onDelete}
            />
        </>
    )
}