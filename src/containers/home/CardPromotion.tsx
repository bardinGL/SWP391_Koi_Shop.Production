import React from 'react'
import CardImage from '@/assets/card-promotion.png'
import { Button } from '@/components/ui/button'

const CardPromotion: React.FC = () => {
  return (
    <div
      className="flex border w-full py-6"
      style={{
        background: 'linear-gradient(100deg, #399C5A 50%, black 50%, black calc(50% + 3px), #fff1de calc(50% + 4px))',
      }}
    >
      <div className="flex-1 p-4 text-white justify-center items-center flex" style={{ padding: '1em 2%' }}>
        <img src={CardImage} alt="Card Promotion" />
      </div>
      <div className="flex-1 p-4 text-white flex justify-center items-center" style={{ padding: '1em 2%' }}>
        <div className="flex flex-col items-start text-base rounded-xl h-full w-[70%]">
          <div>
            <h2 className="text-neutral-500">Dịch vụ tiện ích</h2>
            <h1 className="mt-6 text-4xl font-bold text-green-600 max-md:max-w-full">Thẻ điện thoại - Thẻ game</h1>
          </div>
          <div className="mt-8">
            <h3 className="text-black">DESCRIPTION</h3>
            <p className="mt-6 text-neutral-500 max-md:mr-0 max-md:max-w-full">
              Mọi lúc, mọi nơi FMV cung cấp đầy đủ các mệnh giá của tất cả các nhà mạng: Viettel, Mobifone, Vinafone,
              Vietnammobie, Gmobie,... Không những thế FMV còn "sát cánh" với các game thủ trên mọi mặt trận bằng cách
              cung cấp dịch vụ nạp thẻ game online trả trước đang phổ biến tại Việt Nam: Vinagame, Oncash, Garena,…
            </p>
          </div>
          <div className="mt-28 max-md:mt-10">
            <Button
              variant={'custom'}
              size={'custom'}
              className="px-16 py-5 font-bold leading-none text-white bg-indigo-500 rounded-xl shadow-[0px_20px_35px_rgba(0,0,0,0.15)] max-md:px-5"
            >
              NẠP NGAY
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CardPromotion
