export interface EmployeeInputs {
  id: string
  name: string
  phone: string
  salary: number
  email: string
  password: string
}

export type Employee =
  Omit<EmployeeInputs, 'password' | 'email'>
  & { user_id: string }
