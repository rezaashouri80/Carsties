import EmptyFilter from '@/app/components/EmptyFilters'
import React from 'react'

export default function SignIn({searchParams}: {searchParams:{callbackUrl:string}}) {
  return (
    <EmptyFilter 
    title='you need to be login'
    subtitle='Pleas click below to login'
    showLogin
    callbackUrl={searchParams.callbackUrl}
    />
  )
}
