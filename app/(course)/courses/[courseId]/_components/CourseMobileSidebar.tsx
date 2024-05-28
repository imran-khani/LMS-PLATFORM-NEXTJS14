
import { CourseNavbarProps } from './CourseNavbar'

import { Menu } from 'lucide-react'

import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetTrigger,
  } from "@/components/ui/sheet"
  
 import CourseSidebar from './CourseSidebar'

const CourseMobileSidebar = ({
    course,
    progressCount
}:CourseNavbarProps) => {
  return (
    <Sheet>
    <SheetTrigger className='md:hidden pr-4 hover:opacity-75 transition'>
        <Menu />
    </SheetTrigger>
    <SheetContent className='p-0 bg-white w-72' side={'left'}>
     <CourseSidebar 
    //  @ts-ignore
     course={course}
        progressCount={progressCount}
     />
    </SheetContent>
  </Sheet>
  
  )
}

export default CourseMobileSidebar