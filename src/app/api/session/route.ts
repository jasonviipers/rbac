import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { eq } from "drizzle-orm";
import { useAuth } from "@/lib/validators/useAuth";
import { lucia } from "@/server/auth";
import { db } from "@/server/db";
import { sessions } from "@/server/db/schema";

export async function POST(req: NextRequest) {
    try {
        const { user, session } = await useAuth();

        if (!user || !session) return new NextResponse("Unauthorized", { status: 401 });

        const del = await  db.delete(sessions)
            .where(eq(sessions.userId, user.id));

        if (del) return new NextResponse("Session not found or unauthorized", { status: 404 });

         // Remove the session cookie
         const sessionCookie = lucia.createBlankSessionCookie();
         cookies().set(
            sessionCookie.name,
            sessionCookie.value,
            sessionCookie.attributes
         );

        return new NextResponse("Session deleted", { status: 200 });

    } catch (error) {
        console.error("Error deleting session:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

// export async function logout(): Promise<{ error: string } | void> {
//     const { session } = await useAuth();
//     if (!session) {
//         return {
//             error: "No session found",
//         };
//     }
//     await lucia.invalidateSession(session.id);
//     const sessionCookie = lucia.createBlankSessionCookie();
//     cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
//     return redirect("/");
// }