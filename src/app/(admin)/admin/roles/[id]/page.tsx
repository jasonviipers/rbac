import { eq } from "drizzle-orm";
import { db } from "@/server/db";
import RoleForm from "./_components/role-form";
import { role } from "@/server/db/schema";

export default async function RolePage({ params }: { params: { id: string } }) {

    const roleQuery = await db.query.role.findFirst({
        where: eq(role.id, params.id),
        with: {
            team:true
        }
    });

    return (
        <div className="flex flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <RoleForm initialData={roleQuery} />
            </div>
        </div>
    );
} 