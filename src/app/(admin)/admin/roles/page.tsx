import { format } from "date-fns"

import { db } from "@/server/db";
import RoleClient from "./_components/role";
import { RoleColumn } from "./_components/columns";

export default async function Page() {

    const findRoles = await db.query.role.findMany();

    const formatedRole: RoleColumn[] = findRoles.map((role) => (
        {
            id: role.id,
            name: role.name,
            description: role.descriptions || '',
            createdAt: format(new Date(role.createdAt), 'dd/MM/yyyy'),
        }
    ));

    return (
        <div className="flex flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <RoleClient data={formatedRole} />
            </div>
        </div>
    )
}