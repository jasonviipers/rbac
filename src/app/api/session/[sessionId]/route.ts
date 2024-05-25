import { useAuth } from "@/lib/validators/useAuth";
import { db } from "@/server/db";
import { sessions } from "@/server/db/schema";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest, { params }: { params: { sessionId: string } }) {
    try {
        const { user } = await useAuth();
        const sessionId = params.sessionId;

        if (!user) return new NextResponse("Unauthorized", { status: 401 });

        const del = await db.delete(sessions)
            .where(and(
                eq(sessions.userId, user.id),
                eq(sessions.id, sessionId))
            );

        if (!del) return new NextResponse("Unauthorized", { status: 401 });
        
        return new NextResponse("Deleted", { status: 200 });

    } catch (error) {
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

