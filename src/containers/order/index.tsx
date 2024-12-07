import PageLayout from '@/components/common/PageLayout'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { formatCurrency } from '@/helper'
import { useToast } from '@/hooks/useToast'
import { orderService } from '@/services/order'
import { useMutation, useQuery } from '@tanstack/react-query'
import clsx from 'clsx'
import dayjs from 'dayjs'

const OrderPageContainer = () => {
  const { data: ordersData } = useQuery({
    queryKey: ['getOrders'],
    queryFn: () => orderService.getOrders(),
  })

  const alertCancelOrder = (orderId: string) => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      console.log('Cancel order', orderId)
      rejectOrder(orderId)
    }
  }
  const { mutate: rejectOrder } = useMutation({
    mutationFn: (orderId: string) => orderService.rejectOrder(orderId),
    onSuccess: () => {
      // handle success
      console.log('reject successfully')
      useToast().success('Reject successfully!')
    },
    onError: (error) => {
      // handle error
      console.error(error)
      useToast().error(error.message)
    },
  })
  return (
    <PageLayout>
      <div className="flex flex-col gap-4">
        <div className="text-center w-full text-4xl font-bold">Order History</div>
        <div>
          {ordersData?.result?.map((order: any) => (
            <div className="flex flex-col bg-white shadow-md rounded-lg p-6 mb-4">
              <div className="flex justify-between">
                <div className="text-lg font-semibold text-gray-700 mb-2">
                  {dayjs(order.orderDate).format('MMMM D, YYYY')}
                </div>
                <div
                  className={clsx('text-2xl font-semibold mb-2', {
                    'text-red-600': order.status === 'REJECTED',
                    'text-green-600': order.status === 'SHIPPING',
                    'text-blue-600': order.status === 'PENDING',
                  })}
                >
                  {order.status}
                </div>
              </div>
              {order.orderDetails.map((item: any) => (
                <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg mb-2">
                  <div className="flex items-center">
                    <img src={item?.imageUrl} alt={item?.name} className="h-[170px] mr-12 object-cover rounded-lg" />
                    <div className="flex flex-col">
                      <div className="font-bold text-2xl text-blue-600">{item?.name}</div>
                      <div className="text-gray-600">Quantity: {item?.quantity}</div>
                    </div>
                  </div>
                  <div className="flex gap-12">
                    <div className="flex items-center gap-3 text-gray-700">{item.quantity}</div>
                    <div className="flex flex-col items-center">
                      <div className="text-[18px] font-semibold text-green-600">{formatCurrency(item?.price)}</div>
                    </div>
                  </div>
                </div>
              ))}
              <div className="flex justify-between">
                {order.status === 'PENDING' && (
                  <Button onClick={() => alertCancelOrder(order.orderId)} variant="destructive" className="text-white">
                    Cancel
                  </Button>
                )}

                <div className="flex justify-end text-xl font-semibold text-green-600 gap-4">
                  Total amount: {formatCurrency(order.totalAmount)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageLayout>
  )
}

export default OrderPageContainer
