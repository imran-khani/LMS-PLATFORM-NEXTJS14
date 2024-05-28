import { getChaptes } from "@/actions/get-chapters";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

interface IParams {

    courseId: string;
    chapterId: string
}
const ChapterId = async (params: IParams) => {

    const { userId } = auth()
    if (!userId) return redirect('/');

    const {
        attachments,
        chapter,
        course,
        muxData,
        nextChapter,
        purchase,
        userProgress
    } = await getChaptes({
        courseId: params.courseId,
        userId,
        chapterId: params.chapterId
    })

    if (!course || !chapter) { return redirect('/') };
    const isLocked = !chapter.isFree && !purchase;


    return (
        <div>ChapterId</div>
    )
}

export default ChapterId