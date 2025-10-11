'use client'
import { useParamsStore } from '@/hooks/useParamsStore'
import { usePathname } from 'next/navigation'
import { useRouter } from 'next/navigation'
import React from 'react'
import { AiOutlineCar } from 'react-icons/ai'

export default function Logo() {
    const router = useRouter();
    const pathname = usePathname();

    const reset = useParamsStore(state=>state.reset)

    function hanleReset(){
      if(pathname!=='/')
        router.push('/')
      reset()
    }
  return (
            <div onClick={hanleReset} className='flex items-center cursor-pointer gap-2 text-3xl font-semibold text-red-500'>
            <AiOutlineCar size={34} />
            Carsties Auctions
            </div>
              )
}
