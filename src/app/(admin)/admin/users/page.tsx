import { db } from "@/server/db";
import UserClient from "./_components/user-client";
import { User } from "@/server/db/schema";

export default async function UserPage() {
  const findUser = await db.query.users.findMany();

  const formatted: User[] = findUser.map((user) => {
    return {
      id: user.id,
      name: user.name,
      discordId: user.discordId || null,
      githubId: user.githubId || null,
      email: user.email,
      emailVerified: user.emailVerified || false,
      hashedPassword: user.hashedPassword || null,
      avatar: user.avatar || null,
      currentTeamId: user.currentTeamId || null,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };
  });

  return (
    <div className='flex flex-col'>
      <div className='flex-1 space-y-4 p-8 pt-6'>
        <UserClient data={formatted} />
      </div>
    </div>
  );
}
