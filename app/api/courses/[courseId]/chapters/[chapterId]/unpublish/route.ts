import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";


export async function PATCH(req: Request, { params }: { params: { courseId: string, chapterId: string } }) {
    try {

        const { userId } = auth()
        if (!userId) return new NextResponse('Unauthorized', { status: 401 });

        const ownerOfCourse = await db.course.findUnique({
            where: {
                id: params.courseId,
                userId
            }
        })

        if (!ownerOfCourse) return new NextResponse('Unauthorized', { status: 401 });

        const unpublishChapter = await db.chapter.update({
            where: {
                id: params.chapterId,
                courseId: params.courseId,
            },
            data: {
                isPublished: false
            }
        })

        const publishedchaperincourse = await db.chapter.findMany({
            where: {
                courseId: params.courseId,
                isPublished: true
            }
        })

        if (!publishedchaperincourse) {
            await db.course.update({
                where: {
                    id: params.courseId,
                },
                data: {
                    isPublished: false
                }
            })
        }

        return NextResponse.json(unpublishChapter)

    } catch {
        console.log('Error unpublishing chapter')
        return new NextResponse('Internal server error', { status: 501 })
    }
}


