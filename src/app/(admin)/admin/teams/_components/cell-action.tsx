"use client"
import { useRouter } from "next/navigation";
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
import { Team } from "@/server/db/schema";

interface ICellAction {
    data: Team;
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
                url: `/api/teams/${data.id}`,
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
                    <DropdownMenuItem onClick={() => router.push(`teams/${data.id}`)}>
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