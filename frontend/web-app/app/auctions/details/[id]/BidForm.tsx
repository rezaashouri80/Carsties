import { placeBidForAuction } from '@/app/actions/AuctionActions';
import { useBidStore } from '@/hooks/useBidStore';
import { numberWithCommas } from '@/lib/numWithCommas';
import { Bid } from '@/types';
import React from 'react'
import { FieldValue, FieldValues, useForm } from 'react-hook-form'
import toast from 'react-hot-toast';

type Props = {
    auctionId:string
    highBid:number
}


export default function BidForm({auctionId,highBid}:Props) {
    const {register,reset,handleSubmit,} = useForm();
    const addBid = useBidStore(state=>state.addBid)

    function onSubmit(data:FieldValues){

        if(data.amount <= highBid)
        {
            toast.error("Bid must be at least $" + numberWithCommas(highBid + 1));
            reset();
            return;
        }
        
        placeBidForAuction(auctionId,+data.amount)
        .then((res)=>{
            
            if(res.error)
                throw res.error;

            addBid(res as Bid);
            reset();
        })
        .catch(error=>{
            toast.error(error.message);
        })

    }
  return (
    <form onSubmit={handleSubmit(onSubmit)} className='flex items-center border-2 rounded-lg py-2' >
        <input 
        type='number'
        {...register("amount")}
        className="input-custom"
        placeholder={`Enter your bid ( minimum bid is $ ${numberWithCommas(highBid+1)})`}
        />
    </form>
  )
}
