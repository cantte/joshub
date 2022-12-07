import React, { FC } from 'react'
import DefaultLayout from '@components/shared/layout/default'
import RegisterCustomerForm from '@components/customers/form'

const RegisterClientPage: FC = () => {
  return (
    <DefaultLayout>
      <div className="flex flex-col mb-5">
        <div className="flex flex-row justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">
            Registrar cliente
          </h1>
        </div>
      </div>

      <RegisterCustomerForm/>
    </DefaultLayout>
  )
}

export default RegisterClientPage
