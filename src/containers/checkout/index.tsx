import PageLayout from '@/components/common/PageLayout'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import React, { useState } from 'react'
import { cartAtom, updateItemCart } from '@/stores/cart'
import { formatCurrency } from '@/helper'
import { useAtom } from 'jotai'
import { TrashIcon } from '@heroicons/react/24/outline'
import { cartService } from '@/services/cart'
import { useMutation,useQuery } from '@tanstack/react-query'
import { useToast } from '@/hooks/useToast'
import { userService } from '@/services/user'
import { orderService } from '@/services/order'
import { useNavigate } from 'react-router-dom'
import { Input } from '@/components/ui/input'
import { userAtom } from '@/stores/user'
import { useAtomValue } from 'jotai'

const CheckoutPageContainer = () => {
  const [cartItem, setCartItem] = useAtom(cartAtom)

  const totalPrice = cartItem?.reduce((acc, item) => acc + item.item.price * item.quantity, 0) ?? 0

  const navigate = useNavigate()

  const [promotion, setPromotion] = useState('')

  const { mutate: addItemToCart } = useMutation({
    mutationFn: () => cartService.addProductToCart(),
    onSuccess: () => {
      // handle success
      console.log('add successfully')
    },
    onError: (error) => {
      // handle error
      console.error(error)
      useToast().error(error.message)
    },
  })

  const { mutate: checkout } = useMutation({
    mutationFn: (promotionCode: string) => orderService.checkout(promotionCode),
    onSuccess: () => {
      // handle success
      console.log('checkout successfully')
      useToast().success('Checkout successfully!')
      setCartItem([])
      navigate('/')
    },
    onError: (error) => {
      // handle error
      console.error(error)
      useToast().error(error.message)
    },
  })
  const user = useAtomValue(userAtom)
  const { data: userProfile } = useQuery({
    queryKey: ['getUserProfile', user?.id],
    queryFn: () => userService.me(user?.id!),
  })

  const handleCheckout = () => {
    console.log('Checkout')

    checkout(promotion)
  }

  return (
    <PageLayout>
      <React.Fragment>
        <main className="container mx-auto my-8 grid grid-cols-1 gap-8 md:grid-cols-[2fr_1fr]">
          <div>
            {cartItem?.map((product) => (
              <div className="flex flex-col">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <img
                      src={product.item?.imageUrl}
                      alt={product.item?.name}
                      className="h-[170px] mr-12 object-cover"
                    />
                    <div className="flex flex-col">
                      <div className="font-bold text-2xl">{product.item?.name}</div>
                      <div className="">Số lượng: {product?.quantity}</div>
                    </div>
                  </div>
                  <div className="flex gap-12">
                    <div className="flex items-center gap-3">
                      <Button onClick={() => updateItemCart(product.item, -1)} variant={'ghost'}>
                        <MinusIcon className="w-4 h-4" />
                      </Button>
                      {product.quantity}
                      <Button onClick={() => updateItemCart(product.item, 1)} variant={'ghost'}>
                        <PlusIcon className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="text-[18px] font-semibold">
                        {formatCurrency(product.item?.price * product.quantity)}
                      </div>
                      <Button
                        onClick={() => updateItemCart(product.item, 0)}
                        variant={'ghost'}
                        className="flex items-center gap-2"
                      >
                        <TrashIcon className="w-4 h-4" />
                        <div className="text-[#FF5252]">Xóa</div>
                      </Button>
                    </div>
                  </div>
                </div>
                <Separator className="my-2 h-0.5" />
              </div>
            ))}
          </div>
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Thông tin đơn hàng</CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-2">
                <div className="flex items-center justify-between">
                  
                  <span>Tạm tính</span>
                  <span>{formatCurrency(totalPrice)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Phí vận chuyển</span>
                  <span>0</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between font-medium">
                  <span>Tổng</span>
                  <span>{formatCurrency(totalPrice)}</span>
                  
                </div>
                <div className="flex items-center justify-between font-medium">
            <div className="text-xl">Số dư hiện tại</div>
            <div className="text-xl font-bold">{formatCurrency(userProfile?.result?.balance ?? 0)}</div>
          </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Mã giảm giá</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input value={promotion} onChange={(e) => setPromotion(e.target.value)} placeholder="FALLSALE" />
              </CardContent>
              <CardFooter>
                <Button className="w-full" onClick={handleCheckout}>
                  Đặt hàng
                </Button>
              </CardFooter>
            </Card>
          </div>
        </main>
      </React.Fragment>
    </PageLayout>
  )
}

export default CheckoutPageContainer

function MinusIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
    </svg>
  )
}

function PlusIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  )
}
