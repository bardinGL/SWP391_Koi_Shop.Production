import LoginBackground from '@/assets/login-background.png'
import GoogleIcon from '@/assets/google.svg'
import GmailIcon from '@/assets/gmail.svg'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/ui/password-input'
import { Link, useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { authService } from '@/services/auth'
import { Flip, toast } from 'react-toastify'
import { useSetAtom } from 'jotai'
import { userAtom } from '@/stores/user'
import { userService } from '@/services/user'

const formSchema = z.object({
  username: z.string().min(3).max(20),
  password: z.string().min(3).max(20),
})

const LoginContainer = () => {
  const navigate = useNavigate()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  })

  const setUser = useSetAtom(userAtom)

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      console.log(values)
      const res = await authService.login(values)
      const { token, uid } = res.result
      localStorage.setItem('access_token', token)
      const userResponse = await userService.me(uid, token)
      const user = userResponse.result
      console.log('🚀 ~ onSubmit ~ user:', user)
      setUser({
        id: user.id,
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        address: user.address,
        number: user.number,
      })
      toast.success('Login successfully!', {
        position: 'top-center',
        closeOnClick: true,
        theme: 'light',
        transition: Flip,
        hideProgressBar: true,
      })
      navigate('/')
    } catch (error) {
      console.error(error)
      toast.error('Login failed!', {
        position: 'top-center',
        closeOnClick: true,
        theme: 'light',
        transition: Flip,
        hideProgressBar: true,
      })
    }
  }
  return (
    <div className="w-full h-[100vh] bg-[#fff] flex justify-center items-center py-auto">
      <div className="w-[1400px] rounded-tl-none rounded-tr-[30px] rounded-br-[30px] rounded-bl-none border-solid border border-[#dbdbdb] relative flex">
        <div className="w-1/2 flex justify-end">
          <img src={LoginBackground} alt="login-background" className="" />
        </div>
        <div className="w-1/2 px-[120px] justify-between flex flex-col pb-4">
          <div>
            <div className="flex items-center shrink-0 flex-nowrap h-[64px] text-[64px] leading-[64px] whitespace-nowrap font-normal">
              <span className="font-['Volkhov'] text-[#389c5a]">F</span>
              <span className="font-['Volkhov'] text-[#fca120]">M</span>
              <span className="font-['Volkhov'] text-[#399c5a]">V</span>
            </div>
            <span className="h-[16px] text-[16px]whitespace-nowrap">Food, Beverages & Treats</span>
          </div>

          <div className="flex flex-col justify-center gap-8">
            <div className="flex flex-col gap-6">
              <span className="h-[40px] text-[30px] leading-[40px]">Sign In To FMV</span>
              <div className="flex gap-4">
                <Button variant={'outline'} className="px-6 flex gap-2 h-[52px]">
                  <img src={GoogleIcon} alt="gmail-icon" className="" />
                  <span className="text-[#000000]">Sign up with Google</span>
                </Button>
                <Button variant={'outline'} className="px-6 flex gap-2 h-[52px]">
                  <img src={GmailIcon} alt="gmail-icon" className="" />
                  <span className="text-[#000000]">Sign up with Email</span>
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3">
              <div className="w-[30px] h-[5px] bg-[#828282]" />
              <span className="text-[30px] font-bold leading-[40px] text-[#828282] tracking-[2.4px]">OR</span>
              <div className="w-[30px] h-[5px] bg-[#828282]" />
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          className="border-[#DBDBDB] border-t-0 border-r-0 border-l-0 border-b-2 rounded-none focus-visible:ring-0 h-[52px] text-[16px] leading-[24px] font-normal"
                          placeholder="Username"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <PasswordInput
                          className="border-[#DBDBDB] border-t-0 border-r-0 border-l-0 border-b-2 rounded-none focus-visible:ring-0 h-[52px] text-[16px] leading-[24px] font-normal"
                          placeholder="Password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" variant={'default'} className="h-[52px]">
                  Sign In
                </Button>
                <Button variant={'outline'} className="h-[52px]" onClick={() => navigate('/register')}>
                  Register Now
                </Button>
                <div className="w-full flex justify-end text-[">
                  <Button
                    onClick={() => navigate('/forgot-password')}
                    variant={'link'}
                    className="h-[52px] w-fit text-[#5b86e5]"
                  >
                    Forgot Password?
                  </Button>
                </div>
              </form>
            </Form>

            {/* <div className="flex flex-col gap-4">
              <Button onClick={() => navigate('/')} variant={'default'} className="h-[52px]">
                Sign In
              </Button>
              <Button variant={'outline'} className="h-[52px]" onClick={() => navigate('/register')}>
                Register Now
              </Button>
              <div className="w-full flex justify-end text-[">
                <Button
                  onClick={() => navigate('/forgot-password')}
                  variant={'link'}
                  className="h-[52px] w-fit text-[#5b86e5]"
                >
                  Forgot Password?
                </Button>
              </div>
            </div> */}
          </div>

          <div className="w-full flex justify-end">
            <Link to={'/'}>FMV Terms & Codnitions</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginContainer
