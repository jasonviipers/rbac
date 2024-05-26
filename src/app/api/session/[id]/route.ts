import { useAuth } from "@/lib/validators/useAuth";
import { db } from "@/server/db";
import { sessions } from "@/server/db/schema";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { user, session } = await useAuth();

        if (!user) return new NextResponse("Unauthorized", { status: 401 });
        if (!params.id) return new NextResponse("Missing session id", { status: 400 });

        console.log("=========> API DELETE", params.id, "<=========")

        const checkSession = await db.query.sessions.findFirst({
            where: and(
                eq(sessions.userId, user.id),
                eq(sessions.id, params.id)
            )
        });

        if (!checkSession) return new NextResponse("Session not found or unauthorized", { status: 404 });

        const del = await db.delete(sessions)
            .where(and(
                eq(sessions.userId, user.id),
                eq(sessions.id, params.id)
            ));

        if (!del) return new NextResponse("Failed to delete session", { status: 500 });

        return new NextResponse("Session deleted", { status: 200 });

    } catch (error) {
        console.error("Error deleting session:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
