"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import toast from "react-hot-toast";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Attachment, Course } from "@prisma/client";

import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/fileUpload";

import { ImageIcon, Pencil, PlusCircle } from "lucide-react";

const formSchema = z.object({
    imageUrl: z.string().min(1, "image is required"),
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
            {!isEditing &&
                (!initialData?.imageUrl ? (
                    <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
                        <ImageIcon className="h-10 w-10 text-slate-500" />
                    </div>
                ) : (
                    <div className="relative aspect-video mt-2">
                        <Image
                            alt="uploaded image"
                            fill
                            className="object-cover rounded-md"
                            src={initialData.imageUrl}
                        />
                    </div>
                ))}
            {isEditing && (
                <>
                    <FileUpload
                        endpoint="courseImage"
                        onChange={(url) => {
                            if (url) {
                                onSubmit({ imageUrl: url });
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
