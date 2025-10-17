import { usersTable } from "@/config/schema";
import { NextResponse } from "next/server";
import { db } from "@/config/db";
import { eq } from "drizzle-orm";

export async function POST(req) {
  try {
    const { email, name } = await req.json();

    // same functionality, just validation to prevent crash
    if (!email || !name) {
      return NextResponse.json({ error: "Missing name or email" }, { status: 400 });
    }

    // check if user already exists
    const users = await db.select().from(usersTable).where(eq(usersTable.email, email));

    // if not, create new user
    if (users.length === 0) {
      const result = await db
        .insert(usersTable)
        .values({
          name: name,
          email: email
        })
        .returning(usersTable);

      return NextResponse.json(result);
    }

    // return existing user
    return NextResponse.json(users[0]);

  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
