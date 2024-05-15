
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
