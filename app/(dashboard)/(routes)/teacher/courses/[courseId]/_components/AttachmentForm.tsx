"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import axios from "axios";
import * as z from "zod";

import { Attachment, Course } from "@prisma/client";

import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/fileUpload";

import { File, Loader2, PlusCircle, X } from "lucide-react";

const formSchema = z.object({
    url: z.string().min(1),
});

interface AttachmentFormProps {
    initialData: Course & {attachments: Attachment[]};
    courseId: string;
}

export const AttachmentForm = ({ initialData, courseId }: AttachmentFormProps) => {
    // Form editing state
    const [isEditing, setIsEditing] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const router = useRouter();

    // toggle editing state
    const toggleEditing = () => {
        setIsEditing((prev) => !prev);
    };

    //  this function is called when the form is submitted
    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        try {
            // make a request to the server to update the course image
            await axios.post(`/api/courses/${courseId}/attachments`, data);

            // toggle the editing state
            toggleEditing();
            toast.success("Course attachments updated");
            // refresh the page
            router.refresh();
        } catch {
            toast.error("An error occurred");
        }
    };

    const onDelete = async (id:string)=>{
        try {
            setDeletingId(id);
            await axios.delete(`/api/courses/${courseId}/attachments/${id}`)
            toast.success("Attachment deleted")
            router.refresh();
        } catch  {
            toast.error("An error occurred");
        }
        finally{
            setDeletingId(null);
        }
    }

    return (
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Course attachments
                <Button onClick={toggleEditing} variant={"ghost"}>
                    {isEditing && <>Cancel</>}

                    {!isEditing &&(
                        <>
                            <PlusCircle className="h-4 w-4 mr-2" />
                            Add a file
                        </>
                    )}
                </Button>
            </div>
           {
            !isEditing && (
                <>
                {initialData.attachments.length === 0 && (
                    <p className="text-sm mt-2 text-slate-500 italic">
                        No attachments
                    </p>
                )} 
                {
                    initialData.attachments.length > 0 && (
                        <div className="space-y-2">
                            {
                                initialData.attachments.map((attachment)=>(
                                    <div
                                    key={attachment.id}
                                    className="flex items-center p-3 w-full bg-sky-100 border-sky-200 border text-sky-700 rounded-md">
                                    <File className="h-4 w-4 mr-2 flex-shrink-0" />
                                    <p className="text-xs line-clamp-1">
                                        {attachment.name}
                                    </p>
                                    {deletingId === attachment.id && (
                                        <div>
                                            <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                                        </div>
                                    )}

                                    {
                                        deletingId !== attachment.id && (
                                            <button 
                                            onClick={()=> onDelete(attachment.id)}
                                            className="ml-auto transition opacity-75">
                                                <X className="h-4 w-4" />
                                            </button>
                                        )
                                    }
                                    </div>
                                ))
                            }
                        </div>
                    )
                }
                </>
            )
           }
            {isEditing && (
                <>
                    <FileUpload
                        endpoint="courseAttachment"
                        onChange={(url) => {
                            if (url) {
                                onSubmit({ url: url });
                            }
                        }}
                    />
                    <div className="text-xs text-muted-foreground mt-4">
                        Upload a file to attach to this course
                    </div>
                </>
            )}
        </div>
    );
};

