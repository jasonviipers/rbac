"use client"
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Copy, Edit, MoreHorizontal } from "lucide-react";

import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
    DropdownMenuSeparator, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import AlertModal from "@/components/modals/alert-modal";
import { toast } from "sonner";
import { getFetch } from "@/lib/getFetch";
import { UserColumns } from "./columns";

interface ICellAction {
    data: UserColumns
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
                url: `/api/users/${data.id}`,
                method: "DELETE"
            });

            router.refresh();
            toast.success("User deleted");
        } catch (error) {
            toast.error("Failed to delete user");
        } finally {
            setLoading(false);
            setOpen(false);
        }
    }

    const onDisconnect = async () => {
        try {
            setLoading(true);
            await getFetch({
                url: `/api/session/${data.id}`,
                method: "DELETE"
            });

            router.refresh();
            toast.success("User disconnected");
        } catch (error) {
            toast.error("Failed to disconnect user");
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
                    <DropdownMenuItem onClick={() => router.push(`users/${data.id}`)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Update
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onDisconnect()}>
                        <Icons.disconnect className="mr-2 h-4 w-4" />
                        Disconnect
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