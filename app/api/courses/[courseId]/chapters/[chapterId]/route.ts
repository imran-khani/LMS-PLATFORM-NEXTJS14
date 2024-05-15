
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import Mux from '@mux/mux-node';


const mux = new Mux({
    tokenId: process.env.MUX_TOKEN_ID,
    tokenSecret: process.env.MUX_TOKEN_SECRET
});

export async function PATCH(req: Request, { params }: { params: { courseId: string, chapterId: string } }) {

    try {

        const { userId } = auth();
        if (!userId) return new NextResponse('Unauthorized', { status: 401 });
        const { isPublished, ...values } = await req.json();


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
        });

        if (values.videoUrl) {
            const existingVideo = await db.muxData.findFirst({
                where: {
                    chapterId: params.chapterId
                }
            })
            if (existingVideo) {
                await mux.video.assets.delete(existingVideo.assetId);
                await db.muxData.delete({
                    where: {
                        id: existingVideo.id
                    }
                })
            }

            const asset = await mux.video.assets.create({
                input: values.videoUrl,
                playback_policy: ['public'],
                test: false,
            });

            await db.muxData.create({
                data: {
                    chapterId: params.chapterId,
                    assetId: asset.id,
                    playbackId: asset.playback_ids?.[0].id,

                }
            })
        }

        return NextResponse.json(chapter)

    } catch {
        console.error(`Error at updating chapter ${params.chapterId} in course ${params.courseId}`)
        return new NextResponse('Internal Server Error', { status: 500 })
    }
}


export async function DELETE(req: Request, { params }: { params: { courseId: string, chapterId: string } }) {
    try {

        const { userId } = auth()

        if (!userId) return new NextResponse('Unauthorized', { status: 401 });

        const owner = await db.course.findUnique({
            where: {
                id: params.courseId,
                userId,
            }
        })
        if (!owner) return new NextResponse('Unauthorized', { status: 401 });

        const chapter = await db.chapter.findFirst({
            where: {
                id: params.chapterId,
                courseId: params.courseId,
            }
        })
        if (!chapter) return new NextResponse('Not Found', { status: 404 })

        if (chapter.videoUrl) {
            const existingVideo = await db.muxData.findFirst({
                where: {
                    chapterId: params.chapterId,
                }
            })
            if (existingVideo) {
                await mux.video.assets.delete(existingVideo.assetId)
                await db.muxData.delete({
                    where: {
                        id: existingVideo.id
                    }
                })
            }
        }

        const deletedChapter = await db.chapter.delete({
            where: {
                id: params.chapterId
            }
        })

        const publishedChaptersInCourse = await db.chapter.findMany({
            where: {
                courseId: params.courseId,
                isPublished: true,
            }
        })

        if (!publishedChaptersInCourse.length) {
            await db.course.update({
                where: {
                    id: params.courseId
                },
                data: {
                    isPublished: false
                }
            })
        }


        return NextResponse.json(deletedChapter)
    } catch {
        return new NextResponse('Internal server error', { status: 501 })
    }
}