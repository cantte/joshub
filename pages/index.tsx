import DefaultLayout from '@components/shared/layout/default'
import HeaderSection from '@components/landing/header'
import { type NextPage } from 'next'
import FeaturesSection from '@components/landing/features'
import CTASection from '@components/landing/cta'
import FooterSection from '@components/landing/footer'

const Home: NextPage = () => {
  return (
    <>
      <DefaultLayout>
        <HeaderSection />
        <FeaturesSection />
        <CTASection />
      </DefaultLayout>
      <FooterSection />
    </>
  )
}

export default Home
