import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

interface IParams {

    params:{
        courseId:string;
        chapterId:string;
    }
}
const ChapterId = (params:IParams) => {

    const {userId} = auth()
    if(!userId) return redirect('/');

    
  return (
    <div>ChapterId</div>
  )
}

export default ChapterId