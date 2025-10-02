export interface DropdownOption {
  id: string
  phrase: string
  language: string
  locked: boolean
}

export interface DropdownDefinition {
  id: string
  name: string
  options: DropdownOption[]
  selectedOptionId: string | null
}
