"use client";

import * as z from "zod";
import axios from "axios";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";

import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Chapter, Course } from "@prisma/client";
import { Input } from "@/components/ui/input";
import ChaptersList from "./ChaptersList";

const formSchema = z.object({
    title: z.string().min(1)
});

interface DescriptionFormProps {
    initialData: Course & { chapters: Chapter[] };
    courseId: string;
}

export const ChaptersForm = ({ initialData, courseId }: DescriptionFormProps) => {

    const [isCreating, setIsCreating] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);

    const router = useRouter()

    // toggle editing state
    const toggleCreating = () => {
        setIsCreating((current) => !current);
    };

    // form hook with zod resolver
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: ''
        }
    });

    // destructure form state to check if the form is submitting and valid
    const { isSubmitting, isValid } = form.formState;

    // will be called when the form is submitted
    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        try {
            // make a request to the server to update the course Chapters
            await axios.post(`/api/courses/${courseId}/chapters`, data);
            toggleCreating();
            toast.success("Course Chapters updated");
            router.refresh();
        } catch {
            toast.error("An error occurred");
        }
    };

    //  will be called when the chapters are reordered
    const onReorder = async (updatedData: { id: string; position: number }[]) => {
        try {
            setIsUpdating(true)
            // put is api request to update the chapters order in the database
            await axios.put(`/api/courses/${courseId}/chapters/reorder`, {
                list: updatedData
            })

            toast.success("Chapters reordered")
            router.refresh()
        } catch {
            toast.error("An error occurred");
        }
        finally {
            setIsUpdating(false)
        }
    }

    return (
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Course Chapters
                <Button onClick={toggleCreating} variant={"ghost"}>
                    {isCreating ? (
                        <>Cancel</>
                    ) : (
                        <>
                            <PlusCircle className="h-4 w-4 mr-2" />
                            Add Chapter
                        </>
                    )}
                </Button>
            </div>

            {isCreating && (
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4 mt-4"
                    >
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            disabled={isSubmitting}
                                            placeholder="Course description"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button
                            type="submit"
                            disabled={!isValid || isSubmitting}
                        >
                            Create
                        </Button>
                    </form>
                </Form>
            )}
            {!isCreating && (
                <div
                    className={cn(
                        'text-sm mt-2',
                        !initialData.chapters.length && 'text-slate-500'
                    )}
                >
                    {!initialData.chapters.length && 'No chapters added yet'}

                    <ChaptersList
                        onEdit={() => { }}
                        onReorder={onReorder}
                        items={initialData.chapters || []}
                    />
                </div>
            )}
            {
                !isCreating && (
                    <p className="text-xs text-muted-foreground mt-4">
                        Drag and drop to reorder
                    </p>
                )
            }
        </div>
    );
};
