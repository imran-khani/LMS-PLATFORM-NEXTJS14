'use client'

import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import {useForm} from 'react-hook-form'
import { useRouter } from 'next/navigation'

import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormLabel,
    FormMessage
} from '@/components/ui/form'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'


const formSchema = z.object({
    title:z.string().min(1,{
        message:'Title is required'
    })
})


const CreateCourse = () => {

    const form = useForm<z.infer<typeof formSchema>>({
        resolver:zodResolver(formSchema)
    })
  return (
    <div>CreateCourse</div>
  )
}

export default CreateCourse