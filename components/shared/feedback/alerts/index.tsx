import { FC, Fragment } from 'react'
import {
  CheckIcon,
  InformationCircleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import { Transition } from '@headlessui/react'
import toast from 'react-hot-toast'

interface Props {
  id: string
  title: string

  variant: 'success' | 'warning' | 'error' | 'info'
}

const variants = {
  info: {
    icon: InformationCircleIcon,
    color: 'text-blue-700 bg-blue-100 dark:bg-blue-200 dark:text-blue-800'
  },
  success: {
    icon: CheckIcon,
    color: 'text-green-700 bg-green-100 dark:bg-green-200 dark:text-green-800'
  },
  error: {
    icon: XMarkIcon,
    color: 'text-red-700 bg-red-100 dark:bg-red-200 dark:text-red-800'
  },
  warning: {
    icon: InformationCircleIcon,
    color:
      'text-yellow-700 bg-yellow-100 dark:bg-yellow-200 dark:text-yellow-800'
  }
}

const Alert: FC<Props> = ({ id, title, variant }) => {
  const { icon: Icon, color } = variants[variant]

  return (
    <Transition
      as={Fragment}
      show={true}
      appear={true}
      enter='duration-200 ease-out'
      enterFrom='opacity-0 scale-95'
      enterTo='opacity-100 scale-100'
      leave='duration-100 ease-in'
      leaveFrom='opacity-100 scale-100'
      leaveTo='opacity-0 scale-95'
    >
      <div
        className={`flex p-4 mb-4 text-sm rounded-lg max-w-md w-full ${color}`}
        role='alert'
      >
        <Icon className='flex-shrink-0 inline w-5 h-5 mr-3' />
        <span className='sr-only'>Info</span>
        <div>{title}</div>

        <button
          type='button'
          onClick={() => toast.remove(id)}
          className={`ml-auto -mx-1.5 -my-1.5 rounded-lg  p-1.5 inline-flex h-8 w-8 ${color}`}
        >
          <span className='sr-only'>Close</span>
          <XMarkIcon className='h-5 w-5' />
        </button>
      </div>
    </Transition>
  )
}

export default Alert
