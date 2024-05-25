import { cookies } from "next/headers";
import { generateState } from "arctic";
import { github } from "@/server/auth";
import { env } from "@/env";

export async function GET(): Promise<Response> {
    const state = generateState();
    const url = await github.createAuthorizationURL(state, {
        scopes: ["user", "user:email"],
    });

    cookies().set("github_oauth_state", state, {
        path: "/",
        secure: env.NODE_ENV === "production",
        httpOnly: true,
        maxAge: 60 * 5, // 5 minutes
        sameSite: "lax", // CSRF protection
    });

    return Response.redirect(url, 302);
}