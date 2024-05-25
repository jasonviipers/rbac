import { redirect } from "next/navigation";

import { useAuth } from "@/lib/validators/useAuth";
import Navbar from "@/components/global/navbar";

export default async function DashboardLayout({ children, params }: {
    children: React.ReactNode,
    params: { id: string }
}) {
    const { user } = await useAuth()

    if (!user) {
        redirect("/login")
    }


    return (
        <>
            {children}
        </>
    );
};