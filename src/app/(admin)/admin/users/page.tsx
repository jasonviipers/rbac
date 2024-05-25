import { db } from "@/server/db";
import UserClient from "./_components/user-client";
import { UserColumns } from "./_components/columns";
import { format } from "date-fns";

export default async function UserPage() {
  const findUser = await db.query.users.findMany();

  const formatted: UserColumns[] = findUser.map((user) => {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      currentTeamId: user.currentTeamId || null,
      createdAt: format(new Date(user.createdAt), 'dd/MM/yyyy'),
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
