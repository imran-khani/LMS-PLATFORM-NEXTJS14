'use client'


import { cn } from '@/lib/utils';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React from 'react'
import { IconType } from 'react-icons';

import qs from 'query-string';

interface CategoryItemProps {
    label: string;
    icon?: IconType;
    value?: string;
}


const CategoryItem = ({
    label,
    icon: Icon,
    value
}: CategoryItemProps) => {
    const router = useRouter()
    const pathname = usePathname()
    const searhchParams = useSearchParams()

    const currentCategoryId = searhchParams.get('categoryId')
    const currentTitle = searhchParams.get('title')
    const isSelected = currentCategoryId === value;


    const setQuery = () => {
        const url = qs.stringifyUrl({
            url: pathname,
            query: {
                title: currentTitle,
                categoryId: isSelected ? null : value
            }
        }, { skipNull: true, skipEmptyString: true });

        router.push(url)
    }

    return (
        <button
            className={
                cn(
                    'flex items-center gap-x-1 px-3 border text-sm py-2 rounded-full transition border-slate-200 hover:border-sky-700'
                    ,
                    isSelected ? 'border-sky-700' : ''
                )
            }
            type='button'
            onClick={setQuery}
        >
            {Icon && <Icon size={20} />}
            <div className='truncate'>{label}</div>
        </button>
    )
}

export default CategoryItem
