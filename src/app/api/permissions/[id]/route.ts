import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { useAuth } from "@/lib/validators/useAuth";
import { permission } from "@/server/db/schema";
import { db } from "@/server/db";

export async function GET(req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { user } = await useAuth();
        if (!user) return new NextResponse("Unauthorized", { status: 401 });

        if (!params.id) return new NextResponse("Missing id", { status: 400 });

        console.log("=========> API GET", params.id, "<=========");

        const getUser = await db.query.permission.findFirst({
            where: eq(permission.id, params.id),
        });

        if (!getUser) {
            return new NextResponse("Permission not found", { status: 404 });
        }

        return NextResponse.json(getUser);
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
        const permissionId = params.id;
        const body = await req.json();

        console.log("=========> API PATCH", permissionId, "<=========");

        const checkPermission = await db.query.permission.findFirst({
            where: eq(permission.id, permissionId),
        });

        if (!checkPermission) {
            return new NextResponse("Permission not found", { status: 404 });
        }

        const { name, description } = body;

        if (!name || !description) {
            return new NextResponse("Missing or invalid fields: name, description", { status: 400 });
        }

        await db.update(permission).set({
            name,
            description,
        }).where(eq(permission.id, permissionId));

        return NextResponse.json({ name, description });
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
        const permissionId = params.id;

        console.log("=========> API DELETE", permissionId, "<=========");

        if (!user) return new NextResponse("Unauthorized", { status: 401 });
        if (!permissionId) return new NextResponse("Permission id is required", { status: 400 });

        const checkPermission = await db.query.permission.findFirst({
            where: eq(permission.id, permissionId),
        });

        if (!checkPermission) {
            return new NextResponse("Permission not found", { status: 404 });
        }

        await db.delete(permission).where(eq(permission.id, permissionId));

        return new NextResponse("Permission deleted", { status: 200 });
    } catch (error) {
        return new NextResponse("Internal error", { status: 500 });
    }
}