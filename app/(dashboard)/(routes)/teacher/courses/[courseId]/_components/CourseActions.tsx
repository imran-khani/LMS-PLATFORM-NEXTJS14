'use client'

import ConfirmModal from "@/components/modals/confirm-modal";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { TrashIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";



interface CourseActionsProps {
    disabled: boolean,
    courseId: string;
    isPublished: boolean | null;
}

const CourseActions = ({

    courseId,
    disabled,
    isPublished
}: CourseActionsProps) => {

    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter()

    const onDelete = async () => {
        try {
            setIsLoading(true)
            axios.delete(`/api/courses/${courseId}`)
            toast.success('Course deleted')
            router.push('/teacher/courses')
        } catch {
            toast.error('Error deleting this Course!')
        }
        finally {
            setIsLoading(false)
        }
    }


    const onClick = async () => {
        try {
            setIsLoading(true)
            if (isPublished) {
                axios.patch(`/api/courses/${courseId}/unpublish`)
                toast.success('Course unpublished')
            }
            else {
                axios.patch(`/api/courses/${courseId}/publish`)
                toast.success('Course published')
            }
            router.refresh()
        } catch {
            toast.error('Something went wrong')
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
                onClick={onClick}
                disabled={disabled || isLoading}
                variant={"outline"}
                size={'sm'}
            >
                {isPublished ? 'Unpublish' : 'Publish'}
            </Button>
            <ConfirmModal
                onConfirm={onDelete}
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

export default CourseActions