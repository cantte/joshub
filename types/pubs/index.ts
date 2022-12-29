import { Employee } from '@joshub/types/employees'

type PubOwnerInputs = Omit<Employee, 'user_id' | 'pub_id'>

export interface PubInputs {
  name: string
  nit?: string
  address: string
  owner: PubOwnerInputs

  user_id: string
}

export type Pub = PubInputs & { id: string, created_at: string }
