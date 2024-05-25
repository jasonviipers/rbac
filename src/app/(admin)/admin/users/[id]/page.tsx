import { db } from "@/server/db";
import { eq } from "drizzle-orm";
import { users } from "@/server/db/schema";
import UserForm from "./_components/user-form";

export default async function UserPage({ params }: { params: { id: string } }) {
    const user = await db.query.users.findFirst({
        where: eq(users.id, params.id)
    }).then(data => data ?? null);

    console.log('=========>', user, '<=========');
    return (
        <div className="flex flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <UserForm initialData={user} />
            </div>
        </div>
    )
}
