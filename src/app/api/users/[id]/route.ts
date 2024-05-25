import { useAuth } from "@/lib/validators/useAuth";
import { db } from "@/server/db";
import { users } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { user } = await useAuth()
        if (!user) return new NextResponse("Unauthorized", { status: 401 })

        if (!params.id) return new NextResponse("Missing id", { status: 400 });

        console.log("=========> API GET", params.id, "<=========")

        const getUser = await db.query.users.findFirst({
            where: eq(users.id, params.id),
            // Exclude the hashedPassword field from the query
            columns: {
                id: true,
                name: true,
                discordId: true,
                githubId: true,
                email: true,
                emailVerified: true,
                avatar: true,
                currentTeamId: true,
                createdAt: true,
                updatedAt: true,
                hashedPassword: false, // Set to false to exclude
            },
        });

        if (!getUser) {
            // Return a 404 Not Found response if the user is not found
            return new NextResponse("User not found", { status: 404 });
        }

        return NextResponse.json(getUser)
    } catch (error) {
        return new NextResponse("Internal error", { status: 500 });
    }
};

export async function PATCH(req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        console.log("=========> API PATCH", params.id, "<=========")
        const { user } = await useAuth();
        const userId = params.id;
        const body = await req.json();

        console.log("=========> API PATCH", userId, "<=========")

        const checkUser = await db.query.users.findFirst({
            where: eq(users.id, userId)
        })

        if (!checkUser) return new NextResponse("User not found", { status: 404 });
        if (!user) return new NextResponse("Unauthorized", { status: 401 });
        if (!userId) return new NextResponse("User id is required", { status: 400 });

        const userUpdate = await db.update(users).set({
            ...body,
            updatedAt: new Date(),
        }).where(eq(users.id, userId)).returning();

        return NextResponse.json(userUpdate)
    } catch (error) {
        return new NextResponse("Internal error", { status: 500 });
    }
}


export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { user } = await useAuth();
        const userId = params.id;

        console.log("=========> API DELETE", userId, "<=========")

        if (!user) return new NextResponse("Unauthorized", { status: 401 });
        if (!userId) return new NextResponse("User id is required", { status: 400 });

        const checkUser = await db.query.users.findFirst({
            where: eq(users.id, userId)
        })

        if (!checkUser) return new NextResponse("User not found", { status: 404 });

        const userDelete = await db.delete(users).where(eq(users.id, userId)).returning()

        return NextResponse.json(userDelete)
    } catch (error) {
        return new NextResponse("Internal error", { status: 500 });
    }
}