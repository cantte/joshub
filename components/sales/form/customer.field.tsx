import React, { FC, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { Combobox } from '@headlessui/react'

interface Customer {
  id: string
  name: string
}

interface Props {
  onSelected: (value: Customer) => void
}

const CustomerField: FC<Props> = ({ onSelected }) => {
  const supabase = useSupabaseClient()
  const loadCustomers = async (): Promise<Customer[] | null> => {
    const { data } = await supabase.from('customers').select()
    return data
  }

  const {
    data: customers
  } = useQuery(['customers'], loadCustomers)

  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState<Customer | undefined>(undefined)

  const filteredCustomers = query === ''
    ? customers
    : customers?.filter((customer) => customer.name.toLowerCase()
      .replace(/\s+/g, '')
      .includes(query.toLowerCase().replace(/\s+/g, '')))

  const handleSelect = (customer: Customer): void => {
    setSelected(customer)
    onSelected(customer)
  }

  return (
    <Combobox value={selected} onChange={handleSelect}>
      <Combobox.Label
        className="block text-sm font-medium text-gray-700">Cliente</Combobox.Label>
      <Combobox.Input
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        onChange={(e) => setQuery(e.target.value)}
        displayValue={(customer: Customer) => customer?.name}
      />
      <Combobox.Options
        className="mt-1 rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
        {filteredCustomers?.map((customer) => (
          <Combobox.Option key={customer.id} value={customer}
                           className="ui-active:bg-blue-500 ui-active:text-white ui-not-active:bg-white ui-not-active:text-gray-800 py-2 px-3"
          >
            {customer.name}
          </Combobox.Option>
        ))}
      </Combobox.Options>
    </Combobox>
  )
}

export default CustomerField
