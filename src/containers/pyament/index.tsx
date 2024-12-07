import PageLayout from '@/components/common/PageLayout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { formatCurrency } from '@/helper'
import { paymentService } from '@/services/payment'
import { userService } from '@/services/user'
import { userAtom } from '@/stores/user'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useAtomValue } from 'jotai'
import { useEffect, useState } from 'react'
import { useToast } from '@/components/ui/use-toast'


const PaymentContainer = () => {
  const [amount, setAmount] = useState(0)
  const [ipAddr, setIpAddr] = useState('')
  const [link, setLink] = useState('')

  const user = useAtomValue(userAtom)
  const { data: userProfile } = useQuery({
    queryKey: ['getUserProfile', user?.id],
    queryFn: () => userService.me(user?.id!),
  })

  const { mutate: payment } = useMutation({
    mutationFn: ({ amount, ipAddr }: { amount: number; ipAddr: string }) => 
      paymentService.pay({ amount, ipAddr }),
    onSuccess: (paymentUrl) => {
      // Directly redirect to payment URL instead of showing link
      window.location.href = paymentUrl;
    },
    onError: (error) => {
      console.error(error);
      // You may want to show an error toast here
    },
  });

  const handlePayment = () => {
    if (ipAddr && amount > 0) {
      payment({ amount: amount, ipAddr });
    }
  }


  useEffect(() => {
    const getIpAddress = async () => {
      const response = await fetch('https://api.ipify.org?format=json')
      const data = await response.json()
      setIpAddr(data.ip)
    }
    getIpAddress()
  }, [])


  return (
    <PageLayout>
      <div className="flex flex-col items-center w-full">
        <div className="text-3xl font-bold text-center w-full">Nạp tiền vào tài khoản</div>
        <div className="w-2/3 my-12 flex flex-col gap-8">
          <div className="flex items-center justify-between">
            <div className="text-xl">Số dư hiện tại</div>
            <div className="text-xl font-bold">{formatCurrency(userProfile?.result?.balance ?? 0)}</div>
          </div>
          <div className="flex items-center justify-between">
            <div className="text-xl">Địa chỉ IP:</div>
            <div className="text-xl font-bold">{ipAddr}</div>
          </div>
          <div className="flex items-center justify-between">
            <div className="text-xl">Số tiền nạp</div>
            <div className="flex items-center gap-4">
              <Input 
                type="number" 
                value={amount} 
                onChange={(event) => setAmount(Number(event.target.value))} 
              />
              <Button 
                className="bg-[#FF5252] text-white px-4 py-2 rounded-md w-full" 
                onClick={handlePayment}
              >
                Nạp tiền
              </Button>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default PaymentContainer
