'use client'

import { Chapter } from "@prisma/client";

interface ChaptersListProps {
    items: Chapter[];
    onEdit: (id:string) => void;
    onReorder: (updatedData:{id:string;position:number}[]) => void;
    }
const ChaptersList = ({
    items,
    onEdit,
    onReorder
}:ChaptersListProps) => {
  return (
    <div>ChaptersList</div>
  )
}

export default ChaptersList

https://youtu.be/Big_aFLmekI?t=16240