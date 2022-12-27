import DefaultLayout from '@components/shared/layout/default'
import HeaderSection from '@components/landing/header'
import { NextPage } from 'next'

const Home: NextPage = () => {
  return (
    <DefaultLayout>
      <HeaderSection />
    </DefaultLayout>
  )
}

export default Home
