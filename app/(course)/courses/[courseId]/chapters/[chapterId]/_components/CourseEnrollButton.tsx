"use client";

import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/priceFormat";
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";

const CourseEnrollButton = ({
    courseId,
    price,
}: {
    courseId: string;
    price: number;
}) => {
    const [isLoading, setIsLoading] = useState(false);

    const onClick = async () => {
        try {
            setIsLoading(true);

            const response = await axios.post(
                `/api/courses/${courseId}/checkout`
            );
            window.location.assign(response.data.url);
        } catch (error) {
            toast.error("Failed to enroll in course");
        } finally {
            setIsLoading(false);
        }
    };
    return (
        <Button 
        onClick={onClick}
        disabled={isLoading}
        size={"sm"} className="w-full md:w-auto">
            Enroll for {formatPrice(price)}
        </Button>
    );
};

export default CourseEnrollButton;
