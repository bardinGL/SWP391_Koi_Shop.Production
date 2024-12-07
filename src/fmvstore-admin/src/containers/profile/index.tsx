'use client'
import { AuthService, UsersService } from '@/client'
import PageTitle from '@/components/shared/PageTitle'
import { toast } from '@/components/ui/use-toast'
import { zodResolver } from '@hookform/resolvers/zod'
import dayjs from 'dayjs'
import React from 'react'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useFetch } from '@/hooks/useFetch'

const formSchema = z
  .object({
    oldPassword: z.string({ description: 'Please enter' }),
    newPassword: z.string({ description: 'Please enter' }),
    confirmPassword: z.string({ description: 'Please enter' }),
  })
  .refine(
    (values) => {
      return values.newPassword === values.confirmPassword
    },
    {
      message: 'Passwords not match.',
      path: ['confirmPassword'],
    },
  )

const ProfileContainer = () => {
  const { data: user } = useFetch(UsersService.usersControllerGetProfile)
  const { run: changePassword } = useFetch(
    AuthService.authControllerChangePassword,
    {
      manual: true,
      onSuccess: () => {
        toast({
          title: 'Success',
          description: 'Password changed successfully',
          variant: 'success',
        })
        router.push('/')
      },
      onError: (error) => {
        console.log('🚀 ~ ProfileContainer ~ error:', error.message)
        if (error.message === 'Bad Request')
          toast({
            title: 'Error',
            description: 'Old password is incorrect',
            variant: 'destructive',
          })
      },
    },
  )
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      oldPassword: undefined,
      newPassword: undefined,
      confirmPassword: undefined,
    },
  })

  const router = useRouter()

  const {
    handleSubmit,
    formState: { errors },
  } = form

  console.log('err', errors)

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values)
    changePassword({
      requestBody: {
        oldPassword: values.oldPassword,
        newPassword: values.newPassword,
      },
    })
  }
  return (
    <section>
      <PageTitle>Profile Page</PageTitle>

      <div className="text-[16px] flex flex-col gap-2">
        <div className="flex gap-2">
          <div className="font-bold">Name:</div>
          <div>{user?.name}</div>
        </div>
        <div className="flex gap-2">
          <div className="font-bold">Email:</div>
          <div>{user?.email}</div>
        </div>

        <div className="flex gap-2">
          <div className="font-bold">Phone Number:</div>
          <div>{user?.phoneNumber}</div>
        </div>

        <div className="flex gap-2">
          <div className="font-bold">Date of birth</div>
          <div>{dayjs(user?.dob).format('DD-MM-YYYY')}</div>
        </div>
      </div>
      <Form {...form}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-8 mb-[120px] mt-12"
        >
          <div className="text-[24px] font-bold">Change Password</div>
          <FormField
            control={form.control}
            name="oldPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Old Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Enter old password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Enter new password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Enter confirm password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex gap-4 pt-6">
            <Button type="submit">Create</Button>
            <Button
              onClick={() => router.push('/staff')}
              variant="secondary"
              type="button"
            >
              Cancel
            </Button>
          </div>
        </form>
      </Form>
    </section>
  )
}

export default ProfileContainer
