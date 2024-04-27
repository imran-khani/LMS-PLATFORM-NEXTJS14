"use client";

import * as z from "zod";
import axios from "axios";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Course } from "@prisma/client";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";

import { Button } from "@/components/ui/button";
import { ImageIcon, Pencil, PlusCircle } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import { FileUpload } from "@/components/fileUpload";

const formSchema = z.object({
    imageUrl: z.string().min(1, "image is required"),
});

interface imageFormProps {
    initialData: Course;
    courseId: string;
}

export const ImageForm = ({ initialData, courseId }: imageFormProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const router = useRouter();
    // toggle editing state
    const toggleEditing = () => {
        setIsEditing((prev) => !prev);
    };

    // form hook with zod resolver
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            imageUrl: initialData?.imageUrl || undefined,
        },
    });

    // destructure form state to check if the form is submitting and valid
    const { isSubmitting, isValid } = form.formState;

    // this is the function that will be called when the form is submitted
    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        try {
            // make a request to the server to update the course image
            await axios.patch(`/api/courses/${courseId}`, data);
            toggleEditing();
            toast.success("Course image updated");
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
                <FileUpload
                    endpoint="courseImage"
                    onChange={(url) => {
                        if (url) {
                            onSubmit({ imageUrl: url });
                        }
                    }}
                />
            )}
        </div>
    );
};
