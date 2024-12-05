'use client'
import PageTitle from '@/components/shared/PageTitle'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'

import DatePicker from './DatePicker'
import {
  ORDER_METHODS,
  ORDER_STATUS_OPTIONS,
  OrderStatusEnum,
} from '@/constants/orders'
import { useQuery, keepPreviousData } from '@tanstack/react-query'
import {
  parseAsArrayOf,
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
  useQueryStates,
} from 'nuqs'

import { Controller, useForm } from 'react-hook-form'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import OrdersTable from './orders-table/Table'
import { toast } from '@/components/ui/use-toast'
import CustomPagination from '@/components/ui/custom-pagination'
import { PaginationProps } from '@/types/pagination'
import { orderService } from '@/services/order'
import { useFetch } from '@/hooks/useFetch'
// type OrderFilterReq = $OpenApiTs['/v1/orders/admin']['get']['req']
export default function Orders() {
  const PAGE_SIZE = 10
  const methods = useForm<any>({
    defaultValues: {
      user: '',
      keyword: '',
    },
  })

  const { control, getValues, watch, setValue } = methods
  const toDate = watch('to')
  const fromDate = watch('from')

  const {
    data: orders,
    loading,
    error,
    refresh,
  } = useFetch(() => orderService.getAllOrders())
  console.log('🚀 ~ Orders ~ orders:', orders)

  const statusFilterText = useMemo(() => {
    const valueList = getValues('orderStatus')
    if (!valueList?.length) return 'Choose Order Status'
    const optionTexts = ORDER_STATUS_OPTIONS.filter((i) =>
      valueList.includes(i.value),
    ).map((i) => i.label)
    if (optionTexts?.length < 3) return optionTexts.join(', ')
    return `${optionTexts.slice(0, 2).join(', ')} and ${
      optionTexts.length - 2
    } more`
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watch('orderStatus')])

  const { run: acceptOrder } = useFetch(orderService.acceptOrder, {
    manual: true,
    onSuccess: () => {
      refresh()
      toast({
        title: 'Status updated',
        variant: 'success',
      })
    },
    onError: (error) => {
      // if ((error as any).body.message === 'Category does not exist') {
      //   toast({
      //     title: 'Order does not exist',
      //     variant: 'destructive',
      //   })
      // }
      // if ((error as any).body.message === 'Category already exists') {
      //   toast({
      //     title: 'Category already exists',
      //     variant: 'destructive',
      //   })
      // }
      toast({
        title: 'Failed',
        variant: 'destructive',
      })
    },
  })

  const { run: rejectOrder } = useFetch(orderService.rejectOrder, {
    manual: true,
    onSuccess: () => {
      refresh()
      toast({
        title: 'Status updated',
        variant: 'success',
      })
    },
    onError: (error) => {
      // if ((error as any).body.message === 'Category does not exist') {
      //   toast({
      //     title: 'Category does not exist',
      //     variant: 'destructive',
      //   })
      // }
      toast({
        title: 'Failed',
        variant: 'destructive',
      })
    },
  })

  // const onUpdateStatus = useCallback(
  //   async (id: OrderIndexEntity['id'], status: OrderStatusEnum) => {
  //     try {
  //       await OrdersService.ordersControllerUpdateStatus({
  //         id,
  //         requestBody: {
  //           orderStatus: status,
  //         },
  //       })
  //       await refetch()
  //     } catch (e) {
  //       console.error(e)
  //       toast({
  //         title: 'Update Status Failed',
  //         description: "Can't complete this job",
  //         variant: 'destructive',
  //       })
  //     }
  //   },
  //   [refetch],
  // )
  return (
    <section>
      <PageTitle>Orders</PageTitle>
      <Card className="mb-5">
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-8 gap-4 lg:gap-6">
            <Controller
              control={control}
              name="keyword"
              render={({ field: { value, onChange } }) => (
                <Input
                  value={value}
                  onChange={onChange}
                  type="search"
                  placeholder="Search by product name"
                  className="h-12 md:col-span-2"
                />
              )}
            />
            <Controller
              control={control}
              name="user"
              render={({ field: { value, onChange } }) => (
                <Input
                  value={value}
                  onChange={onChange}
                  type="search"
                  placeholder="Search by customer name"
                  className="h-12 md:col-span-2"
                />
              )}
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild className="md:col-span-2">
                <Button
                  variant="outline"
                  className="justify-between font-normal"
                >
                  {statusFilterText}
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Choose Status</DropdownMenuLabel>
                {ORDER_STATUS_OPTIONS.map((option) => (
                  <DropdownMenuCheckboxItem
                    key={option.value}
                    checked={watch('orderStatus')?.includes(option.value)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setValue('orderStatus', [
                          ...(getValues('orderStatus') ?? []),
                          option.value,
                        ])
                      } else
                        setValue(
                          'orderStatus',
                          getValues('orderStatus')?.filter(
                            (val: any) => val != option.value,
                          ),
                        )
                    }}
                  >
                    {option.label}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Controller
              control={control}
              name="paymentMethod"
              render={({ field: { value, onChange } }) => (
                <Select value={value} onValueChange={onChange}>
                  <SelectTrigger className="capitalize md:col-span-2">
                    <SelectValue placeholder="Method" />
                  </SelectTrigger>

                  <SelectContent>
                    {ORDER_METHODS.map((method) => (
                      <SelectItem
                        value={method.value}
                        key={method.value}
                        className="capitalize"
                      >
                        {method.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 md:items-end gap-4 lg:gap-6">
            <div>
              <Label className="text-muted-foreground font-normal">
                Start date
              </Label>
              <Controller
                control={control}
                name="from"
                render={({ field: { value, onChange } }) => (
                  <DatePicker
                    value={value ? new Date(value) : undefined}
                    onChange={(day) =>
                      day
                        ? onChange(
                            new Date(day.setHours(0, 0, 0)).toISOString(),
                          )
                        : onChange(undefined)
                    }
                    toDate={toDate ? new Date(toDate) : undefined}
                  />
                )}
              />
            </div>
            <div>
              <Label className="text-muted-foreground font-normal">
                End date
              </Label>
              <Controller
                control={control}
                name="to"
                render={({ field: { value, onChange } }) => (
                  <DatePicker
                    value={value ? new Date(value) : undefined}
                    onChange={(day) =>
                      day
                        ? onChange(
                            new Date(day.setHours(23, 59, 59)).toISOString(),
                          )
                        : onChange(undefined)
                    }
                    fromDate={fromDate ? new Date(fromDate) : undefined}
                    toDate={new Date()}
                  />
                )}
              />
            </div>

            <div className="flex flex-wrap sm:flex-nowrap gap-4">
              <Button size="lg" className="h-12 flex-grow" type="submit">
                Filter
              </Button>
              <Button
                size="lg"
                variant="secondary"
                className="h-12 flex-grow"
                type="button"
                onClick={() => {
                  methods.reset({
                    user: '',
                    keyword: '',
                  })
                }}
              >
                Reset
              </Button>
            </div>
          </div>
        </div>
      </Card>
      <OrdersTable
        data={orders?.result}
        onValueChange={(orderId: string, status: OrderStatusEnum) => {
          if (status === OrderStatusEnum.SHIPPING) {
            acceptOrder(orderId)
          } else {
            rejectOrder(orderId)
          }
        }}
      />
    </section>
  )
}
