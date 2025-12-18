import {  getDetailsViewData } from '@/app/actions/AuctionActions'
import Heading from '@/app/components/Heading';
import React from 'react'
import CountdownTimer from '../../CountdownTimer';
import CarImage from '../../CarImage';
import DetailedSpecs from './DetailedSpecs';
import { getCurrentUser } from '@/app/actions/AuthAction';
import EditButton from './EditButton';
import DeleteButton from './DeleteButton';
import { Bid } from '@/types';
import BidItem from './BidItem';
import BidsList from './BidsList';

export default async function Details({params}:{params:Promise<{id:string}>}) {
  const {id} = await params
  const data = await getDetailsViewData(id);
  const user = await getCurrentUser();

  return (
    <>
    <div className='flex justify-between'>
      <div className='flex items-center gap-3'>
      
      <Heading title={`${data.make} ${data.model}`} />
      {user?.username === data.seller && (
        <>
          <EditButton id={data.id} />
          <DeleteButton id={data.id} />
        </>
      )}
      </div>
      <div className='flex gap-3'>
        <h3 className='text-2xl font-semibold'>
          <CountdownTimer auctionEnd={data.auctionEnd} />
        </h3>
      </div>
    </div>
    
    <div className='grid grid-cols-2 gap-6 mt-6'>
        <div className='relative w-full bg-gray-200 aspect-[4/3] 
        rounded-lg overflow-hidden' style={{height:'500px'}}>
          <CarImage imageUrl={data.imageUrl} />          
        </div>
        <BidsList auction={data} user={user} />
    </div>
    <div className='mt-4 grid grid-cols-1 rounded-lg'>
      <DetailedSpecs auction={data}/>
    </div>
    </>
  )
}
