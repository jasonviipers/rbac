import { db } from "@/server/db";
import TeamClient from "./_components/team-client";
import { Teamcolumns } from "./_components/columns";
import { format } from "date-fns";

export default async function UserPage() {
  const findTeam = await db.query.teams.findMany({
    with: {
      owner: true
    }
  });

  const formatted: Teamcolumns[] = findTeam.map((team) => {
    return {
      id: team.id,
      name: team.name,
      ownerId: team.ownerId || '',
      ownerName: team.owner.name,
      createdAt: format(new Date(team.createdAt), 'dd/MM/yyyy'),
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
