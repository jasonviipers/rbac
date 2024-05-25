import { NextRequest, NextResponse } from "next/server";
import { generateId } from "lucia";
import { useAuth } from "@/lib/validators/useAuth";
import { db } from "@/server/db";
import { NewUser, users } from "@/server/db/schema";
import { Scrypt } from "oslo/password";

export async function GET(req: NextRequest) {
  try {
    const { user } = await useAuth();
    if (!user) return new NextResponse("Please authenticate to access this resource", { status: 401 });

    const findUsers = await db.query.users.findMany();

    // Exclude the hashedPassword field from the user objects
    const usersWithoutPasswords = findUsers.map((user) => {
      const { hashedPassword, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
    console.log("=========>function GET", usersWithoutPasswords);

    return NextResponse.json({ findUsers: usersWithoutPasswords });
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    // const { user } = await useAuth();
    // if (!user) return new NextResponse("Please authenticate to access this resource", { status: 401 });

    const body = await req.json();
    const { name, email, password } = body;

    if (!name || !email || !password) return new NextResponse("Missing or invalid fields: name, email, password", { status: 400 });

    const newUser: NewUser = {
      id: generateId(21),
      name,
      email,
      emailVerified: false,
      hashedPassword: await new Scrypt().hash(password),
      createdAt: new Date(),
    };

    await db.insert(users).values(newUser);

    return NextResponse.json({ newUser });
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}