import Card1 from '@/assets/card1.png'
import Card2 from '@/assets/card2.png'
import Card3 from '@/assets/card3.png'
import Card4 from '@/assets/card4.png'
import Card5 from '@/assets/card5.png'

const cardItems = [
  {
    id: 1,
    src: Card1,
    alt: 'card1',
  },
  {
    id: 2,
    src: Card2,
    alt: 'card2',
  },
  {
    id: 3,
    src: Card3,
    alt: 'card3',
  },
  {
    id: 4,
    src: Card4,
    alt: 'card4',
  },
  {
    id: 5,
    src: Card5,
    alt: 'card5',
  },
]

const Payment = () => {
  return (
    <div className="flex flex-col items-center gap-12 w-full pt-[120px] pb-[240px] bg-gradient-to-t from-[#FFFFFF] to-[#F5F5F5]">
      <div className="text-4xl font-bold">Thanh toán bằng thẻ</div>
      <div className="text-center ">
        Việc mua sắm sẽ dễ dàng và tiện lợi hơn bao giờ hết nhờ việc GS25 chấp nhận thanh toán tất cả các loại thẻ như
        thẻ tín dụng <br /> (Visa, Mastercard, Dinner Club, Amex, JCB) và các loại thẻ ghi nợ nội địa khác.
      </div>
      <div className="flex gap-4 items-center">
        {cardItems.map((item) => (
          <div key={item.id}>
            <img width={'90%'} src={item.src} alt={item.alt} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default Payment
