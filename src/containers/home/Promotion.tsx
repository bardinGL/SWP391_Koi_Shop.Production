import LeftPromotion from '@/assets/left-promo.png'
import RightPromotion from '@/assets/right-promo.png'
import TopPromotion from '@/assets/top-promo.png'
import BottomPromotion from '@/assets/bottom-promo.png'
import { Button } from '@/components/ui/button'

const Promotion = () => {
  return (
    <div className="w-full h-[786px] flex gap-8">
      <img src={LeftPromotion} alt="promotion-1" className="w-1/3 object-cover" />
      <div className="flex flex-col items-center justify-between">
        <img src={TopPromotion} alt="promotion-1" className="w-full h-[150px] object-cover" />
        <div className="flex flex-col items-center font-medium text-center rounded-xl w-full gap-2">
          <div className="text-7xl font-bold tracking-tighter leading-none text-green-600">THÁNG 9</div>
          <span
            className="w-full text-[187px] stroke-[#FCA120] text-[#FFFFFF] leading-[150px]"
            style={{
              WebkitTextStroke: '2px #FCA120',
            }}
          >
            SALE
          </span>
          <p className="text-xl uppercase text-zinc-700 tracking-[2px]">TIỆN ÍCH & GIÁ RẺ</p>
          <Button
            variant={'custom'}
            size={'custom'}
            className="px-8 py-5 mt-7 max-w-full text-base leading-none text-white bg-red-500 rounded-xl shadow-[0px_20px_35px_rgba(0,0,0,0.15)] w-[207px]"
          >
            NHẬN NGAY ƯU ĐÃI
          </Button>
        </div>
        <img src={BottomPromotion} alt="promotion-1" className="w-full h-[150px] object-cover" />
      </div>
      <img src={RightPromotion} alt="promotion-1" className="w-1/3 object-cover" />
    </div>
  )
}

export default Promotion
