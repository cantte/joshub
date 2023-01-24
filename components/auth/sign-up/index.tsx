import { type FC } from 'react'
import { z } from 'zod'
import { type SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { useRouter } from 'next/router'

const SignUpSchema = z.object({
  email: z.string().email('El email no es válido'),
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
  acceptTerms: z.boolean().refine(v => v, {
    message: 'Debes aceptar los términos y condiciones'
  })
})

type SignUpSchemaType = z.infer<typeof SignUpSchema>

const SignUpForm: FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<SignUpSchemaType>({
    resolver: zodResolver(SignUpSchema)
  })

  const signUp = async (
    data: Omit<SignUpSchemaType, 'acceptTerms'>
  ): Promise<unknown> => {
    const { data: response } = await axios.post('/api/auth/sign-up', data)
    return response
  }

  const router = useRouter()
  const { mutate, isLoading } = useMutation(signUp, {
    onSuccess: () => {
      void router.push('/auth/sign-in')
    }
  })

  const onSubmit: SubmitHandler<SignUpSchemaType> = data => {
    const { email, password } = data
    mutate({ email, password })
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

        <div className='mt-6'>
          <label className='flex items-center'>
            <input
              type='checkbox'
              className='block border text-lg rounded w-6 h-6 border-gray-200 text-blue-600 focus:ring-0 focus:outline-none focus:ring-offset-0 disabled:text-gray-200 disabled:cursor-not-allowed'
              {...register('acceptTerms')}
              disabled={isSubmitting || isLoading}
            />
            <span className='text-sm text-gray-600 block ml-4'>
              Acepto los términos y condiciones de uso.
            </span>
          </label>
          {errors.acceptTerms != null && (
            <p className='text-sm text-red-600 mt-1'>
              {errors.acceptTerms.message}
            </p>
          )}
        </div>

        <div className='mt-8'>
          <button
            type='submit'
            className='text-base w-full px-6 py-3.5 font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 border border-transparent disabled:bg-gray-100 disabled:text-gray-400'
            disabled={isSubmitting || isLoading}
          >
            Crear cuenta
          </button>
        </div>
      </div>
    </form>
  )
}

export default SignUpForm
