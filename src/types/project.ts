// src/types/project.ts
export interface Project {
  id: string
  name: string
  symbol: string
  status: 'not_created' | 'creating' | 'created'
  townie?: string
  bazaar?: string
}
