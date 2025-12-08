'use client'
import { error } from 'console';
import { Button, HelperText, Spinner, TextInput } from 'flowbite-react';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect } from 'react'
import { FieldValue, FieldValues, useForm } from 'react-hook-form'
import Input from '../components/Input';
import DateInput from '../components/DateInput';
import { createAuction, updateAuction } from '../actions/AuctionActions';
import toast from 'react-hot-toast';
import { Auction } from '@/types';

type Props = {
    auction:Auction
}


export default function AuctionForm({auction}:Props) {

    const router = useRouter();
    const pathname= usePathname()

    const {register,handleSubmit,setFocus,control,reset,
        formState: {isSubmitting, isValid , isDirty , errors}} = useForm({
        mode:'onTouched'
        }
        );

    useEffect(()=>{

        if(auction){
            const {make,model,color,mileage,year}=auction;
            reset({make,model,color,mileage,year});
        }
        setFocus("make");
    },[setFocus,auction,reset])

    async function onSubmit(data:FieldValues){
        try {
            
            let res;
            let id='';
            
            if(pathname === '/auctions/create'){
                res = await createAuction(data);
                id=res.id;
            }
            else{
                
                res = await updateAuction(data,auction.id);
                id=auction.id;
            }


            if(res.error){
                throw res.error;
            }
            router.push('/auctions/details/'+id)
            
        } catch (error :any) {
            toast.error(error.status + ' ' + error.message)
        }
    }


  return (
    <form className='flex flex-col mt-3' onSubmit={handleSubmit(onSubmit)} >
        <Input name='make' label='Make' control={control} rules={{required:"Make is required"}} />
        <Input name='model' label='Model' control={control} rules={{required:"Model is required"}} />
        <Input name='color' label='Color' control={control} rules={{required:"Color is required"}} />

        <div className='grid grid-cols-2 gap-3'>
            <Input name='year' label='Year' type='number' control={control} 
                rules={{required:"Year is required"}} />
            
            <Input name='mileage' label='Mileage' control={control} 
                rules={{required:"Mileage is required"}} />
        </div>
        {pathname === '/auctions/create' &&
        <>
        <Input name='imageUrl' label='Image Url' control={control} rules={{required:"ImageUrl is required"}} />

        <div className='grid grid-cols-2 gap-3'>
            <Input name='reservePrice' label='ReservePrice' type='number' control={control} 
                rules={{required:"Year is required"}} />
            
            <DateInput 
            name='auctionEnd' 
            label='Auction End' 
            showTimeSelect
            dateFormat="dd MMMM h:mm a"
            control={control} 
            rules={{required:"Auction End is required"}} />
        </div>
</>
}
        <div className='flex justify-between'>
            <Button outline color='dark' onClick={()=>router.push('/')}>
                Cancel
            </Button>
            <Button
            outline
            color='green'
            type='submit'
            disabled={!isDirty || !isValid}>
                {isSubmitting && <Spinner size='sm' />}
                Submit
            </Button>
        </div>
    </form>
  )
}
