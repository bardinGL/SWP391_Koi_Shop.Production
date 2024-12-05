import PageLayout from '@/components/common/PageLayout'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import { userService } from '@/services/user'
import { useAtom } from 'jotai'
import { userAtom } from '@/stores/user'
import { useEffect } from 'react'
import { Flip, toast } from 'react-toastify'

const formSchema = z.object({
  firstName: z.string().max(20),
  lastName: z.string().max(20),
  email: z.string().email(),
  number: z.string().min(5, 'Please enter valid number').max(10, 'Please enter valid number'),
  address: z.string().max(20),
})

const AccountPageContainer = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      number: '',
      address: '',
    },
  })

  const [user, setUser] = useAtom(userAtom)

  useEffect(() => {
    form.setValue('firstName', user?.firstName ?? '')
    form.setValue('lastName', user?.lastName ?? '')
    form.setValue('email', user?.email ?? '')
    form.setValue('number', user?.number.toString() ?? '')
    form.setValue('address', user?.address ?? '')
  }, [user])

  const { mutate: updateUser } = useMutation({
    mutationFn: (data: any) => userService.update(data),
    onSuccess: () => {
      // handle success
      toast.success('Update user successfully!', {
        position: 'top-center',
        closeOnClick: true,
        theme: 'light',
        transition: Flip,
        hideProgressBar: true,
      })

      const userData = form.getValues()
      console.log('🚀 ~ AccountPageContainer ~ user:', userData)
      setUser({
        ...userData,
        id: user?.id!,
        username: user?.username!,
        number: parseInt(userData.number),
      })
    },
    onError: (error) => {
      // handle error
      console.error(error)
      toast.error('Update failed!', {
        position: 'top-center',
        closeOnClick: true,
        theme: 'light',
        transition: Flip,
        hideProgressBar: true,
      })
    },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    updateUser({
      ...values,
      id: user?.id!,
      number: parseInt(values?.number!),
    })
  }
  return (
    <PageLayout>
      <div className="flex flex-col items-center">
        <div className="text-3xl font-bold mb-12">Update user information</div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4 w-full">
            <div className="grid grid-cols-1 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xl">First Name</FormLabel>
                    <FormControl>
                      <Input
                        className="border-[#DBDBDB] border-t-0 border-r-0 border-l-0 border-b-2 rounded-none focus-visible:ring-0 h-[52px] text-[16px] leading-[24px] font-normal"
                        placeholder="First Name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xl">Last Name</FormLabel>
                    <FormControl>
                      <Input
                        className="border-[#DBDBDB] border-t-0 border-r-0 border-l-0 border-b-2 rounded-none focus-visible:ring-0 h-[52px] text-[16px] leading-[24px] font-normal"
                        placeholder="Last Name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xl">Email Address</FormLabel>
                    <FormControl>
                      <Input
                        className="border-[#DBDBDB] border-t-0 border-r-0 border-l-0 border-b-2 rounded-none focus-visible:ring-0 h-[52px] text-[16px] leading-[24px] font-normal"
                        placeholder="Email Address"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xl">Phone Number</FormLabel>
                    <FormControl>
                      <Input
                        className="border-[#DBDBDB] border-t-0 border-r-0 border-l-0 border-b-2 rounded-none focus-visible:ring-0 h-[52px] text-[16px] leading-[24px] font-normal"
                        placeholder="Phone Number"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xl">Address</FormLabel>
                    <FormControl>
                      <Input
                        className="border-[#DBDBDB] border-t-0 border-r-0 border-l-0 border-b-2 rounded-none focus-visible:ring-0 h-[52px] text-[16px] leading-[24px] font-normal"
                        placeholder="Address"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-col w-full mt-6 mb-24 justify-center items-center">
              <Button type="submit" variant={'default'} className="h-[52px] w-fit px-12">
                Update Account
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </PageLayout>
  )
}

export default AccountPageContainer
