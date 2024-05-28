import { getProgress } from "@/actions/get-progess";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import CourseSidebar from "./_components/CourseSidebar";
import CourseNavbar from "./_components/CourseNavbar";
import { Course } from "@prisma/client";

const courseLayout = async ({ children, params }: { children: React.ReactNode; params: { courseId: string } }) => {


    const { userId } = auth()
    if (!userId) {
        return redirect('/')
    }
    const course = await db.course.findUnique({
        where: {
            id: params.courseId
        },
        include: {
            chapters: {
                where: {
                    isPublished: true
                },
                include:{
                    userProgress:{
                        where:{
                            userId,
                        }
                    }
                },
                orderBy:{
                    position: 'asc'
                }
            }
        }
    })
    if (!course) {
        return redirect('/')
    }

    const progress = await getProgress(userId, course.id)

    return (
        <div className="h-full">
            <div className="flex h-[80px] md:pl-80 fixed inset-y-0 w-full z-50">
            <CourseNavbar 
            // @ts-ignore
             course = {course}
             progressCount = {progress}
            />
            </div>
            <div className="hidden md:flex h-full w-80 flex-col fixed inset-y-0 z-50">
                <CourseSidebar 
                 course = {course}
                    progress = {progress}
                />
            </div>
            <main 
            className="md:pl-80 h-full pt-[80px]"
            >
            {children}
            </main>
        </div>
    );
}

export default courseLayout;