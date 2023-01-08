import { FC } from 'react'
import NextLink from 'next/link'

const FooterSection: FC = () => {
  return (
    <footer className='border-t border-slate-200 mt-10'>
      <div
        className='flex flex-col items-center gap-y-4 py-6 md:justify-between lg:flex-row max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='text-md text-center text-slate-500'>
          Creado por{' '}
          <span className='text-slate-600 font-medium hover:text-blue-700 hover:underline'>
            <NextLink href='https://arkews.vercel.app/' target='_blank'>
              Arkews
            </NextLink>
          </span>
        </div>

        <nav className='flex flex-wrap justify-center'>
          <div className='py-2 px-5'>
            <a className='text-sm text-slate-500 hover:text-slate-400'>
              Términos y condiciones
            </a>
          </div>

          <div className='py-2 px-5'>
            <a className='text-sm text-slate-500 hover:text-slate-400'>
              Política de privacidad
            </a>
          </div>
        </nav>

        <p className='text-center text-slate-700 text-xs'>
          © {new Date().getFullYear()} Arkews. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  )
}

export default FooterSection
