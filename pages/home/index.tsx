import React from 'react'
import { NextPage } from 'next'
import DefaultLayout from '@components/shared/layout/default'
import HeaderSection from '@components/landing/header'

const HomePage: NextPage = () => {
  return (
    <DefaultLayout>
      <HeaderSection />
    </DefaultLayout>
  )
}

export default HomePage
