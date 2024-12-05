import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const Subscription = () => {
  return (
    <div className="w-full h-[900px] bg-[url('assets/bg-input.png')] flex justify-center items-center">
      <div className="w-[786px] h-[404px] bg-[#FCA120] rounded-lg flex flex-col items-center justify-between p-10 text-[#FFFFFF]">
        <div className="text-[40px] font-bold">Đăng ký nhận thông tin mới nhất</div>
        <div className="text-center px-12">
          Không quá khi nói bạn có thể làm một food tour vòng quanh thế giới chỉ với một vòng "lướt" trên thực đơn tại
          quầy đồ ăn của FMV.
        </div>
        <Input placeholder="yourmail@gmail.com" className="h-[64px] text-[24px] text-[#000000] bg-[#FFFFFF]" />
        <Button variant={'custom'} size={'custom'} className="bg-[#FF4343]">
          Đăng Ký Ngay
        </Button>
      </div>
    </div>
  )
}

export default Subscription
