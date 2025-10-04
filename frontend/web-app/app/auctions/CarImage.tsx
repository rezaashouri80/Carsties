'use client';

import React, { useState } from 'react'
import Image from "next/image";


type Props ={
    imageUrl:string
}

export default function CarImage({imageUrl}:Props) {

    const [loading,setLoading]=useState(true);

  return (
            <Image 
              src={imageUrl}
              alt='car'
              fill
              className={`
                 object-cover duration-700 ease-in-out
                 ${loading ? 'opacity-0 scale-110' : 'opacity-100 scale-100'}
                `}
              unoptimized
              priority
              sizes='(max-width: 768px) 100vm, (max-width: 1200px) 50vw, 25vm'
              onLoad={()=> setLoading(false)}
              />  
            )
}
