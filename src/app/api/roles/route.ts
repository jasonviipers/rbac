import { NextRequest, NextResponse } from "next/server";
import { generateId } from "lucia";

import { useAuth } from "@/lib/validators/useAuth";
import { db } from "@/server/db";
import { Scrypt } from "oslo/password";
import { eq } from "drizzle-orm";
import { role } from "@/server/db/schema";


export async function GET(req: NextRequest) {
    try {
        const { user } = await useAuth();
        if (!user) return new NextResponse("Unauthorized", { status: 401 });

        const findRoles = await db.select().from(role)
            .where(eq(role.id, user.id));

        return NextResponse.json(findRoles);
    } catch (error) {
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const { user } = await useAuth();
        const body = await req.json();

        const { name, descriptions } = body;

        if (!user) return new NextResponse("Unauthorized", { status: 401 });
        if (!name) return new NextResponse("Name is required", { status: 400 });
        if (!descriptions) return new NextResponse("Descriptions is required", { status: 400 });

        const findRoles = await db.select().from(role)
            .where(eq(role.id, user.id));

        if (!findRoles) return new NextResponse("Unauthorized", { status: 401 });

        

    } catch (error) {

    }
}