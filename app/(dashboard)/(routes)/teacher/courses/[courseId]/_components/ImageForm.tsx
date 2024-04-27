"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import toast from "react-hot-toast";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Course } from "@prisma/client";

import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/fileUpload";

import { ImageIcon, Pencil, PlusCircle } from "lucide-react";

const formSchema = z.object({
    imageUrl: z.string().min(1, "image is required"),
});

interface imageFormProps {
    initialData: Course;
    courseId: string;
}

export const ImageForm = ({ initialData, courseId }: imageFormProps) => {
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
            toast.success("Course image updated");
            // refresh the page
            router.refresh();
        } catch {
            toast.error("An error occurred");
        }
    };

    return (
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Course image
                <Button onClick={toggleEditing} variant={"ghost"}>
                    {isEditing && <>Cancel</>}

                    {!isEditing && !initialData?.imageUrl && (
                        <>
                            <PlusCircle className="h-4 w-4 mr-2" />
                            Add an image
                        </>
                    )}

                    {!isEditing && initialData?.imageUrl && (
                        <>
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit image
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
                        Upload a course image
                    </div>
                </>
            )}
        </div>
    );
};
