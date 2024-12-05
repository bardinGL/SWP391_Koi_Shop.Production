import ForgotPasswordBackground from '@/assets/login-background.png'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Link, useNavigate } from 'react-router-dom'

const ForgotPasswordContainer = () => {
  const navigate = useNavigate()
  return (
    <div className="w-full h-[100vh] bg-[#fff] flex justify-center items-center py-auto">
      <div className="w-[1400px] rounded-tl-none rounded-tr-[30px] rounded-br-[30px] rounded-bl-none border-solid border border-[#dbdbdb] relative flex">
        <div className="w-1/2 flex justify-end">
          <img src={ForgotPasswordBackground} alt="login-background" className="" />
        </div>
        <div className="w-1/2 px-[120px] justify-between flex flex-col pb-4">
          <div>
            <div className="flex items-center shrink-0 flex-nowrap h-[64px] text-[64px] leading-[64px] whitespace-nowrap font-normal">
              <span className="font-['Volkhov'] text-[#389c5a]">F</span>
              <span className="font-['Volkhov'] text-[#fca120]">B</span>
              <span className="font-['Volkhov'] text-[#399c5a]">T</span>
            </div>
            <span className="h-[16px] text-[16px]whitespace-nowrap">Food, Beverages & Treats</span>
          </div>

          <div className="flex flex-col justify-center gap-8">
            <div className="flex flex-col gap-4">
              <Input
                className="border-[#DBDBDB] border-t-0 border-r-0 border-l-0 border-b-2 rounded-none focus-visible:ring-0 h-[52px] text-[16px] leading-[24px] font-normal"
                type="email"
                placeholder="Email"
              />

              <Button variant={'default'} className="h-[52px]">
                Send email to get password
              </Button>
              <div className="flex flex-col w-full">
                <div className="w-full flex justify-center items-center">
                  <span className="text-[16px]">Already have an account?</span>
                  <Button
                    variant={'link'}
                    className="h-[52px] w-fit text-[#5b86e5] px-2"
                    onClick={() => navigate('/login')}
                  >
                    Login
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full flex justify-end">
            <Link to={'/'}>FMV Terms & Codnitions</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ForgotPasswordContainer
