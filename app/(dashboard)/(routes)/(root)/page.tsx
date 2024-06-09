import { getDashboardCourses } from "@/actions/get-dashboard-courses";
import CoursesList from "@/components/CoursesList";
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation";
import InfoCard from './_components/InfoCard';

const Dashboard =async () => {
    const {userId} = auth();
    if (!userId){
        return redirect('/');
    }

    //  const {
    //     completedCourses,
    //     coursesInProgress
    //  } = await getDashboardCourses(userId);
  return (
    <div
    className="p-6 space-y-4"
    >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
           <InfoCard />
            {/* <CoursesList
            items={[...coursesInProgress, ...completedCourses]}
            /> */}
        </div>
    </div>
  )
}

export default Dashboard