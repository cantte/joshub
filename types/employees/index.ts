export interface EmployeeInputs {
  id: string
  name: string
  phone: string
  salary: number
  email: string
  password: string
  pub_id: string
}

export type Employee = Omit<EmployeeInputs, 'password' | 'email'> & {
  user_id: string
}
