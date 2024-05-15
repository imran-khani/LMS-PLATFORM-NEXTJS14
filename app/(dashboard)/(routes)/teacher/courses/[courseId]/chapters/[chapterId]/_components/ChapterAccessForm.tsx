"use client";

import * as z from "zod";
import axios from "axios";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import Editor from "@/components/editor";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";

import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Chapter } from "@prisma/client";
import Preview from "@/components/preview";
import { Checkbox } from "@/components/ui/checkbox";

const formSchema = z.object({
    isFree: z.boolean().default(false),
});

interface ChapterAccessFormProps {
    initialData: Chapter
    courseId: string;
    chapterId: string;
}

export const ChapterAccessForm = ({ initialData, courseId, chapterId }: ChapterAccessFormProps) => {

    const [isEditing, setIsEditing] = useState(false);
    const router = useRouter()
    // toggle editing state
    const toggleEditing = () => {
        setIsEditing((prev) => !prev);
    };

    // form hook with zod resolver
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            isFree: !!initialData.isFree,
        }
    });

    // destructure form state to check if the form is submitting and valid
    const { isSubmitting, isValid } = form.formState;

    // this is the function that will be called when the form is submitted
    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        try {
            // make a request to the server to update the course isFree status
            await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`, data);
            toggleEditing();
            toast.success("Chapter Free status updated.");
            router.refresh();
        } catch {
            toast.error("An error occurred");
        }
    };

    return (
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Chapter Access
                <Button onClick={toggleEditing} variant={"ghost"}>
                    {isEditing ? (
                        <>Cancel</>
                    ) : (
                        <>
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit access
                        </>
                    )}
                </Button>
            </div>
            {!isEditing && <p className={cn(
                'text-sm mt-2',
                !initialData.description && 'text-slate-500 italic')}>
                {
                    initialData.isFree ? 'This chapter is free for all users' : 'This chapter is not free for all users'
                }
            </p>}
            {isEditing && (
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4 mt-4"
                    >
                        <FormField
                            control={form.control}
                            name="isFree"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                        <FormDescription>
                                            Check this box if you want to make this chapter free for all users
                                        </FormDescription>
                                    </div>
                                </FormItem>
                            )}
                        />
                        <div className="flex items-center gap-x-2">
                            <Button
                                type="submit"
                                disabled={!isValid || isSubmitting}
                            >
                                Save
                            </Button>
                        </div>
                    </form>
                </Form>
            )}
        </div>
    );
};