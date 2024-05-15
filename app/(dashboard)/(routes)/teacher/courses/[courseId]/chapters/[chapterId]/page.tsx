import { IconBadge } from "@/components/iconBadge";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { ArrowLeft, Eye, LayoutDashboard, Video } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ChapterTitleForm } from "./_components/ChapterTitleForm";
import { ChapterDescriptionForm } from "./_components/DescriptionForm";
import { ChapterAccessForm } from "./_components/ChapterAccessForm";
import { VideoForm } from "./_components/VideoForm";
import Banner from "@/components/banner";
import ChapterActions from "./_components/ChapterActions";


const ChapterId = async ({ params }: { params: { courseId: string; chapterId: string } }) => {

    const { userId } = auth()
    if (!userId) redirect('/');

    const chapter = await db.chapter.findUnique({
        where: {
            id: params.chapterId,
            courseId: params.courseId
        },
        include: {
            muxData: true
        }
    })

    if (!chapter) redirect('/');


    // Get the required fields
    const requiredFields = [
        chapter.title,
        chapter.description,
        chapter.videoUrl,
    ]

    // Check if all required fields are completed
    const totalFields = requiredFields.length;

    // Count the number of completed fields
    const completedFields = requiredFields.filter(field => field).length;

    const completetionText = `(${completedFields}/${totalFields})`;

    const isComplete = requiredFields.every(Boolean)

    return (
        <>
       {!chapter.isPublished &&  (
        <Banner variant='warning'
        label="This chapter is not published yet.it won't be seen in chapters list."
        />
       )}
        <div className="p-6">
            <div className="flex items-center justify-between">
                <div className="w-full">
                    <Link
                        href={`/teacher/courses/${params.courseId}`}
                        className="flex items-center text-sm hover:opacity-75 transition mb-6"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to course
                    </Link>
                    <div className="flex items-center justify-between w-full">
                        <div className="flex flex-col gap-y-2">
                            <h1 className="text-2xl font-medium">
                                Chapter Creation
                            </h1>
                            <span
                                className="text-sm text-slate-700"
                            >
                                Complete all fields {completetionText}

                            </span>
                        </div>
                        <ChapterActions
                         disabled = {!isComplete}
                         courseId={params.courseId}
                         chapterId={params.chapterId}
                         isPublished ={chapter.isPublished}
                        />
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
                <div className="space-y-4">
                    <div>
                        <div className="flex items-center gap-x-2">
                            <IconBadge icon={LayoutDashboard} />
                            <h2 className="text-xl">
                                Customize your chapter
                            </h2>
                        </div>
                        <ChapterTitleForm
                            initialData={{ title: chapter.title }}
                            chapterId={params.chapterId}
                            courseId={params.courseId}
                        />
                        <ChapterDescriptionForm 
                        initialData={chapter}
                        chapterId={params.chapterId}
                        courseId={params.courseId}
                        />
                    </div>
                    <div>
                        <div className="flex items-center gap-x-2">
                            <IconBadge icon={Eye} />
                            <h2 className="text-xl">
                                Access Settings
                            </h2>
                        </div>
                        <ChapterAccessForm 
                        initialData={chapter}
                        courseId={params.courseId}
                        chapterId={params.chapterId}                        
                        />
                    </div>
                </div>
                <div>
                    <div className="flex items-center gap-x-2">
                        <IconBadge icon={Video} />
                        <h2 className="text-xl">
                            Add a Video
                        </h2>
                    </div>
                    <VideoForm
                    chapterId={params.chapterId}
                    courseId={params.courseId}
                    initialData={chapter}
                    />
                </div>
            </div>
        </div>
        </>
    )
}

export default ChapterId