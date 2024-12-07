'use client'
import PageTitle from '@/components/shared/PageTitle'
import { zodResolver } from '@hookform/resolvers/zod'
import React from 'react'
import { z } from 'zod'
import { toast } from '@/components/ui/use-toast'
import { useRouter } from 'next/navigation'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useForm } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { GenderEnum, UsersService } from '@/client'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { format } from 'date-fns'
import { PHONE_REGEX } from '@/constants'
import { useFetch } from '@/hooks/useFetch'

const formSchema = z
  .object({
    name: z.string({ description: 'Please enter' }),
    email: z
      .string({ description: 'Please enter' })
      .email('Please enter a valid email'),
    password: z.string({ description: 'Please enter' }),
    confirmPassword: z.string({ description: 'Please enter' }),
    phoneNumber: z
      .string({ description: 'Please enter' })
      .regex(PHONE_REGEX, 'Please enter a valid phone number'),
    gender: z.string({ description: 'Please enter' }),
    dob: z.date({ description: 'Please enter' }),
  })
  .refine(
    (values) => {
      return values.password === values.confirmPassword
    },
    {
      message: 'Passwords not match.',
      path: ['confirmPassword'],
    },
  )

const CreateStaffContainer = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: undefined,
      email: undefined,
      password: undefined,
      confirmPassword: undefined,
      phoneNumber: undefined,
      gender: undefined,
      dob: undefined,
    },
  })

  const router = useRouter()

  const {
    handleSubmit,
    formState: { errors },
  } = form

  const { run: createStaff } = useFetch(
    UsersService.usersControllerCreateStaff,
    {
      manual: true,
      onSuccess: () => {
        toast({
          title: 'Staff created successfully',
          variant: 'success',
        })
        router.push('/staff')
      },
      onError: (error) => {
        toast({
          title: 'Failed to create staff',
          description: 'Email already exists',
          variant: 'destructive',
        })
      },
    },
  )

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    createStaff({
      requestBody: {
        name: values.name,
        email: values.email,
        password: values.password,
        phoneNumber: values.phoneNumber,
        gender: values.gender as GenderEnum,
        dob: values.dob.toISOString(),
      },
    })
  }

  // convert enum to array
  const genderEnum = Object.values(GenderEnum)
  return (
    <section>
      <PageTitle>Create Staff</PageTitle>

      <Form {...form}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-8 mb-[120px]"
        >
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter staff name" {...field} />
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
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter password"
                      {...field}
                      type="password"
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
                      placeholder="Enter confirm password"
                      {...field}
                      type="password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone number</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter phone number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gender</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={(value: string) => {
                        field.onChange(value)
                      }}
                    >
                      <SelectTrigger className="capitalize">
                        <SelectValue placeholder="Enter gender" />
                      </SelectTrigger>

                      <SelectContent>
                        {genderEnum.map((gender) => (
                          <SelectItem
                            value={gender}
                            key={gender}
                            className="capitalize"
                          >
                            {gender}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dob"
              render={({ field }) => (
                <FormItem className="flex flex-col mt-2">
                  <FormLabel>Date of birth</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={'outline'}
                          // className={cn(
                          //   'w-[240px] pl-3 text-left font-normal',
                          //   !field.value && 'text-muted-foreground',
                          // )}
                        >
                          {field.value ? (
                            format(field.value, 'PPP')
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date('1900-01-01')
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
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

export default CreateStaffContainer
