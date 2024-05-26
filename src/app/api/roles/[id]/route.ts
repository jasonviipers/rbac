import { useAuth } from "@/lib/validators/useAuth";
import { db } from "@/server/db";
import { role } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req: NextRequest, { params }: { params: { id: string } }
) {
    try {
        const { user } = await useAuth();
        if (!user) return new NextResponse("Unauthorized", { status: 401 });
        if (!params.id) return new NextResponse("Missing id", { status: 400 });

        const getRole = await db.query.role.findFirst({
            where: eq(role.id, params.id),
        });
        if (!getRole) return new NextResponse("Role not found", { status: 404 });
        return NextResponse.json(getRole);
    } catch (error) {
        console.error(error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export async function PATCH(req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { user } = await useAuth();
        const roleId = params.id;
        const { name, descriptions, teamId } = await req.json();

        if (!user) return new NextResponse("Unauthorized", { status: 401 });
        if (!roleId) return new NextResponse("Missing id", { status: 400 });
        if (!name || !descriptions) return new NextResponse("Missing or invalid fields: name, description", { status: 400 });

        const checkRole = await db.query.role.findFirst({
            where: eq(role.id, roleId),
        });

        if (!checkRole) return new NextResponse("Role not found", { status: 404 });

        const updateRole = await db.update(role).set({
            name,
            descriptions,
            teamId
        }).where(eq(role.id, roleId)).returning();

        if (!updateRole) return new NextResponse("An error occurred while processing the request", { status: 500 });

        return new NextResponse(JSON.stringify(updateRole));
    } catch (error) {
        console.error(error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export async function DELETE(req: NextRequest,
    { params }: { params: { id: string } }
) {

}