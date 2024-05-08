import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";


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

  const completetionText = `(${totalFields}/${completedFields})`;

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
        </div>
      </div>
    </div>
  )
}

export default ChapterId
