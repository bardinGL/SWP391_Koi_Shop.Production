import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

import PageLayout from '@/components/common/PageLayout'
import { StarFilledIcon } from '@radix-ui/react-icons'
import { formatCurrency } from '@/helper'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { CheckIcon, PlusIcon } from '@heroicons/react/24/outline'
import { Separator } from '@/components/ui/separator'
import { Ratings } from '@/components/ui/rating'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { productService } from '@/services/product'
import { useState } from 'react'
import { updateItemCart } from '@/stores/cart'
import { useToast } from '@/hooks/useToast'

const reviews = [
  {
    id: 1,
    name: 'Peggy G.',
    verify: true,
    rating: 5,
    comment: 'Excellent Product',
    time: '1 week ago',
  },
  {
    id: 2,
    name: 'Mona Lisa',
    verify: true,
    rating: 5,
    comment: 'Perfect fit. Superb Quality!',
    time: '2 week ago',
  },
  {
    id: 3,
    name: 'Mona Lisa',
    verify: true,
    rating: 5,
    comment: 'Great Quality. Packaging could be better.',
    time: '3 week ago',
  },
]

const ProductDetailContainer = () => {
  const param = useParams()
  const { data: productData } = useQuery({
    queryKey: ['product', param.id],
    queryFn: () => productService.getProductDetail(param?.id!),
  })
  const [quantity, setQuantity] = useState(1)
  const handleAddToCart = () => {
    console.log('Add to cart')
    console.log('🚀 ~ handleAddToCart ~ productData:', productData)
    updateItemCart(productData, quantity)
    useToast().success('Add to cart successfully!')
  }

  return (
    <PageLayout>
      {/* <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Cửa hàng</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/products">Rau củ & Trái cây</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/products">Rau tươi</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Dưa leo</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb> */}
      <div className="w-full mt-12 flex gap-12">
        <div className="w-1/2 flex flex-col gap-4">
          <div>
            <img src={productData?.imageUrl} alt="image" />
          </div>
          {/* <div className="flex gap-3">
            <div>
              <img src={ImageSub1} alt="image" />
            </div>
            <div>
              <img src={ImageSub2} alt="image" />
            </div>
            <div>
              <img src={ImageSub3} alt="image" />
            </div>
            <div>
              <img src={ImageSub4} alt="image" />
            </div>
            <div>
              <img src={ImageSub5} alt="image" />
            </div>
            <div className="relative">
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-fit px-4 bg-[#000000] border border-[#FFFFFF] text-[#FFFFFF]">
                +2
              </div>
              <img className="" src={ImageSub4} alt="image" />
            </div>
          </div> */}
        </div>
        <div className="w-1/2 flex flex-col">
          {/* <div className="text-[20px] mb-4">Rau tươi</div> */}
          <div className="text-[24px] font-bold mb-2">{productData?.name}</div>
          {/* <div className="mb-1">Tất cả sản phẩm được kiểm định chất lượng và bán bởi chuỗi cửa hàng tiện lợi FMV</div> */}
          <div className="text-[12px] flex gap-4 items-center mb-8">
            <div>
              <span className="font-bold">4K+</span> sold
            </div>
            <div className="w-2 h-2 rounded-full bg-[#000000]"></div>
            <div className="flex">
              <StarFilledIcon className="w-4 h-4 text-[#FFD470]" />
              <span className="font-semibold">4.8</span>(156 reviews)
            </div>
          </div>
          <div className="font-bold text-2xl mb-8">{formatCurrency(productData?.price! ?? 0)}</div>
          <div className="flex items-center gap-4 mb-6">
            <span>Số lượng:</span>
            <Input
              type="number"
              className="w-[60px]"
              value={quantity}
              onChange={(event) => {
                if (Number(event.target.value) >= 0) {
                  setQuantity(Number(event.target.value))
                }
              }}
            />
          </div>
          <Button onClick={handleAddToCart} variant={'custom'} className="bg-[#FFD470] text-[#000000]">
            <PlusIcon className="w-4 h-4" />
            Thêm Hàng
          </Button>
        </div>
      </div>

      <div className="flex flex-col mt-[60px] mb-12">
        <Tabs defaultValue="rate">
          <TabsList className="bg-[#FFFFFF] mb-6">
            <TabsTrigger className="text-[24px]" value="rate">
              Đánh giá
            </TabsTrigger>
            <TabsTrigger className="text-[24px]" value="question">
              Câu hỏi
            </TabsTrigger>
          </TabsList>
          <TabsContent value="rate">
            <div className="flex gap-2 items-center">
              <div className="text-5xl">4.8</div>
              <div>
                <Ratings rating={5} />
                <div className="text-[12px]">Based on 138 reviews</div>
              </div>
            </div>
            <Separator className="my-4 h-0.5" />
            <div className="flex justify-between items-center pt-4 pb-4 ">
              <Button className="py-4 px-12">Viết bình luận</Button>
              <Select>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Đánh giá cao nhất" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="apple">Đánh giá cao nhất</SelectItem>
                    <SelectItem value="banana">Đánh giá thấp nhất</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            {reviews.map((review) => (
              <div>
                <Separator className="my-4 h-0.5" />
                <div className="flex justify-between">
                  <div className="flex gap-8">
                    <Avatar>
                      <AvatarImage src="https://github.com/shadcn.png2323" alt="@shadcn" />
                      <AvatarFallback>{review.name.split(' ').map((item) => item[0])}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div>{review.name}</div>
                      {review.verify && (
                        <div className="flex items-center gap-1">
                          <span>Verified Buyer</span>
                          <div className="p-1 bg-[#FFD470] w-fit h-fit rounded-full">
                            <CheckIcon className="w-2 h-2" />
                          </div>
                        </div>
                      )}
                    </div>
                    <Separator orientation="vertical" className="h-12" />
                    <div>
                      <Ratings rating={review.rating} />
                      <div>{review.comment}</div>
                    </div>
                  </div>
                  <div>{review.time}</div>
                </div>
              </div>
            ))}
            <div className="w-full mt-2 text-center">{'Đọc tất cả review >>>'}</div>
          </TabsContent>
          <TabsContent value="question"></TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  )
}

export default ProductDetailContainer
