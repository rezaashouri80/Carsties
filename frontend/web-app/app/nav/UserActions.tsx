'use client'
import { Button, Dropdown, DropdownItem } from 'flowbite-react'
import { User } from 'next-auth'
import { signOut } from 'next-auth/react'
import Link from 'next/link'
import React from 'react'
import { AiFillCar, AiFillTrophy, AiOutlineLogout } from 'react-icons/ai'
import { HiCog, HiUser } from 'react-icons/hi'

type Props = {
  user:User
}

export default function UserActions({user}:Props) {
  return (

    <Dropdown inline label={`welcome ${user.name} `} className=' cursor-pointer'>
      <DropdownItem icon={HiUser}>
        My Auctions
      </DropdownItem>
      <DropdownItem icon={AiFillTrophy}>
         Auctions Won
      </DropdownItem>
      <DropdownItem icon={AiFillCar}>
        Sell My Car
      </DropdownItem>
      <DropdownItem icon={HiCog}>
        <Link href='/session'>
        Session (dev only)
        </Link>
      </DropdownItem>
      <DropdownItem icon={AiOutlineLogout} onClick={()=> signOut({redirectTo:"/"})}>
        Log out
      </DropdownItem>
    </Dropdown>
  )
}
