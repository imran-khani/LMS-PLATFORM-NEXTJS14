import { auth } from "@clerk/nextjs/server";


const ChapterId = async ({params}:{params:{courseId:string; chapterId:string}}) => {

  const {userId} = auth()
  return (
    <div>

    </div>
  )
}

export default ChapterId
