import { UploadDropzone } from "@uploadthing/react";

import { OurFileRouter, ourFileRouter } from "@/app/api/uploadthing/core";


interface FileUploadProps {
    onChange:(url:string)=> void;
    endpoint:keyof typeof ourFileRouter
}


const fileUpload = () => {
  return (
    <div>fileUpload</div>
  )
}

export default fileUpload