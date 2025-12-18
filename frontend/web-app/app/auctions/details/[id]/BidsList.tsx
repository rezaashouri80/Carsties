'use client'
import { getAuctionBids } from '@/app/actions/AuctionActions'
import Heading from '@/app/components/Heading'
import { useBidStore } from '@/hooks/useBidStore'
import { Auction, Bid } from '@/types'
import { error } from 'console'
import { User } from 'next-auth'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import BidItem from './BidItem'
import { numberWithCommas } from '@/lib/numWithCommas'
import EmptyFilter from '@/app/components/EmptyFilters'
import BidForm from './BidForm'
import { stat } from 'fs'

type Props = {
    user: User | null,
    auction: Auction
}

export default function BidsList({ user, auction }: Props) {

    const [loading, setLoading] = useState(true);
    const bids = useBidStore(state => state.bids);
    const setBids = useBidStore(state => state.setBids);

    const open = useBidStore(state=>state.open)
    const setOpen = useBidStore(state=>state.setOpen)

    const openForBids = new Date(auction.auctionEnd) > new Date();

    const highBid = bids.reduce((prev, current) =>
        prev > current.amount ? prev : current.bidStatus.includes("Accepted") ? current.amount : prev
        , 0)

    useEffect(() => {
        getAuctionBids(auction.id).then((res: any) => {
            if (res.error)
                throw res.error;
            setBids(res as Bid[]);
        }).catch((error) => {
            toast.error(error.message)
        }).finally(() => {
            setLoading(false);
        })
    }, [auction.id, setBids])

    useEffect(()=>{
        setOpen(openForBids)
    },[openForBids,setOpen])


    if (loading) {
        return <span>Loading Bids</span>
    }

    return (
        <div className='rounded-lg shadow-md'>
            <div className='py-2 px-4 bg-white'>
                <div className='sticky top-0 bg-white p-2'>
                    <Heading title={`Currentt high bid is $ ${numberWithCommas(highBid)}`} />
                </div>
            </div>

            <div className='overflow-auto h-[380px] flex flex-col-reverse px-2'>
                {bids.length === 0 ?
                    (
                        <EmptyFilter
                            title='No bids for this item'
                            subtitle='Please feel free to make a bid' />
                    ) : (
                        <>
                            {
                                bids.map((b) => (
                                    <BidItem bid={b} key={b.id} />
                                ))}
                        </>
                    )}
            </div>

            <div className='px-2 pb-2 text-gray-500'>

                {
                !open ?   (
                     <div className='flex items-center justify-center p-2 text-lg font-semibold'>
                        This auction has finished
                    </div>  
                ) : 
                
                !user ? (
                    <div className='flex items-center justify-center p-2 text-lg font-semibold'>
                        Please login to make a bid
                    </div>    
                ) :
                    user && user.username === auction.seller ? (
                    <div className='flex items-center justify-center p-2 text-lg font-semibold'>
                        You cannot bid on your auction
                    </div>      
                    ) : (
                    <BidForm auctionId={auction.id} highBid={highBid} />
                    )
                }
            </div>

        </div>
    )
}
