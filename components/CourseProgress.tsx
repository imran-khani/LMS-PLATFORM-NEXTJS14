import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

const colorByVariant = {
    default: "text-sky-700",
    success: "text-emerald-700",
};

const sizeByVariant = {
    default: "text-sm",
    sm: "text-xs",
};

const CourseProgress = ({
    variant = "default",
    value,
    size,
}: {
    size?: "default" | "sm" | null | undefined;
    variant?: "default" | "success" | null | undefined;
    value: number;
}) => {
    return (
        <div>
            <Progress variant={variant} className="h-2" value={value} />
            <p
                className={cn(
                    "font-medium mt-2 text-sky-700",
                    colorByVariant[variant || "default"],
                    sizeByVariant[size || "default"]
                )}
            >
                {Math.round(value)}% complete
            </p>
        </div>
    );
};

export default CourseProgress;
