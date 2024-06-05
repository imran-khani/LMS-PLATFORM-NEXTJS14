import { getChapters } from "@/actions/get-chapters";
import Banner from "@/components/banner";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import VideoPlayer from "./_components/VideoPlayer";
import CourseEnrollButton from "./_components/CourseEnrollButton";
import { Separator } from "@/components/ui/separator";

interface IParams {
    courseId: string;
    chapterId: string;
}
const ChapterIdPage = async ({
    params,
}: {
    params: { courseId: string; chapterId: string };
}) => {
    const { userId } = auth();

    if (!userId) {
        return redirect("/");
    }

    const {
        chapter,
        course,
        muxData,
        attachments,
        nextChapter,
        userProgress,
        purchase,
    } = await getChapters({
        userId,
        chapterId: params.chapterId,
        courseId: params.courseId,
    });

    if (!chapter || !course) {
        return redirect("/");
    }

    const isLocked = !chapter.isFree && !purchase;
    const completeOnEnd = !!purchase && !userProgress?.isCompleted;

    return (
        <div>
            {userProgress?.isCompleted && (
                <Banner label="Chapter Completed" variant={"success"} />
            )}
            {isLocked && (
                <Banner
                    label="Please purchase the course first."
                    variant={"warning"}
                />
            )}
            <div className="flex flex-col max-w-4xl mx-auto pb-20">
                <div className="p-4">
                    <VideoPlayer
                        chapterId={params.chapterId}
                        courseId={params.courseId}
                        title={chapter?.title!}
                        nextChapterId={nextChapter?.id}
                        playbackId={muxData?.playbackId!}
                        isLocked={isLocked}
                        completeOnEnd={completeOnEnd}
                    />
                </div>
                <div className="flex p-4 flex-col md:flex-row items-center justify-between">
                    <h2 className="text-2xl font-semibold mb-2">
                        {chapter?.title!}
                    </h2>
                    {purchase ? (
                        <>{/* todo course progress */}</>
                    ) : (
                        <>
                            <CourseEnrollButton
                                courseId={params.courseId}
                                price={course?.price!}
                            />
                        </>
                    )}
                </div>
                <Separator />
            </div>
        </div>
    );
};

export default ChapterIdPage;
