import { Lucia, TimeSpan } from "lucia";
import { Discord, GitHub } from "arctic";
import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle";
import { sessions, users, type User as DbUser } from "@/server/db/schema";
import { env } from "@/env";
import { db } from "@/server/db";

const adapter = new DrizzlePostgreSQLAdapter(db, sessions, users);

export const lucia = new Lucia(adapter, {
    getSessionAttributes: () => {
        return {}
    },
    getUserAttributes: (attributes) => {
        return {
            id: attributes.id,
            email: attributes.email,
            emailVerified: attributes.emailVerified,
            avatar: attributes.avatar,
            createdAt: attributes.createdAt,
            updatedAt: attributes.updatedAt,
        }
    },
    sessionExpiresIn: new TimeSpan(30, "d"),
    sessionCookie: {
        name: "session",
        expires: false, // session cookies have very long lifespan (2 years)
        attributes: {
            secure: env.NODE_ENV === "production",
        },
    },
})


export const github = new GitHub(
    env.AUTH_GITHUB_ID,
    env.AUTH_GITHUB_SECRET,
);

declare module "lucia" {
    interface Register {
        Lucia: typeof lucia;
        DatabaseSessionAttributes: DatabaseSessionAttributes;
        DatabaseUserAttributes: DatabaseUserAttributes;
    }
}

interface DatabaseSessionAttributes { }
interface DatabaseUserAttributes extends Omit<DbUser, "hashedPassword"> { }