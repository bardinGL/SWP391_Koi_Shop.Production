'use client'

import Container from '@/components/ui/container'
import Profile from '@/containers/header/Profile'

export default function Header() {
  return (
    <header className="sticky top-0 left-0 w-full bg-popover py-4 shadow-sm z-40">
      <Container>
        <div className="flex justify-between">
          <div className="flex items-center gap-x-2 ml-auto">
            <Profile />
          </div>
        </div>
      </Container>
    </header>
  )
}
