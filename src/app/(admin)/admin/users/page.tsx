import { db } from "@/server/db";
import UserClient from "./_components/user-client";
import { User } from "@/server/db/schema";
import { format } from "date-fns";

export default async function UserPage() {
  const findUser = await db.query.users.findMany({
    with: {
      teams: {
        with: {
          owner: true,
          permissions: true,
          roles: true,
          rolePermissions: true
        }
      }
    }
  });

  const formatted: User[] = findUser.map((user) => {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt ? format(new Date(user.createdAt), "MMMM do, yyyy") : ""
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
