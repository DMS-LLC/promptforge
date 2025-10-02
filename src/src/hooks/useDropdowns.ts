import { useCallback, useEffect, useMemo, useState } from 'react'

import type { DropdownDefinition, DropdownOption } from '../types'

export const STORAGE_KEY = 'promptforge.dropdownState.v1'

const generateId = () => Math.random().toString(36).slice(2, 10)

const createOption = (): DropdownOption => ({
  id: generateId(),
  phrase: '',
  language: '',
  locked: false,
})

const createDropdown = (): DropdownDefinition => {
  const option = createOption()
  return {
    id: generateId(),
    name: '',
    options: [option],
    selectedOptionId: option.id,
  }
}

const parseStoredDropdowns = (raw: string | null): DropdownDefinition[] => {
  if (!raw) {
    return []
  }

  try {
    const parsed = JSON.parse(raw) as DropdownDefinition[]

    if (!Array.isArray(parsed)) {
      return []
    }

    return parsed.map((dropdown) => ({
      ...dropdown,
      options: dropdown.options?.map((option) => ({
        ...option,
        locked: Boolean(option.locked),
      })) ?? [],
      selectedOptionId: dropdown.selectedOptionId ?? null,
    }))
  } catch {
    return []
  }
}

export const useDropdowns = () => {
  const [dropdowns, setDropdowns] = useState<DropdownDefinition[]>(() => {
    if (typeof window === 'undefined') {
      return []
    }

    return parseStoredDropdowns(window.localStorage.getItem(STORAGE_KEY))
  })

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(dropdowns))
  }, [dropdowns])

  useEffect(() => {
    if (!dropdowns.length) {
      setDropdowns([createDropdown()])
    }
  }, [dropdowns.length])

  const addDropdown = useCallback(() => {
    setDropdowns((current) => [...current, createDropdown()])
  }, [])

  const deleteDropdown = useCallback((dropdownId: string) => {
    setDropdowns((current) => {
      const remaining = current.filter((dropdown) => dropdown.id !== dropdownId)
      return remaining.length ? remaining : [createDropdown()]
    })
  }, [])

  const updateDropdownName = useCallback((dropdownId: string, name: string) => {
    setDropdowns((current) =>
      current.map((dropdown) =>
        dropdown.id === dropdownId ? { ...dropdown, name } : dropdown,
      ),
    )
  }, [])

  const addOption = useCallback((dropdownId: string) => {
    setDropdowns((current) =>
      current.map((dropdown) => {
        if (dropdown.id !== dropdownId) {
          return dropdown
        }

        const option = createOption()
        return {
          ...dropdown,
          options: [...dropdown.options, option],
          selectedOptionId: dropdown.selectedOptionId ?? option.id,
        }
      }),
    )
  }, [])

  const updateOptionField = useCallback(
    (dropdownId: string, optionId: string, field: 'phrase' | 'language', value: string) => {
      setDropdowns((current) =>
        current.map((dropdown) => {
          if (dropdown.id !== dropdownId) {
            return dropdown
          }

          return {
            ...dropdown,
            options: dropdown.options.map((option) =>
              option.id === optionId ? { ...option, [field]: value } : option,
            ),
          }
        }),
      )
    },
    [],
  )

  const deleteOption = useCallback((dropdownId: string, optionId: string) => {
    setDropdowns((current) =>
      current.map((dropdown) => {
        if (dropdown.id !== dropdownId) {
          return dropdown
        }

        const options = dropdown.options.filter((option) => option.id !== optionId)
        const selectedOptionId =
          dropdown.selectedOptionId === optionId
            ? options[0]?.id ?? null
            : dropdown.selectedOptionId

        return {
          ...dropdown,
          options,
          selectedOptionId,
        }
      }),
    )
  }, [])

  const toggleOptionLock = useCallback((dropdownId: string, optionId: string) => {
    setDropdowns((current) =>
      current.map((dropdown) => {
        if (dropdown.id !== dropdownId) {
          return dropdown
        }

        return {
          ...dropdown,
          options: dropdown.options.map((option) =>
            option.id === optionId ? { ...option, locked: !option.locked } : option,
          ),
        }
      }),
    )
  }, [])

  const selectOption = useCallback((dropdownId: string, optionId: string) => {
    setDropdowns((current) =>
      current.map((dropdown) =>
        dropdown.id === dropdownId ? { ...dropdown, selectedOptionId: optionId } : dropdown,
      ),
    )
  }, [])

  const randomizeUnlocked = useCallback(() => {
    setDropdowns((current) =>
      current.map((dropdown) => {
        if (!dropdown.options.length) {
          return dropdown
        }

        const selectedOption = dropdown.options.find(
          (option) => option.id === dropdown.selectedOptionId,
        )

        if (selectedOption?.locked) {
          return dropdown
        }

        const available = dropdown.options.filter((option) => !option.locked)
        if (!available.length) {
          return dropdown
        }

        const next = available[Math.floor(Math.random() * available.length)]
        if (!next) {
          return dropdown
        }

        return {
          ...dropdown,
          selectedOptionId: next.id,
        }
      }),
    )
  }, [])

  const unlockedCount = useMemo(
    () =>
      dropdowns.reduce((count, dropdown) => {
        const selected = dropdown.options.find((option) => option.id === dropdown.selectedOptionId)
        return selected?.locked ? count : count + 1
      }, 0),
    [dropdowns],
  )

  return {
    dropdowns,
    addDropdown,
    deleteDropdown,
    updateDropdownName,
    addOption,
    updateOptionField,
    deleteOption,
    toggleOptionLock,
    selectOption,
    randomizeUnlocked,
    unlockedCount,
  }
}
