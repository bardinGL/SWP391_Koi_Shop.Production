import Promotion1 from '@/assets/promo1.svg'
import Promotion2 from '@/assets/promo2.svg'
import Promotion3 from '@/assets/promo3.svg'
import Promotion4 from '@/assets/promo4.svg'

const promotions = [
  {
    id: 1,
    title: 'Chất lượng',
    content: 'Niềm tin từ khách hàng',
    image: Promotion1,
  },
  {
    id: 2,
    title: 'Được các hãng lớn tin tưởng',
    content: 'Thị trường 3 năm',
    image: Promotion2,
  },
  {
    id: 3,
    title: 'Miễn phí ship',
    content: 'Trong bán kính 5 km',
    image: Promotion3,
  },
  {
    id: 4,
    title: 'Mở cửa 24 / 7',
    content: 'Luôn phục vụ',
    image: Promotion4,
  },
]

const SubPromotion = () => {
  return (
    <div className="flex justify-between items-center w-full py-12">
      {promotions.map((promotion) => (
        <div key={promotion.id} className="flex gap-4 items-center justify-center ">
          <img className="h-full" src={promotion.image} alt="Promotion" />
          <div className="flex flex-col justify-center">
            <h2 className="text-2xl font-bold">{promotion.title}</h2>
            <p className="text-neutral-500">{promotion.content}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

export default SubPromotion
