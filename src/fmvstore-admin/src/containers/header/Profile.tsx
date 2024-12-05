'use client'

import Link from 'next/link'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

import { Settings, LogOut, LayoutGrid } from 'lucide-react'
import Typography from '@/components/ui/typography'
import { useRouter } from 'next/navigation'
import { useFetch } from '@/hooks/useFetch'
import Cookies from 'js-cookie'
import { useEffect, useState } from 'react'
import { useAtom } from 'jotai'
import { userAtom } from '@/stores/user'

export default function Profile() {
  const router = useRouter()
  // const [user, setUser] = useAtom(userAtom)
  return (
    <div className="flex ml-2 items-center gap-4">
      {/* <Typography variant="h4">{`${user?.firstName} ${user?.lastName}`}</Typography> */}
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger className="rounded-full ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
          <Avatar>
            <AvatarImage src="" />
            <AvatarFallback>
              {/* {user?.firstName.split(' ').map((item) => item[0])} */}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          alignOffset={-10}
          className="flex flex-col"
          align="end"
        >
          <DropdownMenuItem asChild>
            <Link
              href="/"
              className="w-full justify-start py-3.5 pl-3 pr-8 tracking-wide !cursor-pointer"
            >
              <LayoutGrid className="mr-3 size-5" /> Dashboard
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link
              href="/profile"
              className="w-full justify-start py-3.5 pl-3 pr-8 tracking-wide !cursor-pointer"
            >
              <Settings className="mr-3 size-5" /> Edit Profile
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <button
              onClick={() => {
                localStorage.removeItem('access_token')
                localStorage.removeItem('user')
                router.push('/login')
              }}
              className="w-full justify-start py-3.5 pl-3 pr-8 tracking-wide !cursor-pointer"
            >
              <LogOut className="mr-3 size-5" /> Log Out
            </button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
