import { db } from "@/server/db";
import PermissionClient from "./_components/permission";
import { Permission } from "@/server/db/schema";

export default async function(){
    const findPermission = await db.query.permission.findMany();

    const formatted: Permission[] = findPermission.map((permission) => {
        return {
            id: permission.id,
            name: permission.name || null,
            description: permission.description || null,
            teamId: permission.teamId || '',
            createdAt: permission.createdAt,
            updatedAt: permission.updatedAt ? new Date(permission.updatedAt) : null
        }
    });
    return (
        <div className='flex flex-col'>
            <div className='flex-1 space-y-4 p-8 pt-6'>
                <PermissionClient data={formatted}/>
            </div>
        </div>
    )
}