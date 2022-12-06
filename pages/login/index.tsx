import React, { FC } from 'react'
import DefaultLayout from '@components/shared/layout/default'
import Login from '@components/users/login'

const LoginPage: FC = () => {
  return (
    <DefaultLayout>
      <Login/>
    </DefaultLayout>
  )
}

export default LoginPage
