import { Button } from '@/components/ui/button'
import clsx from 'clsx'
import ProductCard from './ProductCard'
import { useEffect, useState } from 'react'
import { Product } from '@/types'

import { categoryService } from '@/services/category'
import { useQuery } from '@tanstack/react-query'

const NewProduct = () => {
  const [selectedCategory, setSelectedCategory] = useState('')
  const [products, setProducts] = useState<Product[]>([])
  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: categoryService.getAllCategories,
  })

  const onChangeCategory = (category: string) => {
    setProducts([])
    setSelectedCategory(category)
    const selectedProducts = categories?.find((item) => item.name === category)?.products
    setProducts(selectedProducts || [])
  }

  useEffect(() => {
    if (categories && categories.length > 0) {
      setSelectedCategory(categories[0].name)
      setProducts(categories[0].products)
    }
  }, [categories])

  return (
    <div className="flex flex-col justify-center items-center gap-8 py-20 ">
      <div className="text-4xl">Sản phẩm mới</div>
      {/* <div className="text-[#8A8A8A]">
        Snack khoai tây vị kim chi Hàn Quốc o'star gói 63g giòn rụm thơm ngon với gia vị đậm đà hoàn hảo
      </div> */}
      <div className="flex px-10 justify-between w-fit gap-12">
        {categories?.map((category) => (
          <Button
            variant={'custom'}
            size={'custom'}
            key={category.name}
            onClick={() => onChangeCategory(category.name)}
            className={clsx('', {
              'bg-[#FCA120] text-[#FFFFFF]': category.name === selectedCategory,
              'bg-[#e1f0e6] text-[#8A8A8A]': category.name !== selectedCategory,
            })}
          >
            {category.name}
          </Button>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-[60px]">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      <Button variant={'custom'} size={'custom'} className="bg-[#FF0606]">
        Xem thêm
      </Button>
    </div>
  )
}

export default NewProduct
