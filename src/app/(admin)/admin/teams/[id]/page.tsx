import { db } from "@/server/db";
import { eq } from "drizzle-orm";
import { teams } from "@/server/db/schema";
import TeamForm from "./_components/team-form";

export default async function TeamPage({ params }: { params: { id: string } }) {

    const findTeam = await db.query.teams.findFirst({
        where: eq(teams.id, params.id),
        with: {
            owner: true
        }
    }).then(data => data ?? null);

    const getUsers = await db.query.users.findMany();

    return (
        <div className="flex flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <TeamForm
                    initialData={findTeam}
                    users={getUsers} />
            </div>
        </div>
    )
}
