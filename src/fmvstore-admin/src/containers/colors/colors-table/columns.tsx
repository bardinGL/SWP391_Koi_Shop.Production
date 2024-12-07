import { Checkbox } from '@/components/ui/checkbox'
import { Skeleton } from '@/components/ui/skeleton'

import { SkeletonColumn } from '@/types/skeleton'

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
