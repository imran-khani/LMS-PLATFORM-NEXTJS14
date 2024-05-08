
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";


export async function PATCH(req: Request, { params }: { params: { courseId: string, chapterId: string } }) {

    try {

        const { userId } = auth();
        if (!userId) return new NextResponse('Unauthorized', { status: 401 });
        const values = await req.json();


        const ownerOfCourse = await db.course.findUnique({
            where: {
                id: params.courseId,
                userId: userId
            }
        })

        if (!ownerOfCourse) return new NextResponse('Unauthorized', { status: 401 });

        const chapter = await db.chapter.update({
            where: {
                id: params.chapterId,
                courseId: params.courseId,
            },
            data: {
                ...values,
                updatedAt: new Date(),
            }
        }
        )



    } catch {
        return new NextResponse('Internal Server Error', { status: 500 })
    }



}
