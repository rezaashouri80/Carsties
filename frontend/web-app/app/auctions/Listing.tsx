"use client";

import { error } from 'console';
import React, { useEffect, useState } from 'react'
import AuctionCard from './AuctionCard';
import { promises } from 'dns';
import { Pagination } from 'flowbite-react';
import AppPagination from '../components/AppPagination';
import { getData } from '../actions/AuctionActions';
import Filters from './Filters';
import { useParamsStore } from '@/hooks/useParamsStore';
import { useShallow } from 'zustand/shallow';
import queryString from 'query-string';
import EmptyFilter from '../components/EmptyFilters';
import { useAuctionStore } from '@/hooks/useActionStore';
import { stat } from 'fs';



export default function Listing() {

    const [loading,setLoading] = useState(true);

    const params = useParamsStore(useShallow(state=>({
        pageNumber:state.pageNumber,
        pageSize : state.pageSize,
        pageCount : state.pageCount,
        searchTerm: state.searchTerm,
        orderBy : state.orderBy ,
        filterBy : state.filterBy,
        seller : state.seller,
        winner : state.winner
    })));

    const data = useAuctionStore(useShallow(state=>({
        auctions:state.auctions,
        totalCount:state.totalCount,
        pageCount:state.pageCount
    })))

    const setData = useAuctionStore(state => state.setData)

    const setParams = useParamsStore(state=> state.setParams);
    const url = queryString.stringifyUrl({url:'',query:params},{skipEmptyString:true});

    function setpageNumber(number : number){
        setParams({pageNumber:number})
    }

    useEffect(()=>{

        getData(url).then(data=>{
            setData(data);
            setLoading(false);
        })

    },[url,setData])

    if(loading){
       return <h3>Loading ...</h3>
    }

  return (
    <>
    <Filters />
    {
        data?.totalCount === 0 ? (
            <EmptyFilter showReset />
        ) : (
            <>
             <div className='grid grid-cols-4 gap-6'>{
        data && data.auctions.map((auction)=>(
            <AuctionCard key={auction.id} auction={auction} />
        ))
        }
        
    </div>
            
    <div className='flex justify-center mt-4'>
        <AppPagination pageChanged={setpageNumber} currentPage={params.pageNumber}   pageCount={data?.pageCount ?? 1} />
    </div>
            </>
        )
    }
   

    </>
  )
}
