import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { SigninValidation } from '@/lib/validation'
import { z } from 'zod'
import Loader from '@/components/shared/Loader'
import { Link, useNavigate } from 'react-router-dom'
import { useToast } from '@/components/ui/use-toast'
import { useSignInAccount } from '@/lib/queries'
import { useUserContext } from '@/components/context/AuthContext'

const SigninForm = () => {
  const { toast } = useToast()
  const { checkAuthUser, isLoading: isUserLoading } = useUserContext()
  const navigate = useNavigate()

  const { mutateAsync: signInAccount, isPending: isSigningIn } =
    useSignInAccount()

  const form = useForm<z.infer<typeof SigninValidation>>({
    resolver: zodResolver(SigninValidation),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  async function onSubmit(values: z.infer<typeof SigninValidation>) {
    const [session, error] = await signInAccount({
      email: values.email,
      password: values.password,
    })

    if (error) {
      const { message } = error as Error
      toast({
        title: message,
      })
      return
    }

    const isLoggedIn = await checkAuthUser()

    if (isLoggedIn) {
      form.reset()
      navigate('/')
    } else {
      toast({
        title: 'Sign in failed. Please try again.',
      })

      return
    }
  }

  return (
    <Form {...form}>
      <div className="sm:w-420 flex-center flex-col">
        <h1 className="text-4xl font-bold">SnapBook</h1>
        <h2 className="h3-bold md:h2-bold pt-5 sm:pt-12">
          Sign in to your account
        </h2>
        <p className="text-light-3 small-medium md:base-regular mt-2">
          Welcome back! Please enter your details.
        </p>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-5 w-full mt-4"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    className="shad-input"
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
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    className="shad-input"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="shad-button_primary"
          >
            {isUserLoading || isSigningIn ? (
              <div className="flex-center gap-2">
                <Loader /> Loading...
              </div>
            ) : (
              'Sign In'
            )}
          </Button>
          <p className="small-semibold text-light-2 mt-2 text-center">
            Dont have an account?
            <Link
              to="/sign-up"
              className="text-primary-500 ml-1 small-regular"
            >
              Sign up!
            </Link>
          </p>
        </form>
      </div>
    </Form>
  )
}

export default SigninForm
