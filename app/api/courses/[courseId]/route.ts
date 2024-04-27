
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";


export async function PATCH(req: Request, { params }: { params: { courseId: string } }) {

    try {
        const { userId } = auth()

        if (!userId) {
            return new NextResponse('Unauthorized', { status: 401 })
        }
        const { courseId } = params
        const values = await req.json();

        const courseTitle = await db.course.update({
            where: {
                id: courseId,
                userId,
            },
            data: {
                ...values,
            }
        })

        return NextResponse.json(courseTitle)
    } catch {
        return NextResponse.error()
    }

}