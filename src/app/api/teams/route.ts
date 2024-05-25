import { NextRequest, NextResponse } from "next/server";

import { useAuth } from "@/lib/validators/useAuth";
import { db } from "@/server/db";
import { eq } from "drizzle-orm";
import { teams, users } from "@/server/db/schema";
import { generateId } from "lucia";

export async function GET(req: NextRequest) {
    try {
        const { user } = await useAuth();
        if (!user) return new NextResponse("Please authenticate to access this resource", { status: 401 });

        const findTeams = await db.query.teams.findMany();

        return NextResponse.json(findTeams);
    } catch (error) {
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}

export async function POST(req: NextRequest) {
    try {
        // const { user } = await useAuth();
        // if (!user) return new NextResponse("Please authenticate to access this resource", { status: 401 });

        const body = await req.json();
        const { name, ownerId } = body;

        if (!name || !ownerId) return new NextResponse("Missing or invalid fields: name, ownerId", { status: 400 });

        const findUsers = await db.query.users.findMany({
            where: eq(users.id, ownerId)
        });

        if (!findUsers.length) return new NextResponse("User not found", { status: 404 });

        const newTeam = await db.insert(teams).values({
            id: generateId(21),
            name,
            ownerId,
            createdAt: new Date()
        });

        return NextResponse.json(newTeam);
    } catch (error) {
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}