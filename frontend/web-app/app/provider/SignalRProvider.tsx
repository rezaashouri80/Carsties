'use client'
import { useAuctionStore } from '@/hooks/useActionStore'
import { useBidStore } from '@/hooks/useBidStore'
import { AucrtionFinished, Auction, Bid } from '@/types'
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr'
import { User } from 'next-auth'
import { useParams } from 'next/navigation'
import React, { ReactNode, useCallback, useEffect, useRef } from 'react'
import toast from 'react-hot-toast'
import AuctionCreatedToast from '../components/AuctionCreatedToast'
import { getDetailsViewData } from '../actions/AuctionActions'
import AuctionFinishedToast from '../components/AuctionFinishedToast'


type Props = {
    children: ReactNode,
    user: User | null
}

export default function SignalRProvider({ children , user}: Props) {

    const connection = useRef<HubConnection | null>(null)
    const setCurrentPrice = useAuctionStore(state => state.setCurrentPrice)
    const addBid = useBidStore(state => state.addBid)
    const params = useParams<{ id: string }>();

    const handleBidPlace = useCallback((bid: Bid) => {

        if (bid.bidStatus.includes("Accepted")) {
            setCurrentPrice(bid.auctionId, bid.amount);
        }

        if (params.id === bid.auctionId) {
            addBid(bid)
        }
    }, [setCurrentPrice, addBid, params.id])

    const handleAuctionFinished = useCallback((auctionFinished:AucrtionFinished)=>{
        const auction = getDetailsViewData(auctionFinished.auctionId);

        return toast.promise(auction,{
            loading:"Loading",
            success: (auction)=> <AuctionFinishedToast auction={auction} auctionFinish={auctionFinished}/>,
            error: (err)=> 'Suction Finish Error'
        },{
            success:{duration:10000,icon:null}
        })
    },[])

    const handleAuctionCreated = useCallback((auction:Auction)=>{
 
           return toast(<AuctionCreatedToast auction={auction} />,{
            duration:10000
           })
        
    },[])

    useEffect(() => {

        if (!connection.current) {
            connection.current = new HubConnectionBuilder()
                .withUrl("http://localhost:6001/notifications")
                .withAutomaticReconnect()
                .build();

            connection.current.start()
                .then(() => {
                    console.log("Connect to SignalR hub")
                })
                .catch((error) => {
                    console.log(error);
                })
        }

        connection.current.on("BidPlaced", handleBidPlace)
        connection.current.on("AuctionCreated", handleAuctionCreated)
        connection.current.on("AuctionFinished", handleAuctionFinished)

        return ()=>{
            connection.current?.off("BidPlaced", handleBidPlace);
            connection.current?.off("AuctionCreated", handleAuctionCreated);
            connection.current?.off("AuctionFinished", handleAuctionFinished);
        }
    }, [setCurrentPrice,handleBidPlace,handleAuctionCreated,handleAuctionFinished])


    return (
        children
    )
}
