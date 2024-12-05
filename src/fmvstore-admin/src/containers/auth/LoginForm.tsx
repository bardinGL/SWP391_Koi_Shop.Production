'use client'

import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { Loader2 } from 'lucide-react'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import Typography from '@/components/ui/typography'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useToast } from '@/components/ui/use-toast'

import FormTemplate from './FormTemplate'
import { loginFields } from './fields'
import { loginFormSchema } from './schemas'
import loginImg from 'public/assets/login.jpg'
import { useFetch } from '@/hooks/useFetch'
import { authService } from '@/services/auth'
import { userService } from '@/services/user'
import { useSetAtom } from 'jotai'
import { userAtom } from '@/stores/user'

type FormData = z.infer<typeof loginFormSchema>

export default function LoginForm() {
  const { toast } = useToast()
  const router = useRouter()
  const setUser = useSetAtom(userAtom)

  const form = useForm<FormData>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  })

  const { run: login, loading } = useFetch(authService.login, {
    manual: true,
    onSuccess: async (res) => {
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
        roles: user.roles,
      })
      toast({
        title: 'Login Success',
        description:
          'You have successfully logged in. Redirecting to the dashboard...',
        variant: 'success',
      })
      window.location.replace('/')
      form.reset()
    },
    onError: (error) => {
      console.error(error)
      if (error.message === 'Bad Request') {
        toast({
          title: 'Login Failed',
          description: 'Invalid email or password.',
          variant: 'destructive',
        })
      }
    },
  })

  const onSubmit = (formData: FormData) => {
    console.log(formData)
    login({
      username: formData.username,
      password: formData.password,
    })
  }

  return (
    <FormTemplate image={loginImg}>
      <div className="w-full">
        <Typography variant="h2" className="mb-8">
          Login
        </Typography>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {loginFields.map((formField) => (
              <FormField
                key={`form-field-${formField.name}`}
                control={form.control}
                name={formField.name}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{formField.label}</FormLabel>
                    <FormControl>
                      <Input
                        type={formField.inputType}
                        placeholder={formField.placeholder}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}

            <Button
              disabled={loading}
              type="submit"
              className="w-full"
              size="lg"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Login
            </Button>
          </form>
        </Form>

        <Separator className="my-12" />

        {/* <Providers /> */}

        {/* <div className="flex flex-wrap justify-end gap-4 w-full">
          <Typography
            variant="a"
            href="/forgot-password"
            className="md:!text-sm"
          >
            Forgot password?
          </Typography>
        </div> */}
      </div>
    </FormTemplate>
  )
}
