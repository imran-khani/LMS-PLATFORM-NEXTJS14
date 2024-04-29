import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { CircleDollarSign, LayoutDashboard, ListChecks } from "lucide-react";

import { db } from "@/lib/db";
import { IconBadge } from "@/components/iconBadge";
import { TitleForm } from "./_components/TitleForm";
import { DescriptionForm } from "./_components/DescriptionForm";
import { ImageForm } from "./_components/ImageForm";
import { PriceForm } from "./_components/PriceForm";

const CourseIdPage = async ({
  params
}: {
  params: { courseId: string }
}) => {
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }

  const course = await db.course.findUnique({
    where: {
      id: params.courseId,
      userId
    },
  });

//   const categories = await db.category.findMany({
//     orderBy: {
//       name: "asc",
//     },
//   });

  if (!course) {
    return redirect("/");
  }

  const requiredFields = [
    course.title,
    course.description,
    course.imageUrl,
    course.price,
  ];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;

  const completionText = `(${completedFields} / ${totalFields})`;

  const isComplete = requiredFields.every(Boolean);

  return (
    <>
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-y-2">
            <h1 className="text-2xl font-medium">
              Course setup
            </h1>
            <span className="text-sm text-slate-700">
              Complete all fields {completionText}
            </span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={LayoutDashboard} />
              <h2 className="text-xl">
                Customize your course
              </h2>
            </div>
            <TitleForm
                initialData={{ title: course?.title || '' }}
                courseId={course.id}
            />
            <DescriptionForm
              initialData={{description:course?.description || ''}}
              courseId={course.id}
            />
            <ImageForm
              initialData={course}
              courseId={course.id}
            />
          </div>
          <div className="space-y-6">
                <div>
                    <div className="flex items-center gap-x-2">
                        <IconBadge icon={ListChecks} />
                        <h2 className="text-xl">Course Chapters</h2>
                    </div>
                    <div>
                        TODO:CHAPTERS
                    </div>
                </div>
                <div className="flex items-center gap-x-2">
                    <IconBadge icon={CircleDollarSign} />
                    <h2 className="text-xl">
                        Sell your course
                    </h2>
                </div>
                <PriceForm
                initialData={{price:course?.price }}
                courseId={course.id}
                />
          </div>
        </div>
      </div>
    </>
  );
}

export default CourseIdPage;