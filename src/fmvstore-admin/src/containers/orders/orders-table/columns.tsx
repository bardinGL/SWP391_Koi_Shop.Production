import { ColumnDef } from '@tanstack/react-table'
import Typography from '@/components/ui/typography'
import { Skeleton } from '@/components/ui/skeleton'
import { formatAmount } from '@/helpers/formatAmount'
import { SkeletonColumn } from '@/types/skeleton'
import { ORDER_METHODS } from '@/constants/orders'

const onChangeStatus = () => {}

export const columns: ColumnDef<any>[] = [
  {
    header: 'Order Code',
    cell: ({ row }) => (
      <div className="flex gap-2 items-center">
        <Typography className="capitalize block truncate">
          {row.original.orderCode}
        </Typography>
      </div>
    ),
  },
  {
    header: 'Order Date',
    cell: ({ row }) => (
      <Typography className="block max-w-52 truncate">
        {row.original.user}
      </Typography>
    ),
  },
  {
    header: 'Order Date',
    cell: ({ row }) => (
      <Typography className="block max-w-52 truncate">
        {row.original.orderDate}
      </Typography>
    ),
  },
  {
    header: 'Total',
    cell: ({ row }) => {
      return formatAmount(row.original.orderTotal)
    },
  },
  {
    header: 'Payment Method',
    cell: ({ row }) => (
      <Typography className="block max-w-52 truncate">
        {ORDER_METHODS.find((i) => i.value === row.original.paymentMethod)
          ?.label ?? 'Unknown'}
      </Typography>
    ),
  },
  {
    header: 'Status',
    cell: ({ row }) => {
      return (
        <Typography className="block max-w-52 truncate">
          {row.original.orderStatus}
        </Typography>
      )
    },
  },
]

export const skeletonColumns: SkeletonColumn[] = [
  {
    header: 'Order Code',
    cell: <Skeleton className="w-32 h-8" />,
  },
  {
    header: 'User Name',
    cell: <Skeleton className="w-32 h-8" />,
  },
  {
    header: 'Order Date',
    cell: <Skeleton className="w-32 h-8" />,
  },
  {
    header: 'Total',
    cell: <Skeleton className="w-32 h-8" />,
  },
  {
    header: 'Payment Method',
    cell: <Skeleton className="w-20 h-8" />,
  },
  {
    header: 'Status',
    cell: <Skeleton className="w-20 h-8" />,
  },
]
