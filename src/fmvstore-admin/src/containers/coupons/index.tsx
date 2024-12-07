'use client'
import PageTitle from '@/components/shared/PageTitle'
import CouponActions from './CouponActions'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { parseAsInteger, parseAsString, useQueryStates } from 'nuqs'
import { useFetch } from '@/hooks/useFetch'
import {
  ColumnDef,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { Card, Input, Typography } from 'antd'
import TableSkeleton from '@/components/shared/TableSkeleton'
import { skeletonColumns } from './coupons-table/columns'
import TableError from '@/components/shared/TableError'
import DataTable from '@/components/shared/DataTable'
import { useState } from 'react'
import { toast } from '@/components/ui/use-toast'
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
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Button } from '@/components/ui/button'
import { PenSquare, Trash2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { promotionFormSchema } from './schemas'
import { z } from 'zod'
import { promotionService } from '@/services/promotion'

type FormData = z.infer<typeof promotionFormSchema>

export default function Coupons() {
  const [rowSelection, setRowSelection] = useState({})
  const [isOpen, setIsOpen] = useState(false)
  const [promotionQueries, setPromotionQueries] = useQueryStates(
    {
      keyword: parseAsString.withDefault(''),
      page: parseAsInteger.withDefault(1),
    },
    {
      clearOnDefault: true,
      shallow: false,
    },
  )

  const perPage = 10

  const {
    data: promotions,
    loading,
    error,
    refresh,
  } = useFetch(() => promotionService.getAll())

  const { run: deletePromotion } = useFetch(promotionService.delete, {
    manual: true,
    onSuccess: () => {
      refresh()
      toast({
        title: 'Promotion deleted',
        variant: 'success',
      })
    },
    onError: (error) => {
      if ((error as any).body.message === 'Promotion does not exist') {
        toast({
          title: 'Promotion does not exist',
          variant: 'destructive',
        })
      }
    },
  })

  const renderMetadata = () => {
    if (loading)
      return <TableSkeleton perPage={perPage} columns={skeletonColumns} />

    if (error || !promotions)
      return (
        <TableError
          errorMessage="Something went wrong while trying to fetch promotion."
          refetch={() => refresh()}
        />
      )
  }

  const handleDelete = (id: string) => {
    deletePromotion(id)
  }

  const columns: ColumnDef<any>[] = [
    {
      header: 'Code',
      cell: ({ row }) => row.original.code,
    },
    {
      header: 'Discount Percentage',
      cell: ({ row }) => `${row.original.discountPercentage}%`,
    },
    {
      header: 'Start date',
      cell: ({ row }) => new Date(row.original.startDate).toDateString(),
    },
    {
      header: 'End Date',
      cell: ({ row }) => new Date(row.original.endDate).toDateString(),
    },
    {
      header: 'actions',
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-1">
            <AlertDialog>
              <Tooltip>
                <TooltipTrigger asChild>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-foreground"
                    >
                      <Trash2 className="size-5" />
                    </Button>
                  </AlertDialogTrigger>
                </TooltipTrigger>

                <TooltipContent>
                  <p>Delete Promotion</p>
                </TooltipContent>
              </Tooltip>

              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    your account and remove your data from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => handleDelete(row.original.id)}
                  >
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )
      },
    },
  ]

  const table = useReactTable<any>({
    data: promotions || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      rowSelection,
    },
  })

  return (
    <section>
      <PageTitle>Coupons</PageTitle>
      <CouponActions refresh={refresh}></CouponActions>
      {/* <Card className="mb-5">
        <div className="flex flex-col md:flex-row gap-4 lg:gap-6">
          <Input
            type="search"
            placeholder="Search by code"
            className="h-12 md:basis-1/2"
            value={promotionQueries.keyword}
            onChange={(e) => setPromotionQueries({ keyword: e.target.value })}
          />

          <div className="flex flex-wrap sm:flex-nowrap gap-4 md:basis-1/2">
            <Button onClick={() => refresh()} size="lg" className="flex-grow">
              Filter
            </Button>
            <Button
              onClick={() => {
                setPromotionQueries({ keyword: '' })
                refresh()
              }}
              size="lg"
              variant="secondary"
              className="flex-grow"
            >
              Reset
            </Button>
          </div>
        </div>
      </Card> */}
      {renderMetadata()}
      <DataTable table={table} pagination={null} />
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild />
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Edit Coupons</SheetTitle>
            <SheetDescription>
              {" Make changes to coupons here. Click save when you're done."}
            </SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </section>
  )
}
