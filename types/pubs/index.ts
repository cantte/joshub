export interface PubInputs {
  name: string
  nit?: string
  address: string
  owner: string
}

export type Pub = PubInputs & { id: string, created_at: string }
