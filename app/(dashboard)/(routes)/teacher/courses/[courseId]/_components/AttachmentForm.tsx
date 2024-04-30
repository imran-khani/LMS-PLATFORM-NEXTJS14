"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import toast from "react-hot-toast";
import axios from "axios";
import * as z from "zod";

import { Attachment, Course } from "@prisma/client";

import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/fileUpload";

import { ImageIcon, PlusCircle } from "lucide-react";

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
    const router = useRouter();

    // toggle editing state
    const toggleEditing = () => {
        setIsEditing((prev) => !prev);
    };

    //  this function is called when the form is submitted
    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        try {
            // make a request to the server to update the course image
            await axios.patch(`/api/courses/${courseId}`, data);

            // toggle the editing state
            toggleEditing();
            toast.success("Course attachments updated");
            // refresh the page
            router.refresh();
        } catch {
            toast.error("An error occurred");
        }
    };

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
                        No attachments have been added to this course
                    </p>
                )} 
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
