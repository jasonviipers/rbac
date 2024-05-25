import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { useAuth } from "@/lib/validators/useAuth";
import { db } from "@/server/db";
import { teams } from "@/server/db/schema";


export async function GET(req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { user } = await useAuth();
        if (!user) return new NextResponse("Unauthorized", { status: 401 });

        if (!params.id) return new NextResponse("Missing id", { status: 400 });

        console.log("=========> API GET", params.id, "<=========");

        const getTeam = await db.query.teams.findFirst({
            where: eq(teams.id, params.id),
        });

        if (!getTeam) {
            return new NextResponse("Team not found", { status: 404 });
        }

        return NextResponse.json(getTeam);
    } catch (error) {
        return new NextResponse("Internal error", { status: 500 });
    }
}

export async function PATCH(req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        console.log("=========> API PATCH", params.id, "<=========");
        const { user } = await useAuth();
        if (!user) return new NextResponse("Unauthorized", { status: 401 });

        const teamId = params.id;
        const body = await req.json();

        console.log("=========> API PATCH", teamId, "<=========");

        const checkTeam = await db.query.teams.findFirst({
            where: eq(teams.id, teamId),
        });

        if (!checkTeam) {
            return new NextResponse("Team not found", { status: 404 });
        }

        const { name, ownerId } = body;

        if (!name || !ownerId) {
            return new NextResponse("Missing or invalid fields: name, ownerId", { status: 400 });
        }

        await db.update(teams).set({
            name,
            ownerId,
        }).where(eq(teams.id, teamId));

        return new NextResponse("Team updated", { status: 200 });
    } catch (error) {
        return new NextResponse("Internal error", { status: 500 });
    }
}

export async function DELETE(req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { user } = await useAuth();
        if (!user) return new NextResponse("Unauthorized", { status: 401 });

        const teamId = params.id;

        console.log("=========> API DELETE", teamId, "<=========");

        const checkTeam = await db.query.teams.findFirst({
            where: eq(teams.id, teamId),
        });

        if (!checkTeam) {
            return new NextResponse("Team not found", { status: 404 });
        }

        await db.delete(teams).where(eq(teams.id, teamId));

        return new NextResponse("Team deleted", { status: 200 });
    } catch (error) {
        return new NextResponse("Internal error", { status: 500 });
    }
}