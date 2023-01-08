import { FC } from 'react'
import NextLink from 'next/link'

const CTASection: FC = () => {
  return (
    <div className='bg-pink-50 rounded-lg'>
      <div
        className='mx-auto max-w-7xl py-12 px-6 lg:flex lg:items-center lg:justify-between lg:py-16 lg:px-8'>
        <h2
          className='text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl'>
          <span className='block text-gray-700'>
            ¿Listo para comenzar?
          </span>
          <span className='block text-pink-700'>
            Comienza hoy la administración de tu bar.
          </span>
        </h2>

        <div className='mt-8 lg:flex lg:mt-0 lg:flex-shrink-0'>
          <div className='lg:inline-flex rounded-md shadow'>
            <NextLink href='/auth/sign-up'
                      className='inline-flex w-full items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-pink-700 hover:bg-pink-800'>
              Comenzar ahora
              <span className='text-white ml-2' aria-hidden='true'>
                  &rarr;
                </span>
            </NextLink>
          </div>

          <div
            className='mt-3 rounded-md shadow lg:ml-3 lg:mt-0 lg:inline-flex'>
            <NextLink href='#features'
                      className='inline-flex w-full items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-pink-700 bg-white hover:bg-gray-50'>
              Leer más
            </NextLink>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CTASection
