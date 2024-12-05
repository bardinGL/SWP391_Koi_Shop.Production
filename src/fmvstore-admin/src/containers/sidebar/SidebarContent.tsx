'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LogOut } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button, buttonVariants } from '@/components/ui/button'
import Typography from '@/components/ui/typography'
import { navItems } from '@/constants/navItems'
import { useEffect, useMemo, useState } from 'react'
import { useAtomValue } from 'jotai'
import { userAtom } from '@/stores/user'
import { RoleEnum } from '@/constants/enum'

export default function SidebarContent() {
  const pathname = usePathname()
  const user = useAtomValue(userAtom)

  const [clientSideRole, setClientSideRole] = useState<RoleEnum[]>([])

  useEffect(() => {
    setClientSideRole(user?.roles!)
  }, [user?.roles])

  const filteredNavItems = useMemo(() => {
    if (clientSideRole?.length === 0) {
      return []
    }
    return navItems.filter((navItem) =>
      navItem.role.some((role) => clientSideRole?.includes(role)),
    )
  }, [clientSideRole])

  if (clientSideRole === null) {
    return null
  }

  const letters = [
    { letter: 'F', color: 'text-green-600' },
    { letter: 'M', color: 'text-amber-500' },
    { letter: 'V', color: 'text-green-600' },
  ]

  return (
    <div className="pb-[5rem] h-full">
      <div className="py-6 px-2 flex flex-col overflow-y-auto h-full">
        <Link
          href="/"
          className={cn(buttonVariants({ variant: 'ghost' }), 'flex flex-col')}
        >
          <Typography component="span" className="flex flex-col items-center">
            <h1 className="flex items-center self-start text-5xl whitespace-nowrap">
              {letters.map((item, index) => (
                <div
                  key={index}
                  className={`self-stretch my-auto ${item.color}`}
                >
                  {item.letter}
                </div>
              ))}
            </h1>
            <p className="text-base text-black">Fish, Meat & Vegetables</p>
          </Typography>
        </Link>

        <ul className="pt-6 flex flex-col gap-y-2">
          {filteredNavItems.map((navItem, index) => (
            <li key={`nav-item-${index}`}>
              <Link
                href={navItem.url as any}
                className={cn(
                  buttonVariants({ variant: 'ghost' }),
                  'relative w-full justify-start px-5 py-4 gap-x-2.5 [&_svg]:size-6 [&_svg]:flex-shrink-0 font-medium text-base',
                  pathname.split('/').slice(0, 2).join('/') === navItem.url &&
                    "text-primary after:content-[''] after:absolute after:top-0 after:left-0 after:h-full after:w-1 after:bg-primary after:rounded-r-lg",
                )}
              >
                {navItem.icon} {navItem.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="px-6 py-4 absolute left-0 w-full right-0 bottom-0 border-t">
        <form action="/auth/sign-out" method="post">
          <Button
            type="submit"
            className="w-full py-3 text-base whitespace-nowrap"
          >
            <LogOut className="size-6 mr-3 flex-shrink-0" />
            Log out
          </Button>
        </form>
      </div>
    </div>
  )
}
