import { type FC, type ReactNode } from 'react'

interface Props {
  title: string
  description: string
  icon?: ReactNode
}

const FeatureCard: FC<Props> = ({ title, description, icon }) => {
  return (
    <div className='relative flex flex-col gap-6 sm:flex-row md:flex-col lg:flex-row'>
      <div className='flex h-12 w-12 items-center justify-center rounded-xl bg-blue-700 text-white sm:shrink-0'>
        {icon}
      </div>
      <div className='sm:min-w-0 sm:flex-1'>
        <p className='text-lg font-semibold leading-8 text-gray-900'>{title}</p>
        <p className='mt-2 text-base leading-7 text-gray-600'>{description}</p>
      </div>
    </div>
  )
}

export default FeatureCard
