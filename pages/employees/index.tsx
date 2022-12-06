import React, { FC } from 'react'
import EmployeesTable from '@components/employees/table'
import DefaultLayout from '@components/shared/layout/default'

const EmployeesPage: FC = () => {
  return (
    <DefaultLayout>
      <EmployeesTable/>
    </DefaultLayout>
  )
}

export default EmployeesPage
