import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

interface Iparmas {
    params: {
        courseId: string
    }
}

export async function PATCH(req: Request, { params }: Iparmas) {
    try {

        const { userId } = auth()
        if (!userId) return new NextResponse('Unauthorized user', { status: 401 });

        const owner = await db.course.findUnique({
            where: {
                id: params.courseId
            }
        })

        if (!owner) return new NextResponse('Unauthorized user', { status: 401 });

        if (owner.userId !== userId) return new NextResponse('Unauthorized user', { status: 401 });

        const course = await db.course.findUnique({
            where: {
                id: params.courseId,
                userId
            },
        })

        if (!course) return new NextResponse('Course not found', { status: 404 });

        const unPublishCourse = await db.course.update({
            where: {
                id: params.courseId,
                userId,
            },
            data: {
                isPublished: false
            }
        })

        return NextResponse.json(unPublishCourse)

    } catch (error) {
        console.error(error)
        return new NextResponse('Error Unpublishing this Course!', { status: 500 })
    }
}