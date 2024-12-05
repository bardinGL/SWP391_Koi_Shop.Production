import Link from 'next/link'
import Image from 'next/image'
import { ZoomIn, PenSquare, Trash2 } from 'lucide-react'
import { ColumnDef } from '@tanstack/react-table'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Switch } from '@/components/ui/switch'
import Typography from '@/components/ui/typography'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
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
import { formatAmount } from '@/helpers/formatAmount'

import { ProductBadgeVariants } from '@/constants/badge'
import { Product, ProductStatus } from '@/types/product'
import { SkeletonColumn } from '@/types/skeleton'
import { ProductItemIndexAdminEntity } from '@/client'

export const skeletonColumns: SkeletonColumn[] = [
  {
    header: <Checkbox disabled checked={false} />,
    cell: <Skeleton className="size-4 rounded-sm" />,
  },
  {
    header: 'product name',
    cell: (
      <div className="flex gap-2 items-center">
        <Skeleton className="size-8 rounded-full" />

        <Skeleton className="w-28 h-8" />
      </div>
    ),
  },
  {
    header: 'color',
    cell: <Skeleton className="w-32 h-8" />,
  },
  {
    header: 'size',
    cell: <Skeleton className="w-32 h-8" />,
  },
  {
    header: 'category',
    cell: <Skeleton className="w-32 h-8" />,
  },
  {
    header: 'price',
    cell: <Skeleton className="w-20 h-8" />,
  },
  {
    header: 'sale price',
    cell: <Skeleton className="w-20 h-8" />,
  },
  {
    header: 'stock',
    cell: <Skeleton className="w-20 h-8" />,
  },
  {
    header: 'status',
    cell: <Skeleton className="w-24 h-8" />,
  },
  {
    header: 'actions',
    cell: <Skeleton className="w-20 h-8" />,
  },
]
