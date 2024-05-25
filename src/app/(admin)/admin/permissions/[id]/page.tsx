import { db } from "@/server/db";
import PermissionForm from "./_components/permission-form";
import { eq } from "drizzle-orm";
import { permission } from "@/server/db/schema";

export default async function PermissionPage({ params }: { params: { id: string } }) {

    const findPermission = await db.query.permission.findFirst({
        where: (eq(permission.id, params.id))
    });

    const getTeam = await db.query.teams.findMany();

    return (
        <div className="flex flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <PermissionForm initialData={findPermission!} teams={getTeam} />
            </div>
        </div>
    );
}