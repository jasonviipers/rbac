import { db } from "@/server/db";
import { Team } from "@/server/db/schema";
import TeamClient from "./_components/team-client";

export default async function UserPage() {
  const findTeam = await db.query.teams.findMany();

  const formatted: Team[] = findTeam.map((team) => {
    return {
      id: team.id,
      name: team.name,
      ownerId: team.ownerId || '',
      createdAt: team.createdAt,
      updatedAt: team.updatedAt ? new Date(team.updatedAt) : null
    };
  });

  return (
    <div className='flex flex-col'>
      <div className='flex-1 space-y-4 p-8 pt-6'>
        <TeamClient data={formatted} />
      </div>
    </div>
  );
}
