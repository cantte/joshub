import { SubmitHandler, useForm } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { PubInputs } from '@joshub/types/pubs'
import { useRouter } from 'next/router'
import { FC, useEffect } from 'react'
import { useUser } from '@supabase/auth-helpers-react'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

const PubSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  address: z.string().min(1, 'La dirección es requerida'),
  user_id: z.string().min(1, 'El dueño es requerido'),
  owner: z.object({
    id: z.string().min(1, 'La identificación es requerida'),
    name: z.string().min(1, 'El nombre es requerido'),
    phone: z.string().min(1, 'El teléfono es requerido'),
    salary: z.coerce.number().min(1, 'El salario es requerido')
  })
})

const RegisterPubForm: FC = () => {
  const user = useUser()
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<PubInputs>({
    resolver: zodResolver(PubSchema),
    defaultValues: {
      user_id: user?.id,
      nit: undefined
    }
  })

  useEffect(() => {
    if (user !== undefined && user !== null) {
      setValue('user_id', user.id)
    }
  }, [user])

  const savePub = async (data: PubInputs): Promise<void> => {
    await axios.post('/api/pubs', data)
  }

  const router = useRouter()
  const { mutate, isLoading } = useMutation(savePub, {
    onSuccess: () => {
      void router.push('/dashboard')
    }
  })

  const onSubmit: SubmitHandler<PubInputs> = data => {
    data.nit = data.nit?.trim() === '' ? undefined : data.nit

    mutate(data)
  }

  return (
    <form className='space-y-10' onSubmit={handleSubmit(onSubmit)}>
      <div>
        <div className='grid grid-cols-6 gap-6'>
          <div className='col-span-6 sm:col-span-3'>
            <h3 className='text-2xl text-gray-900 mb-3'>Bar</h3>

            <div>
              <label className='block'>
                <span className='block'>Nombre</span>
                <input
                  type='text'
                  className='block border text-lg px-4 py-3 mt-2 rounded-lg border-gray-200 focus:bg-white text-gray-900 focus:border-blue-600 focus:ring-0 outline-none w-full  disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed'
                  {...register('name')}
                  disabled={isSubmitting || isLoading}
                />
              </label>
              {errors.name != null && (
                <p className='text-sm text-red-600 mt-1'>
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className='mt-6'>
              <label className='block'>
                <span className='block'>Nit</span>
                <input
                  type='text'
                  className='block border text-lg px-4 py-3 mt-2 rounded-lg border-gray-200 focus:bg-white text-gray-900 focus:border-blue-600 focus:ring-0 outline-none w-full  disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed'
                  {...register('nit')}
                  disabled={isSubmitting || isLoading}
                />
              </label>
              {errors.nit != null && (
                <p className='text-sm text-red-600 mt-1'>
                  {errors.nit.message}
                </p>
              )}
            </div>

            <div className='mt-6'>
              <label className='block'>
                <span className='block'>Dirección</span>
                <input
                  type='text'
                  className='block border text-lg px-4 py-3 mt-2 rounded-lg border-gray-200 focus:bg-white text-gray-900 focus:border-blue-600 focus:ring-0 outline-none w-full  disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed'
                  {...register('address')}
                  disabled={isSubmitting || isLoading}
                />
              </label>
              {errors.address != null && (
                <p className='text-sm text-red-600 mt-1'>
                  {errors.address.message}
                </p>
              )}
            </div>
          </div>

          <div className='col-span-6 sm:col-span-3'>
            <h3 className='text-2xl text-gray-900 mb-3'>Propietario</h3>

            <div>
              <label className='block'>
                <span className='block'>Identificación del propietario</span>
                <input
                  type='text'
                  className='block border text-lg px-4 py-3 mt-2 rounded-lg border-gray-200 focus:bg-white text-gray-900 focus:border-blue-600 focus:ring-0 outline-none w-full  disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed'
                  {...register('owner.id')}
                  disabled={isSubmitting || isLoading}
                />
              </label>
              {errors.owner?.id != null && (
                <p className='text-sm text-red-600 mt-1'>
                  {errors.owner.id.message}
                </p>
              )}
            </div>

            <div className='mt-6'>
              <label className='block'>
                <span className='block'>Nombre del propietario</span>
                <input
                  type='text'
                  className='block border text-lg px-4 py-3 mt-2 rounded-lg border-gray-200 focus:bg-white text-gray-900 focus:border-blue-600 focus:ring-0 outline-none w-full  disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed'
                  {...register('owner.name')}
                  disabled={isSubmitting || isLoading}
                />
              </label>
              {errors.owner?.name != null && (
                <p className='text-sm text-red-600 mt-1'>
                  {errors.owner.name.message}
                </p>
              )}
            </div>

            <div className='mt-6'>
              <label className='block'>
                <span className='block'>Teléfono del propietario</span>
                <input
                  type='text'
                  className='block border text-lg px-4 py-3 mt-2 rounded-lg border-gray-200 focus:bg-white text-gray-900 focus:border-blue-600 focus:ring-0 outline-none w-full  disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed'
                  {...register('owner.phone')}
                  disabled={isSubmitting || isLoading}
                />
              </label>
              {errors.owner?.phone != null && (
                <p className='text-sm text-red-600 mt-1'>
                  {errors.owner.phone.message}
                </p>
              )}
            </div>

            <div className='mt-6'>
              <label className='block'>
                <span className='block'>Salario del propietario</span>
                <input
                  type='text'
                  className='block border text-lg px-4 py-3 mt-2 rounded-lg border-gray-200 focus:bg-white text-gray-900 focus:border-blue-600 focus:ring-0 outline-none w-full  disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed'
                  {...register('owner.salary')}
                  disabled={isSubmitting || isLoading}
                />
              </label>
              {errors.owner?.salary != null && (
                <p className='text-sm text-red-600 mt-1'>
                  {errors.owner.salary.message}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className='mt-8'>
          <button
            type='submit'
            className='text-base w-full px-6 py-3.5 font-medium text-center text-indigo-900 bg-indigo-100 rounded-full hover:bg-indigo-200 border border-transparent disabled:bg-gray-100 disabled:text-gray-400'
            disabled={isSubmitting || isLoading}
          >
            Registrar
          </button>
        </div>
      </div>
    </form>
  )
}

export default RegisterPubForm
