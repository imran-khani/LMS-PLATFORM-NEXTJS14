'use client'


import { Search } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Input } from './ui/input'
import UseDebounce from '@/hooks/use-debounce'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import qs from 'query-string'

const SearchInput = () => {
    const [value, setValue] = useState('');
    const debouncedValue = UseDebounce(value);

    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const currentCategoryId = searchParams.get('categoryId');

    useEffect(() => {
        const url = qs.stringifyUrl({
            url: pathname,
            query: {
                CategoryId: currentCategoryId,
                title: debouncedValue
            }
        }, {
            skipEmptyString: true,
            skipNull: true
        })
        router.push(url)
    }, [debouncedValue, currentCategoryId, router, pathname])
    return (
        <div
            className='relative'
        >
            <Search
                className='absolute top-3 left-3 text-slate-600 h-4 w-4'
            />
            <Input
                value={value}
                onChange={(e) => {
                    setValue(e.target.value)
                }}
                className='pl-9 w-full md:w-[300px] rounded-full bg-slate-100 focus-visible:ring-slate-200'
                pattern='Search for courses'
            />


        </div>
    )
}

export default SearchInput