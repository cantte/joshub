import { type FC, type ReactNode } from 'react'
import FeatureCard from '@components/landing/features/card'
import {
  CalculatorIcon,
  ChartPieIcon,
  CubeIcon,
  UsersIcon
} from '@heroicons/react/24/outline'

interface Feature {
  title: string
  description: string
  icon?: ReactNode
}

type Features = Feature[]

const features: Features = [
  {
    title: 'Manten un control de tu inventario',
    description:
      'Mantén un inventario preciso, realiza seguimiento de tus ventas y costos en tiempo real y toma decisiones informadas para mejorar el rendimiento de tu negocio.',
    icon: <CubeIcon className='h-7 w-7 text-white' />
  },
  {
    title: 'Administra tus empleados',
    description:
      'Administra tus empleados, sus ventas. Conoce el rendimiento de cada uno de ellos.',
    icon: <UsersIcon className='h-7 w-7 text-white' />
  },
  {
    title: 'Realiza seguimiento de tus ventas',
    description:
      'Realiza seguimiento de tus ventas, costos y gastos en tiempo real y toma decisiones informadas para mejorar el rendimiento de tu negocio.',
    icon: <CalculatorIcon className='h-7 w-7 text-white' />
  },
  {
    title: 'Reportes estadísticos',
    description: 'Obtén reportes estadísticos de tus ventas, costos y gastos.',
    icon: <ChartPieIcon className='h-7 w-7 text-white' />
  }
]

const FeaturesSection: FC = () => {
  return (
    <>
      <div id='features' className='py-24 sm:py-32 lg:py-40'>
        <div className='mx-auto max-w-7xl px-6 lg:px-8'>
          <div className='sm:text-center'>
            <h2 className='text-lg font-semibold leading-8 text-blue-700'>
              Caracteristicas
            </h2>
            <p className='mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl'>
              Mira que tenemos para ti
            </p>
            <p className='mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-600'>
              Obtén una visión general de las características que tenemos para
              ti.
            </p>
          </div>

          <div className='mt-20 max-w-lg sm:mx-auto md:max-w-none'>
            <div className='grid grid-cols-1 gap-y-16 md:grid-cols-2 md:gap-x-12 md:gap-y-16'>
              {features.map((feature, index) => (
                <FeatureCard
                  key={index}
                  title={feature.title}
                  description={feature.description}
                  icon={feature.icon}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default FeaturesSection
