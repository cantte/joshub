import React, { FC, Fragment } from 'react'
import { Popover, Transition } from '@headlessui/react'
import {
  Bars3Icon,
  ChevronDownIcon,
  QrCodeIcon,
  UserGroupIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import NextLink from 'next/link'
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react'
import { useRouter } from 'next/router'

const navigation = [
  { name: 'Registrar venta', href: '/sales/register' },
  { name: 'Registrar domicilio', href: '/orders/register' },
  { name: 'Registrar cliente', href: '/customers/register' }
]

const storeNavigation = [
  {
    name: 'Empleados',
    href: '/employees',
    description: 'Administrar empleados',
    icon: UserGroupIcon
  },
  {
    name: 'Productos',
    href: '/products',
    description: 'Administrar productos',
    icon: QrCodeIcon
  }
]

const mobileNavigation = [
  { name: 'Registrar venta', href: '/sales/register' },
  { name: 'Registrar domicilio', href: '/orders/register' },
  { name: 'Registrar cliente', href: '/customers/register' },
  { name: 'Empleados', href: '/employees' },
  { name: 'Productos', href: '/products' }
]

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function classNames (...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

const Navbar: FC = () => {
  const session = useSession()
  const supabase = useSupabaseClient()

  const router = useRouter()
  const handleLogout = async (): Promise<void> => {
    await supabase.auth.signOut()
    await router.push('/login')
  }

  return (
    <Popover className='relative bg-white'>
      <div className='mx-auto w-full'>
        <div className='flex items-center justify-between border-b-2 border-gray-100 py-6 md:justify-start md:space-x-10 px-4 sm:px-6'>
          <div className='flex justify-start lg:w-0 lg:flex-1'>
            <NextLink href='/' className='-m-1.5 p-1.5'>
              <span className='text-2xl'>Joshub</span>
            </NextLink>
          </div>

          <div className='-my-2 -mr-2 md:hidden'>
            <Popover.Button className='inline-flex items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none'>
              <span className='sr-only'>Open menu</span>
              <Bars3Icon className='h-6 w-6' aria-hidden='true' />
            </Popover.Button>
          </div>

          <Popover.Group as='nav' className='hidden space-x-10 md:flex'>
            {session != null && (
              <>
                <Popover className='relative'>
                  {({ open }) => (
                    <>
                      <Popover.Button
                        className={classNames(
                          open ? 'text-gray-900' : 'text-gray-500',
                          'group inline-flex items-center rounded-md bg-white text-base hover:text-gray-900 focus:outline-none'
                        )}
                      >
                        <span>Tienda</span>
                        <ChevronDownIcon
                          className={classNames(
                            open ? 'text-gray-600' : 'text-gray-400',
                            'ml-2 h-5 w-5 group-hover:text-gray-500'
                          )}
                          aria-hidden='true'
                        />
                      </Popover.Button>

                      <Transition
                        as={Fragment}
                        enter='transition ease-out duration-200'
                        enterFrom='opacity-0 translate-y-1'
                        enterTo='opacity-100 translate-y-0'
                        leave='transition ease-in duration-150'
                        leaveFrom='opacity-100 translate-y-0'
                        leaveTo='opacity-0 translate-y-1'
                      >
                        <Popover.Panel className='absolute z-10 -ml-4 mt-3 w-screen max-w-md transform px-2 sm:px-0 lg:left-1/2 lg:ml-0 lg:-translate-x-1/2'>
                          <div className='overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5'>
                            <div className='relative grid gap-6 bg-white px-5 py-6 sm:gap-8 sm:p-8'>
                              {storeNavigation.map(item => (
                                <NextLink
                                  key={item.name}
                                  href={item.href}
                                  className='-m-3 flex items-start rounded-lg p-3 hover:bg-gray-50'
                                >
                                  <item.icon
                                    className='h-6 w-6 flex-shrink-0 text-indigo-700'
                                    aria-hidden='true'
                                  />
                                  <div className='ml-4'>
                                    <p className='text-base text-gray-900'>
                                      {item.name}
                                    </p>
                                    <p className='mt-1 text-sm text-gray-500'>
                                      {item.description}
                                    </p>
                                  </div>
                                </NextLink>
                              ))}
                            </div>
                          </div>
                        </Popover.Panel>
                      </Transition>
                    </>
                  )}
                </Popover>

                <div className='hidden lg:flex lg:min-w-0 lg:justify-center space-x-10'>
                  {navigation.map(item => (
                    <NextLink
                      key={item.name}
                      href={item.href}
                      className='text-gray-500 inline-flex items-center rounded-md bg-white text-base hover:text-gray-900'
                    >
                      {item.name}
                    </NextLink>
                  ))}
                </div>
              </>
            )}
          </Popover.Group>

          <div className='hidden items-center justify-end md:flex md:flex-1 lg:w-0'>
            {session === null && (
              <NextLink
                href='/login'
                className='inline-block rounded-lg px-3 py-1.5 text-sm font-semibold leading-6 text-gray-900 shadow-sm ring-1 ring-gray-900/10 hover:ring-gray-900/20'
              >
                Iniciar sesión
              </NextLink>
            )}

            {session !== null && (
              <button
                type='button'
                onClick={handleLogout}
                className='inline-block rounded-lg px-3 py-1.5 text-sm font-semibold leading-6 text-gray-900 shadow-sm ring-1 ring-gray-900/10 hover:ring-gray-900/20'
              >
                Cerrar sesión
              </button>
            )}
          </div>
        </div>
      </div>

      <Transition
        as={Fragment}
        enter='duration-200 ease-out'
        enterFrom='opacity-0 scale-95'
        enterTo='opacity-100 scale-100'
        leave='duration-100 ease-in'
        leaveFrom='opacity-100 scale-100'
        leaveTo='opacity-0 scale-95'
      >
        <Popover.Panel
          focus
          className='absolute inset-x-0 top-0 origin-top-right transform p-2 transition md:hidden z-50'
        >
          <div className='divide-y-2 divide-gray-50 rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5'>
            <div className='px-5 pt-5 pb-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <span className='text-2xl'>Joshub</span>
                </div>
                <div className='-mr-2'>
                  <Popover.Button className='inline-flex items-center justify-center rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none'>
                    <span className='sr-only'>Close menu</span>
                    <XMarkIcon className='h-6 w-6' aria-hidden='true' />
                  </Popover.Button>
                </div>
              </div>
              <div className='mt-6'>
                <nav className='grid gap-y-8'>
                  {mobileNavigation.map(item => (
                    <NextLink
                      key={item.name}
                      href={item.href}
                      className='-m-3 p-3 flex items-center rounded-lg hover:bg-gray-50'
                    >
                      <div className='ml-4 text-base font-medium text-gray-900'>
                        {item.name}
                      </div>
                    </NextLink>
                  ))}
                </nav>
              </div>
            </div>

            <div className='space-y-6 py-6 px-5'>
              <div className='grid grid-cols-2 gap-y-4 gap-x-8'>
                {session === null && (
                  <NextLink
                    href='/login'
                    className='text-base font-medium text-gray-900 hover:text-gray-700'
                  >
                    Iniciar sesión
                  </NextLink>
                )}

                {session !== null && (
                  <button
                    type='button'
                    onClick={handleLogout}
                    className='text-base font-medium text-gray-900 text-left hover:text-gray-700'
                  >
                    Cerrar sesión
                  </button>
                )}
              </div>
            </div>
          </div>
        </Popover.Panel>
      </Transition>
    </Popover>
  )
}

export default Navbar
