import React, { FC } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { SelectBox, SelectBoxItem } from '@tremor/react'

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

  const handleSelect = (customer: Customer): void => {
    onSelected(customer)
  }

  return (
    <>
      <label htmlFor="quantity"
             className="block text-sm mb-1 font-medium text-gray-700">
        Cliente
      </label>
      <SelectBox handleSelect={handleSelect}
                 placeholder="Seleccione un cliente">
        {
          customers !== undefined && customers !== null
            ? (
                customers.map((customer) => (
                <SelectBoxItem key={customer.id} value={customer}
                               text={`${customer.name}`}/>))
              )
            : <SelectBoxItem value={undefined} text=""/>
        }
      </SelectBox>
    </>
  )
}

export default CustomerField
