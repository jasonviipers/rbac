import { format } from "date-fns"

import { db } from "@/server/db";
import RoleClient from "./_components/role";
import { RoleColumn } from "./_components/columns";

export default async function Page() {

    const findRoles = await db.query.role.findMany();

    const formatedRole:RoleColumn[] = findRoles.map((role) => (
        {
            name: role.name,
            createdAt:role?.createdAt ? format(role.createdAt, "MMMM do, yyyy") : ""
        }
    ));

    return (
        <div className="flex flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <RoleClient data={[]}/>
            </div>
        </div>
    )
}