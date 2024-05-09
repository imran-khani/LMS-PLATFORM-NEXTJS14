import { IconBadge } from "@/components/iconBadge";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { ArrowLeft, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ChapterTitleForm } from "./_components/ChapterTitleForm";
import { ChapterDescriptionForm } from "./_components/DescriptionForm";


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

    return (
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
                </div>
            </div>
        </div>
    )
}

export default ChapterId
