import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";


const ChapterId = async ({params}:{params:{courseId:string; chapterId:string}}) => {

  const {userId} = auth()
  if (!userId) redirect('/')
    
  return (
    <div>

    </div>
  )
}

export default ChapterId
