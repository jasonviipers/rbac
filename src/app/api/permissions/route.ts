import { NextRequest, NextResponse } from "next/server";
import { useAuth } from "@/lib/validators/useAuth";
import { db } from "@/server/db";
import { permission, teams } from "@/server/db/schema";
import { generateId } from "lucia";
import { eq } from "drizzle-orm";

export async function GET(req: NextRequest) {
    try {
        const { user } = await useAuth();
        if (!user) return new NextResponse("Please authenticate to access this resource", { status: 401 });

        const findPermission = await db.query.permission.findMany();

        console.log("=========>function GET", findPermission);

        return NextResponse.json({ findPermission });
    } catch (error) {
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}

export const POST = async (req: NextRequest) => {
    try {
        const { user } = await useAuth();
        if (!user) return new NextResponse("Please authenticate to access this resource", { status: 401 });

        const body = await req.json();
        const { name, description, teamId } = body;

        if (!name || !description) return new NextResponse("Missing or invalid fields: name, description", { status: 400 });
        if (!teamId) return new NextResponse("Missing or invalid field: teamId", { status: 400 });

        const teamExists = await db.query.teams.findFirst({ where: eq(teams.id, teamId) });

        if (!teamExists) return new NextResponse("Team not found", { status: 404 });

        const newPermission = await db.insert(permission).values({
            id: generateId(21),
            teamId,
            name,
            description,
            createdAt: new Date(),
        });

        return NextResponse.json(newPermission);
    } catch (error) {
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}