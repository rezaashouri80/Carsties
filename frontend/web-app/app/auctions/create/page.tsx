import Heading from '@/app/components/Heading'
import React from 'react'
import AuctionForm from '../AuctionForm'

export default function Create() {
  return (
    <div className='mx-auto rounded-lg max-w-[75%] shadow-lg bg-white p-10'>
      <Heading title='Sell your Car' subtitle='Please Enter the details of your car' />
      <AuctionForm />
    </div>
  )
}
