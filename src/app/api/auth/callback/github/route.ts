import { cookies } from "next/headers";
import { generateId } from "lucia";
import { OAuth2RequestError } from "arctic";
import { eq } from "drizzle-orm";
import { github, lucia } from "@/server/auth";
import { db } from "@/server/db";
import { users } from "@/server/db/schema";

export async function GET(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const code = url.searchParams.get("code");
    const state = url.searchParams.get("state");
    const storedState = cookies().get("github_oauth_state")?.value ?? null;

    // Validate the presence of necessary parameters and state matching
    if (!code || !state || !storedState || state !== storedState) {
        return new Response(null, {
            status: 400,
            headers: { Location: '/login' },
        });
    }

    try {
        // Validate the authorization code with GitHub
        const tokens = await github.validateAuthorizationCode(code);

        // Fetch GitHub user data
        const githubUserRes = await fetch("https://api.github.com/user", {
            headers: {
                Authorization: `Bearer ${tokens.accessToken}`,
            },
        });
        const githubUser = await githubUserRes.json();

        // Fetch the user's email addresses
        const emailRes = await fetch("https://api.github.com/user/emails", {
            headers: {
                Authorization: `Bearer ${tokens.accessToken}`,
            },
        });
        const emails = await emailRes.json();

        // Ensure emails is an array
        if (!Array.isArray(emails)) {
            return new Response(
                JSON.stringify({ error: "Failed to fetch email addresses from GitHub." }),
                { status: 500 }
            );
        }

        const primaryEmail = emails.find((email: { email: string; verified: boolean; primary: boolean }) => email.primary && email.verified);

        if (!primaryEmail) {
            return new Response(
                JSON.stringify({ error: "Your GitHub account must have a verified email address." }),
                { status: 400, headers: { Location: '/login' } }
            );
        }

        // Ensure the user has a verified email
        if (!primaryEmail.email) {
            return new Response(
                JSON.stringify({ error: "Your GitHub account must have a verified email address." }),
                { status: 400, headers: { Location: '/login' } }
            );
        }

        // Check if the user already exists in the database
        const existingUser = await db.query.users.findFirst({
            where: (table, { eq, or }) => or(
                eq(table.githubId, githubUser.id),
                eq(table.email, primaryEmail.email)
            ),
        });

        const avatar = githubUser.avatar_url;

        // Handle new user registration
        if (!existingUser) {
            const userId = generateId(21);
            await db.insert(users).values({
                id: userId,
                email: primaryEmail.email,
                emailVerified: true,
                githubId: githubUser.id,
                avatar,
                createdAt: new Date(),
                updatedAt: new Date(),
            });

            const session = await lucia.createSession(userId, {});
            const sessionCookie = lucia.createSessionCookie(session.id);
            cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);

            return new Response(null, { status: 302, headers: { Location: '/' } });
        }

        // Update existing user data if necessary
        if (existingUser.githubId !== githubUser.id || existingUser.avatar !== avatar) {
            await db.update(users)
                .set({ githubId: githubUser.id, avatar, emailVerified: true })
                .where(eq(users.id, existingUser.id));
        }

        const session = await lucia.createSession(existingUser.id, {});
        const sessionCookie = lucia.createSessionCookie(session.id);
        cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);

        return new Response(null, { status: 302, headers: { Location: '/' } });


    } catch (error) {
        if (error instanceof OAuth2RequestError) {
            return new Response(
                JSON.stringify({ error: "An error occurred while authenticating with GitHub." }),
                { status: 400, headers: { Location: '/login' } }
            );
        }
        console.error('Unexpected error:', error);
        return new Response(
            JSON.stringify({ error: "An unexpected error occurred." }),
            { status: 500 }
        );
    }
}