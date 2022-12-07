import { FC } from 'react'
import DefaultLayout from '@components/shared/layout/default'
import RegisterSaleForm from '@components/sales/form'

const RegisterSalePage: FC = () => {
  return (
    <DefaultLayout>
      <div className="flex flex-col mb-5">
        <div className="flex flex-row justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">
            Registrar venta
          </h1>
        </div>
      </div>

      <RegisterSaleForm/>
    </DefaultLayout>
  )
}

export default RegisterSalePage
