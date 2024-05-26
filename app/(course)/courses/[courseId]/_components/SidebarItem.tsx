'use client'
import { cn } from "@/lib/utils";
import { CheckCircle, Lock, PlayCircle } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

interface SidebarItemProps {
    id: string;
    label: string;
    isCompleted: boolean;
    courseId: string;
    isLocked: boolean;
}

const SidebarItem = ({
    id,
    label,
    isCompleted,
    courseId,
    isLocked
}: SidebarItemProps) => {

    const pathname = usePathname(); // Get the current pathname
    const router = useRouter(); // Get the router object
    const Icon = isLocked ? Lock : (isCompleted ? CheckCircle : PlayCircle); // Determine which icon to display based on the isLocked and isCompleted values
    const isActive = pathname.includes(id); // Check if the current pathname includes the id
    const onClick = () => {
        router.push(`/courses/${courseId}/chapters/${id}`)
    }
    return (
        <button
            type="button"
            onClick={onClick}
            className={cn(
                'flex items-center gap-x-2 text-slate-500 text-sm font-[500] pl-6 transition-all hover:text-slate-600 hover:bg-slate-300/20',
                isActive && 'text-slate-700 bg-slate-200/20 hover:text-slate-700',
                isCompleted && 'text-emerald-700 hover:text-emerald-700',
                isCompleted && isActive && 'bg-emerald-200/20',
            )}
        >
            <div className="flex items-center gap-x-2 py-4">
                <Icon 
                size={22}
                className={
                    cn(
                        'text-slate-500',
                        isActive && 'text-slate-700',
                        isCompleted && 'text-emerald-700'
                    )
                }
                />
                {label}
            </div>
            <div
             className={cn(
                'ml-auto opacity-0 border-2 border-slate-700 h-full transition-all',
                isActive && 'opacity-100',
                isCompleted && 'border-emerald-700'
             )}
             
             >

            </div>
        </button>
    )
}

export default SidebarItem;
