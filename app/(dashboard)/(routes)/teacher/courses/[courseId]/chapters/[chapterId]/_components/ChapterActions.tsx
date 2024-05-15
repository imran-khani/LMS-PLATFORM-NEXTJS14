'use client'

import ConfirmModal from "@/components/modals/confirm-modal";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { TrashIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";



interface ChapterActionsProps {
    disabled: boolean,
    courseId: string;
    chapterId: string;
    isPublished: boolean | null;
}

const ChapterActions = ({
    chapterId,
    courseId,
    disabled,
    isPublished
}: ChapterActionsProps) => {

    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter()

    const onDelete = async () => {
        try {
            setIsLoading(true)
            axios.delete(`/api/courses/${courseId}/chapters/${chapterId}`)
            toast.success('Chapter deleted')
            router.refresh();
            router.push(`/teacher/courses/${courseId}`)
        } catch {
            toast.error('Error deleting this chapter!')
        }
        finally {
            setIsLoading(false)
        }
    }
    return (
        <div
            className="flex items-center gap-x-2"
        >
            <Button
                onClick={onDelete}
                disabled={disabled || isLoading}
                variant={"outline"}
                size={'sm'}
            >
                {isPublished ? 'Unpublish' : 'Publish'}
            </Button>
            <ConfirmModal
                onConfirm={() => { }}
            >

                <Button
                    size={'sm'}
                    disabled={isLoading}
                >
                    <TrashIcon className="h-4 w-4" />
                </Button>
            </ConfirmModal>
        </div>
    )
}

export default ChapterActions