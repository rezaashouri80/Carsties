import { Auction } from '@/types'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

type Props = {
    auction: Auction
}

export default function AuctionCreatedToast({auction}:Props) {

  return (
    <Link href={`/auction/details/${auction.id}`} className='flex flex-col items-center'>
            <div className='flex flex-row gap-2'>
                <Image
                src={auction.imageUrl}
                alt='Image of car'
                height={80}
                width={50}
                className='rounded-lg h-auto w-auto'
                />
                <span>
                    New Auction! {auction.make} {auction.model} has been added.
                </span>
            </div>
    </Link>
  )
}
