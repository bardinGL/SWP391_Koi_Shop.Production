import Customer1 from '@/assets/customer1.png'
import Customer2 from '@/assets/customer2.png'
import { LogoLetter } from '@/components/common/Logo'
import { Ratings } from '@/components/ui/rating'
import clsx from 'clsx'
import { ChevronRightIcon, ChevronLeftIcon } from '@heroicons/react/24/outline'

const customerReviews = [
  {
    id: 1,
    image: Customer1,
    name: 'Lê Quang Huy',
    position: 'Traveler',
    review:
      '“Tôi ghé FMV hàng ngày để mua đồ uống và snack trên đường đi làm. Nhân viên thân thiện và tôi luôn cảm thấy tiện lợi với các mặt hàng có sẵn tại đây. Một điểm cộng lớn là thanh toán cực kỳ nhanh.”',
    rating: 5,
  },
  {
    id: 2,
    image: Customer2,
    name: 'Nguyễn Thị Hà',
    position: 'Housewife',
    review:
      '“Tôi thích mua đồ ăn nhanh và đồ uống tại FMV. Các sản phẩm tại đây đa dạng và phong phú. Tôi luôn mua được những món ăn ngon và tiện lợi cho cả gia đình.”',
    rating: 4,
  },
  {
    id: 3,
    image: Customer2,
    name: 'Lê Thị Kim',
    position: 'UI Designer',
    review:
      'FMV đã trở thành điểm đến quen thuộc của tôi. Từ thực phẩm tươi đến các nhu yếu phẩm hàng ngày, mọi thứ đều có. Tôi rất thích chương trình khuyến mãi và các ưu đãi thường xuyên mà FMV cung cấp.',
    rating: 4,
  },
]

const letters = [
  { letter: 'F', color: 'text-green-600' },
  { letter: 'B', color: 'text-amber-500' },
  { letter: 'T', color: 'text-green-600' },
]
const CustomerReview = () => {
  return (
    <div className="h-[800px] flex flex-col justify-center items-center gap-5 bg-[#d7ebde] w-full">
      <div className="flex gap-1 font-bold">
        <span className="text-4xl">Khách Hàng Nói Gì Về</span>
        <h1 className="flex items-center self-start text-4xl whitespace-nowrap">
          {letters.map((item, index) => (
            <LogoLetter key={index} letter={item.letter} color={item.color} />
          ))}
        </h1>
      </div>
      <div className="w-[600px] text-center text-[#8A8A8A]">
        Với chuỗi cửa hàng tiện lợi FMV, các cá nhân, tổ chức tại Việt Nam có thể trở thành đối tác nhượng quyền với 3
        quy mô, tùy vào từng diện tích của khu vực cũng như khả năng kinh doanh của cá nhân, tổ chức đó.
      </div>
      <div className="relative h-[360px] mt-12 w-full">
        <MediumReviewCard {...customerReviews[0]} />
        <SmallReviewCard left={true} {...customerReviews[1]} />
        <SmallReviewCard left={false} {...customerReviews[2]} />
      </div>
      <div>
        <div className="flex justify-center items-center gap-3">
          <div className="cursor-pointer rounded-full bg-[#FFFFFF] p-3 ">
            <ChevronLeftIcon className="w-6 h-6 opacity-20" />
          </div>
          <div className="cursor-pointer rounded-full bg-[#FFFFFF] p-3">
            <ChevronRightIcon className="w-6 h-6 cursor-pointer" />
          </div>
        </div>
      </div>
    </div>
  )
}
const MediumReviewCard = ({ image, name, position, review, rating }: any) => {
  return (
    <div className="flex bg-[#FFF1F0] rounded h-full w-[920px] p-12 z-10 absolute  left-1/2 -translate-x-1/2">
      <div className="flex justify-center items-center basis-2/5">
        <img className="aspect-square object-cover" src={image} alt={name} />
      </div>
      <div className="flex flex-col justify-between gap-4 basis-3/5">
        <div>{review}</div>
        <Ratings rating={rating} />
        <div className="border border-b-2 border-black w-[200px]" />
        <div className="text-2xl">{name}</div>
        <div>{position}</div>
      </div>
    </div>
  )
}

const SmallReviewCard = ({ image, name, position, review, rating, left }: any) => {
  return (
    <div
      className={clsx('flex bg-[#FFFFFF] rounded h-[75%] w-[690px] p-9 absolute z-1', {
        'left-24 top-1/2 -translate-y-1/2': left,
        'right-24 top-1/2 -translate-y-1/2': !left,
      })}
    >
      <div className="flex justify-center items-center basis-2/5">
        <img className="aspect-square object-cover" src={image} alt={name} />
      </div>
      <div className="flex flex-col justify-between gap-1 basis-3/5">
        <div>{review}</div>
        <Ratings rating={rating} />
        <div className="border border-b-2 border-black w-[200px]" />
        <div className="text-2xl">{name}</div>
        <div>{position}</div>
      </div>
    </div>
  )
}

export default CustomerReview
