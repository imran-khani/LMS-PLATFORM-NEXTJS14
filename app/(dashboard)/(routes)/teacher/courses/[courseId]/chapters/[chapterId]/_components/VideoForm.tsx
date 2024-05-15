"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import axios from "axios";
import * as z from "zod";

import { Chapter, MuxData } from "@prisma/client";
import MuxPlayer from '@mux/mux-player-react'

import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/fileUpload";

import { Pencil, PlusCircle, VideoIcon } from "lucide-react";

const formSchema = z.object({
    videoUrl: z.string().min(1)
});

interface VideoFormProps {
    initialData: Chapter & {
        muxData: MuxData | null
    }
    courseId: string;
    chapterId: string
}

export const VideoForm = ({ initialData, courseId, chapterId }: VideoFormProps) => {

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
            // make a request to the server to update the chapter video
            await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`, data);

            // toggle the editing state
            toggleEditing();
            toast.success("chapter video updated");
            // refresh the page
            router.refresh();
        } catch {
            toast.error("An error occurred");
        }
    };

    return (
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Chapter Video
                <Button onClick={toggleEditing} variant={"ghost"}>
                    {isEditing && <>Cancel</>}

                    {!isEditing && !initialData?.videoUrl && (
                        <>
                            <PlusCircle className="h-4 w-4 mr-2" />
                            Add a video
                        </>
                    )}

                    {!isEditing && initialData?.videoUrl && (
                        <>
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit video
                        </>
                    )}
                </Button>
            </div>
            {!isEditing &&
                (!initialData?.videoUrl ? (
                    <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
                        <VideoIcon className="h-10 w-10 text-slate-500" />
                    </div>
                ) : (
                    <div className="relative aspect-video mt-2">
                        <MuxPlayer
                        playbackId={initialData.muxData?.playbackId || ""}
                        />
                    </div>
                ))}
            {isEditing && (
                <>
                    <FileUpload
                        endpoint="chapterVideo"
                        onChange={(url) => {
                            if (url) {
                                onSubmit({ videoUrl: url });
                            }
                        }}
                    />
                    <div className="text-xs text-muted-foreground mt-4">
                        Upload this chapter's video
                    </div>
                    {
                        initialData.videoUrl && !isEditing && (
                            <div className="text-xs text-muted-foreground mt-2">
                                Videos can take a few minutes to process. Refresh the page to see the updated video.
                            </div>
                        )
                    }
                </>
            )}
        </div>
    );
};



                        
                        
