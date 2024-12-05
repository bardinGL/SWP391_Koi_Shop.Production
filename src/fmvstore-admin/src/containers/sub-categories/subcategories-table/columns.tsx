import Image from 'next/image'
import { PenSquare, Trash2 } from 'lucide-react'
import { ColumnDef } from '@tanstack/react-table'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import Typography from '@/components/ui/typography'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'

import { SkeletonColumn } from '@/types/skeleton'
import { CategoryIndexEntity } from '@/client'

const handleSwitchChange = () => {}

export const skeletonColumns: SkeletonColumn[] = [
  {
    header: <Checkbox disabled checked={false} />,
    cell: <Skeleton className="size-4 rounded-sm" />,
  },
  {
    header: 'id',
    cell: <Skeleton className="w-16 h-8" />,
  },
  {
    header: 'icon',
    cell: <Skeleton className="w-8 h-8 rounded-full" />,
  },
  {
    header: 'name',
    cell: <Skeleton className="w-20 h-8" />,
  },
  {
    header: 'description',
    cell: <Skeleton className="w-32 h-8" />,
  },
  {
    header: 'published',
    cell: <Skeleton className="w-16 h-10" />,
  },
  {
    header: 'actions',
    cell: <Skeleton className="w-20 h-8" />,
  },
]
