import { SubmitHandler, useForm } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import { FC } from 'react'
import axios from 'axios'
import { CustomerInputs } from '@joshub/types/customers'
import toast from 'react-hot-toast'
import Alert from '@components/shared/feedback/alerts'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

const CustomerSchema = z.object({
  id: z.string().min(1, 'El id es requerido'),
  name: z.string().min(1, 'El nombre es requerido')
})

const RegisterCustomerForm: FC = () => {
  const {
    register,
    handleSubmit,
    formState: {
      errors,
      isSubmitting
    },
    reset
  } = useForm<CustomerInputs>({
    resolver: zodResolver(CustomerSchema)
  })

  const saveCustomer = async (data: CustomerInputs): Promise<void> => {
    await axios.post('/api/customers', data)
  }

  const {
    mutate,
    isLoading
  } = useMutation(saveCustomer, {
    onSuccess: () => {
      toast.custom(t => (
        <Alert id={t.id} title="Cliente registrado!" variant="success"/>
      ))
      reset()
    }
  })

  const onSubmit: SubmitHandler<CustomerInputs> = data => {
    mutate(data)
  }

  return (
    <form className="space-y-10" onSubmit={handleSubmit(onSubmit)}>
      <div>
        <div>
          <label className="block">
            <span className="block">Id</span>
            <input
              type="text"
              className="block border text-lg px-4 py-3 mt-2 rounded-lg border-gray-200 focus:bg-white text-gray-900 focus:border-blue-600 focus:ring-0 outline-none w-full  disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
              {...register('id')}
              disabled={isLoading || isSubmitting}
            />
          </label>
          {errors.id != null && (
            <p className="text-sm text-red-600 mt-1">{errors.id.message}</p>
          )}
        </div>

        <div className="mt-6">
          <label className="block">
            <span className="block">Nombre</span>
            <input
              type="text"
              className="block border text-lg px-4 py-3 mt-2 rounded-lg border-gray-200 focus:bg-white text-gray-900 focus:border-blue-600 focus:ring-0 outline-none w-full  disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
              {...register('name')}
              disabled={isLoading || isSubmitting}
            />
          </label>
          {errors.name != null && (
            <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>
          )}
        </div>

        <div className="mt-8">
          <button
            type="submit"
            className="text-base w-full px-6 py-3.5 font-medium text-center text-indigo-900 bg-indigo-100 rounded-full hover:bg-indigo-200 border border-transparent disabled:bg-gray-100 disabled:text-gray-400"
            disabled={isSubmitting || isLoading}
          >
            Guardar
          </button>
        </div>
      </div>
    </form>
  )
}

export default RegisterCustomerForm
