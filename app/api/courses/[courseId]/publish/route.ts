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
            include:{
                chapters:{
                    include:{
                        muxData:true
                    }
                }
            }
        })

        if (!course) return new NextResponse('Course not found', { status: 404 });

        const isChapterPublished = course.chapters.some(chapter => chapter.isPublished)

        if (!isChapterPublished || !course.title || !course.description || !course.price || !course.imageUrl){
            return new NextResponse('Course is not ready to be published', { status: 400 });
        }

        const publishCourse = await db.course.update({
            where:{
                id:params.courseId,
                userId,
            },
            data:{
                isPublished:true
            }
        })

        return NextResponse.json(publishCourse)

    } catch (error) {
        console.error(error)
        return new NextResponse('Error Publishing this Course!', { status: 500 })
    }
}


