import { numberWithCommas } from '@/lib/numWithCommas'
import { AucrtionFinished, Auction } from '@/types'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { finished } from 'stream'

type Props = {
    auction: Auction,
    auctionFinish: AucrtionFinished
}

export default function AuctionFinishedToast({auction,auctionFinish}:Props) {

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
                <div className='flex flex-col'>
                    <span>
                         Auction for {auction.make} {auction.model} has finished.
                         {
                            auctionFinish.itemSold && auctionFinish.amount ?
                            (
                                <p>
                                    Congrats to {auctionFinish.winner} to won this auction
                                    for ${numberWithCommas(auctionFinish.amount)}
                                </p>
                            ) : (
                                <p>
                                    This item did not sell
                                </p>
                            )
                         }
                    </span>
                </div>

            </div>
    </Link>
  )
}
