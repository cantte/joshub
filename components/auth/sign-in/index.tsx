import { FC } from 'react'
import { z } from 'zod'
import { SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { useRouter } from 'next/router'

const SignInSchema = z.object({
  email: z.string().email('El email no es válido'),
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres')
})

type SignInSchemaType = z.infer<typeof SignInSchema>

const SignInForm: FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<SignInSchemaType>({
    resolver: zodResolver(SignInSchema)
  })

  const signIn = async (data: SignInSchemaType): Promise<unknown> => {
    const { data: response } = await axios.post('/api/auth/sign-in', data)
    return response
  }

  const router = useRouter()
  const { mutate, isLoading } = useMutation(signIn, {
    onSuccess: () => {
      void router.replace('/auth/session/check').then(() => router.reload())
    }
  })

  const onSubmit: SubmitHandler<SignInSchemaType> = data => {
    mutate(data)
  }

  return (
    <form className='space-y-10' onSubmit={handleSubmit(onSubmit)}>
      <div>
        <div>
          <label className='block'>
            <span className='block'>Email</span>
            <input
              type='text'
              className='block border text-lg px-4 py-3 mt-2 rounded-lg border-gray-200 focus:bg-white text-gray-900 focus:border-blue-600 focus:ring-0 outline-none w-full  disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed'
              {...register('email')}
              disabled={isSubmitting || isLoading}
            />
          </label>
          {errors.email != null && (
            <p className='text-sm text-red-600 mt-1'>{errors.email.message}</p>
          )}
        </div>

        <div className='mt-6'>
          <label className='block'>
            <span className='block'>Contraseña</span>
            <input
              type='password'
              className='block border text-lg px-4 py-3 mt-2 rounded-lg border-gray-200 focus:bg-white text-gray-900 focus:border-blue-600 focus:ring-0 outline-none w-full  disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed'
              {...register('password')}
              disabled={isSubmitting || isLoading}
            />
          </label>
          {errors.password != null && (
            <p className='text-sm text-red-600 mt-1'>
              {errors.password.message}
            </p>
          )}
        </div>

        <div className='mt-8'>
          <button
            type='submit'
            className='text-base w-full px-6 py-3.5 font-medium text-center text-indigo-900 bg-indigo-100 rounded-full hover:bg-indigo-200 border border-transparent disabled:bg-gray-100 disabled:text-gray-400'
            disabled={isSubmitting || isLoading}
          >
            Iniciar sesión
          </button>
        </div>
      </div>
    </form>
  )
}

export default SignInForm
