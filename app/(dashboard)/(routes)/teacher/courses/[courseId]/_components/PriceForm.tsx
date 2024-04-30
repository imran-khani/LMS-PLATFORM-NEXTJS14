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
import { Pencil } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

import {formatPrice} from '@/lib/priceFormat'
const formSchema = z.object({
    price: z.coerce.number(),
});

interface PriceFormProps {
    initialData: {
        price: number | null;
    };
    courseId: string;
}

export const PriceForm = ({ initialData, courseId }: PriceFormProps) => {
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
            price: initialData.price || undefined,
        },
    });

    // destructure form state to check if the form is submitting and valid
    const { isSubmitting, isValid } = form.formState;

    // this is the function that will be called when the form is submitted
    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        try {
            // make a request to the server to update the course price
            await axios.patch(`/api/courses/${courseId}`, data);
            toggleEditing();
            toast.success("Course Price updated");
            router.refresh();
        } catch {
            toast.error("An error occurred");
        }
    };

    return (
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Course price
                <Button onClick={toggleEditing} variant={"ghost"}>
                    {isEditing ? (
                        <>Cancel</>
                    ) : (
                        <>
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit price
                        </>
                    )}
                </Button>
            </div>
            {!isEditing && (
                <p
                    className={cn(
                        "text-sm mt-2",
                        !initialData.price && "text-slate-500 italic"
                    )}
                >
                    {formatPrice(initialData.price ?? 0) || "No Price"}
                </p>
            )}
            {isEditing && (
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4 mt-4"
                    >
                        <FormField
                            control={form.control}
                            name="price"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            step={0.01}
                                            disabled={isSubmitting}
                                            placeholder="Set Course price"
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
