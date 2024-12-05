'use client'

import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { Calendar as CalendarIcon, XIcon } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar, CalendarProps } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

type Props = {
  value?: Date
  onChange?: (day?: Date) => void
  className?: string
} & Omit<CalendarProps, 'mode' | 'selected' | 'onSelect' | 'initialFocus'>

export default function DatePicker({
  className,
  value,
  onChange,
  ...props
}: Props) {
  const [hover, setHover] = useState<boolean>(false)
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          className={cn(
            'w-full h-12 justify-between text-left font-normal',
            !value && 'text-muted-foreground',
            className,
          )}
          onMouseOver={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
        >
          {value ? format(value, 'PPP') : <span>Pick a date</span>}

          {hover && value ? (
            <div className="cursor-pointer" onClick={() => onChange?.(undefined)}>
              <XIcon className="ml-2 size-4" />
            </div>
          ) : (
            <CalendarIcon className="ml-2 size-4" />
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={value}
          onSelect={(selectDay) => onChange?.(selectDay)}
          initialFocus
          {...props}
        />
      </PopoverContent>
    </Popover>
  )
}
