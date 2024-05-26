import { eq } from "drizzle-orm";

import Heading from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/lib/validators/useAuth";
import { db } from "@/server/db";
import { users } from "@/server/db/schema";


export default async function Page(){
    const  {user} = await useAuth();

    if(!user) return null;

    const getUserInfo = await db.query.users.findFirst({
        where: eq(users.id, user.id)
    })

    return(
        <div className="flex flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <Heading title="Dashboard" description={`Welcome back ${getUserInfo?.name}`} />
                <Separator />
            </div>
        </div>
    )
}