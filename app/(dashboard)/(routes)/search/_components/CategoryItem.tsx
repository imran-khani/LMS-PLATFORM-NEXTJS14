'use client'


import React from 'react'
import { IconType } from 'react-icons';

interface CategoryItemProps {
    label: string;
    icon?: IconType;
    value?: string;
}


const CategoryItem = ({
    label,
    icon,
    value
}: CategoryItemProps) => {

    return (
        <div>CategoryItem</div>
    )
}

export default CategoryItem