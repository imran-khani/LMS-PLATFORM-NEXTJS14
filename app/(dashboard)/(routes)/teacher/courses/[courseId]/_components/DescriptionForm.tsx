"use client";

import * as z from "zod";
import axios from "axios";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

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
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
    description: z.string().min(1, "description is required"),
});

interface DescriptionFormProps {
    initialData: {
        description: string;
    };
    courseId: string;
}

export const DescriptionForm = ({ initialData, courseId }: DescriptionFormProps) => {

    const [isEditing, setIsEditing] = useState(false);
    const router = useRouter()
    // toggle editing state
    const toggleEditing = () => {
        setIsEditing((prev) => !prev);
    };

    // form hook with zod resolver
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData,
    });

    // destructure form state to check if the form is submitting and valid
    const { isSubmitting, isValid } = form.formState;

    // this is the function that will be called when the form is submitted
    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        try {
            // make a request to the server to update the course description
            await axios.patch(`/api/courses/${courseId}`, data);
            toggleEditing();
            toast.success("Course description updated");
            router.refresh();
        } catch {
            toast.error("An error occurred");
        }
    };

    return (
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Course description
                <Button onClick={toggleEditing} variant={"ghost"}>
                    {isEditing ? (
                        <>Cancel</>
                    ) : (
                        <>
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit description
                        </>
                    )}
                </Button>
            </div>
            {!isEditing && <p className={cn(
                'text-sm mt-2',
                !initialData.description && 'text-slate-500 italic'

            )}>{initialData.description || 'No Description'}</p>}
            {isEditing && (
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4 mt-4"
                    >
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Textarea
                                            disabled={isSubmitting}
                                            placeholder="Course description"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
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
