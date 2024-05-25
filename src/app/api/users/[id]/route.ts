import { useAuth } from "@/lib/validators/useAuth";
import { db } from "@/server/db";
import { users } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { generateId } from "lucia";
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
        const { user } = await useAuth();
        const body = await req.json();
        const userId = params.id;
        const { name, email, hashedPassword } = body;

        if (!name || !email || !hashedPassword) return new NextResponse("Missing fields", { status: 400 });

        if (!user) return new NextResponse("Unauthorized", { status: 401 });
        if (!userId) return new NextResponse("User id is required", { status: 400 });

        const checkUser = await db.query.users.findFirst({
            where: eq(users.id, userId)
        })

        if (!checkUser) return new NextResponse("User not found", { status: 404 });

        const userUpdate = await db.update(users).set({
            id: generateId(12),
            name,
            email,
            hashedPassword
        }).where(eq(users.id, userId)).returning()

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