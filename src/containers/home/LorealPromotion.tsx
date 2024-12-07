import React from 'react'
import { Button } from '@/components/ui/button'
import LorealProduct1 from '@/assets/loreal-product1.png'
import LorealProduct2 from '@/assets/loreal-product2.png'
import LorealProduct3 from '@/assets/loreal-product3.png'

const timeUnits = [
  { value: '21', label: 'Days' },
  { value: '05', label: 'Hr' },
  { value: '20', label: 'Mins' },
  { value: '03', label: 'Sec' },
]

const LorealPromotion: React.FC = () => {
  return (
    <div className="flex flex-col w-full items-center pt-24 bg-[#F5F5F5]">
      <div className="flex w-[1280px]">
        <div className="flex flex-col text-sm rounded-xl max-w-[478px]">
          <header className="w-full text-4xl uppercase text-zinc-700">Khuyến mại L'Oréal</header>
          <p className="mt-6 leading-7 text-zinc-500">
            L'Oréal S.A. là tập đoàn chuyên về các sản phẩm chăm sóc cá nhân của Pháp - tập đoàn số một thế giới trong
            ngành mỹ phẩm, tập trung vào các sản phẩm nhuộm tóc, dưỡng da, chống nắng, trang điểm, nước hoa và chăm sóc
            tóc.
          </p>
          <Button
            variant={'custom'}
            size={'custom'}
            className="self-start px-16 py-5 mt-3.5 font-semibold leading-none text-center text-white bg-red-500 rounded-xl shadow-[0px_20px_35px_rgba(0,0,0,0.15)]"
            aria-label="Mua ngay"
          >
            MUA NGAY
          </Button>
          <div className="flex flex-col rounded-xl max-w-[394px] text-zinc-700 mt-12">
            <h2 className="self-start text-3xl font-medium">Nhanh chân đến FMV nào!!!</h2>
            <div className="flex gap-8 mt-6 whitespace-nowrap">
              {timeUnits.map((unit, index) => (
                <div key={index} className="flex flex-col flex-1">
                  <div className="px-3 text-3xl leading-none bg-white rounded-xl shadow-sm h-[76px] w-[76px] flex justify-center items-center">
                    {unit.value}
                  </div>
                  <div className="self-center mt-4 text-2xl leading-tight text-center">{unit.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex">
          <img src={LorealProduct1} alt="loreal-product-1" className="w-full h-[400px] object-cover mt-6 rounded-xl" />
          <img src={LorealProduct2} alt="loreal-product-2" className="w-full h-[400px] object-cover mt-6 rounded-xl" />
          <img src={LorealProduct3} alt="loreal-product-3" className="w-full h-[400px] object-cover mt-6 rounded-xl" />
        </div>
      </div>
      <div className="bg-gradient-to-b from-[#F5F5F5] to-[#FCA120] h-[120px] w-full" />
    </div>
  )
}

export default LorealPromotion
