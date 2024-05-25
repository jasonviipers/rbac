import { db } from "@/server/db";
import { users } from "@/server/db/schema";
import { and, count, eq } from "drizzle-orm";


export const getUserCount = async () => {
    const userCount = await db.select({
        count: count(users),
    })
    .from(users)
    // .where(eq(users.id, users.currentTeamId))
    .execute();

    const getUserInfo = await db.select({
        name: users.name,
        email: users.email,
        id: users.id,
    })
    .from(users)
    .execute();

    return {
        userCount,
        getUserInfo
    };
};

