import { Ratings } from '@/components/ui/rating'
import { formatCurrency } from '@/helper'
import { Product } from '@/types'
import React from 'react'
import { useNavigate } from 'react-router-dom'

type ProductProps = {
  product: Product
}

const ProductCard: React.FC<ProductProps> = ({ product }) => {
  const navigate = useNavigate()
  const navigateToProductDetail = () => {
    navigate(`/products/${product.id}`)
  }
  return (
    <div
      className="flex flex-col font-medium max-w-[336px] text-zinc-700 bg-[#FFFFFF] rounded-[10px] py-6 px-8 cursor-pointer"
      onClick={navigateToProductDetail}
    >
      <img
        loading="lazy"
        src={product.imageUrl}
        alt={product.name}
        className="object-contain self-center w-full aspect-[1.27] max-w-[290px]"
      />
      <div className="flex mt-3 text-xl">
        <h2 className="grow shrink w-[222px]">{product.name}</h2>
        {/* <StarRating src={ratingImageSrc} /> */}
      </div>
      <p className="self-start mt-6 text-xs">(5) Customer Reviews</p>
      <div className="flex items-center justify-between mt-6">
        <p className="self-start text-2xl tracking-tight leading-none">{formatCurrency(product.price)}</p>
        <Ratings rating={5} color="#FCA120" />
      </div>
    </div>
  )
}

export default ProductCard
