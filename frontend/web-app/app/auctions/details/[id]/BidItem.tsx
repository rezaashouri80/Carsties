import { numberWithCommas } from '@/lib/numWithCommas';
import { Bid } from '@/types';
import React from 'react'

type Props = {
    bid:Bid
}

export default function BidItem({bid}:Props) {
    function getBidInfo(){
        let bgColor = '';
        let text = '';
        const date = new Intl.DateTimeFormat("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        second:"2-digit"
                        }).format(new Date(bid.bidTime));

        switch(bid.bidStatus){
            case 'Accepted':
                bgColor = 'bg-green-200';
                text = 'Bid accepted';
                break;

            case 'AcceptedBelowReserveOrice':
                bgColor = 'bg-amber-200';
                text = 'Reserve not met';
                break;

            case 'TooLow':
                bgColor = 'bg-red-200';
                text = 'Bid was too low';
                break;      
            
            default:
                bgColor = 'bg-red-200';
                text = 'Bid placed after auction finished';
                break;     
        }

        return {bgColor,text,date};
    }
  return (
        <div className={`border-gray-300 border-2 py-2 px-2 
        rounded-lg flex justify-between items-center mb-2 ${getBidInfo().bgColor}`}>
            <div className='flex flex-col'>
                <span>Bidder: {bid.bidder}</span>
                <span className='text-gray-700 text-sm'>Time: {getBidInfo().date}</span>
            </div>
            <div className='flex flex-col text-right'>
                <div className='text-xl font-semibold'>$ {numberWithCommas(bid.amount)}</div>
                <div className='flex flex-row items-center'>
                    <span>{getBidInfo().text}</span>
                </div>
            </div>
        </div>
  )
}
