

import { CourseWithProgressWithCategory } from '@/types/types'
import React from 'react'
import CourseCard from './CourseCard'

interface CoursesListProps {
    items: CourseWithProgressWithCategory[]
}

const CoursesList = ({
    items
}: CoursesListProps) => {
    return (
        <div>
            <div className='grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4'>
                {items.map((course) => (
                    <CourseCard
                        key={course.id}
                        id={course.id}
                        title={course.title!}
                        imageUrl={course.imageUrl!}
                        chaptersLength={course.chapters.length}
                        price={course.price!}
                        progress={course.progress}
                        category={course?.category?.name!}
                    />
                ))}
            </div>
            {items.length === 0 && (
                <div>
                    No courses found
                </div>
            )}
        </div>
    )
}

export default CoursesList