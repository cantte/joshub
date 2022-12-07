import React, { FC } from 'react'
import { Disclosure } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import NextLink from 'next/link'
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react'

const Navbar: FC = () => {
  const session = useSession()
  const supabase = useSupabaseClient()

  return (
    <Disclosure as="nav" className="bg-gray-800">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
            <div className="relative flex h-16 items-center justify-between">
              <div
                className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                <Disclosure.Button
                  className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                  <span className="sr-only">Open main menu</span>
                  {open
                    ? (
                      <XMarkIcon className="block h-6 w-6" aria-hidden="true"/>
                      )
                    : (
                      <Bars3Icon className="block h-6 w-6" aria-hidden="true"/>
                      )}
                </Disclosure.Button>
              </div>
              <div
                className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                <div className="flex flex-shrink-0 items-center">
                  <span className="text-white text-xl">Joshub</span>
                </div>
                <div className="hidden sm:ml-6 sm:block">
                  <div className="flex space-x-4">
                    <NextLink
                      href="/"
                      className="bg-gray-900 text-white px-3 py-2 rounded-md text-sm font-medium">
                      Panel de control
                    </NextLink>

                    <NextLink
                      href="/products"
                      className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                      Productos
                    </NextLink>

                    <NextLink
                      href="/employees"
                      className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                      Empleados
                    </NextLink>

                    <NextLink
                      href="/customers/register"
                      className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                      Registrar cliente
                    </NextLink>
                  </div>
                </div>
              </div>
              <div
                className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                {
                  session === null
                    ? (
                      <NextLink href="/login">
                        <button
                          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 mx-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                          Iniciar sesión
                        </button>
                      </NextLink>
                      )
                    : (
                      <button
                        onClick={async () => await supabase.auth.signOut()}
                        className="inline-flex justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus-visible:ring-1 focus-visible:ring-red-500 focus-visible:ring-offset-2">
                        Cerrar sesión
                      </button>
                      )
                }
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="space-y-1 px-2 pt-2 pb-3">
              <Disclosure.Button
                className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">
                Dashboard
              </Disclosure.Button>
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  )
}

export default Navbar
