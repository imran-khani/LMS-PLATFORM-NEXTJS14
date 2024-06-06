"use client";

import { Button } from "@/components/ui/button";
import useConfetti from "@/hooks/use-confetti-store";
import axios from "axios";
import { CheckCircle, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

interface IParams {
    courseId: string;
    chapterId: string;
    nextChapterId?: string;
    isCompleted?: boolean;
}

const CourseProgressButton = ({
    courseId,
    chapterId,
    nextChapterId,
    isCompleted,
}: IParams) => {
    const [isLoading, setIsLoading] = useState(false);
    const confetti = useConfetti();
    const router = useRouter();

    const onClick = async () => {
        try {
            setIsLoading(true);
            await axios.put(
                `/api/courses/${courseId}/chapters/${chapterId}/progress`,
                {
                    isCompleted: !isCompleted,
                }
            );
            if (!isCompleted && nextChapterId) {
                confetti.onOpen();
            }

            if (!isCompleted && nextChapterId) {
                router.push(`/courses/${courseId}/chapters/${nextChapterId}`);
            }

            toast.success("Progress updated");
            router.refresh();
        } catch (error) {
            console.log("error while marking as completed", error);
            toast.error("Error while marking as completed");
        } finally {
            setIsLoading(false);
        }
    };

    const Icon = isCompleted ? XCircle : CheckCircle;

    return (
        <Button
            onClick={onClick}
            disabled={isLoading}
            type="button"
            variant={isCompleted ? "outline" : "success"}
            className="w-full md:w-auto"
        >
            {isCompleted ? "Not completed" : "Mark as Completed"}
            <Icon size={20} />
        </Button>
    );
};

export default CourseProgressButton;
