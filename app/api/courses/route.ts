import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function POST(req: Request) {
    try {
        const { userId } = auth()
        const { title } = await req.json()

        if (!userId) {
            return new NextResponse('Unauthorized', { status: 401 })
        }
        const courese = await db.course.create({
            data: {
                userId,
                title
            }
        })

        return NextResponse.json(courese)

    } catch {
        return NextResponse.error()
    }
}