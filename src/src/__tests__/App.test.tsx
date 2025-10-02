import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import App from '../App'
import { STORAGE_KEY } from '../hooks/useDropdowns'

describe('App', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('creates dropdowns and allows editing options', async () => {
    const user = userEvent.setup()
    render(<App />)

    const addButton = await screen.findByRole('button', { name: /add dropdown/i })

    const initialCards = await screen.findAllByLabelText(/Dropdown/i)
    await user.click(addButton)

    const cardsAfter = await screen.findAllByLabelText(/Dropdown/i)
    expect(cardsAfter.length).toBe(initialCards.length + 1)

    const [firstOption] = await screen.findAllByTestId('option-row')
    const phraseInput = within(firstOption).getByPlaceholderText(/Option phrase/i)
    await user.clear(phraseInput)
    await user.type(phraseInput, 'Heroic explorer')

    const languageInput = within(firstOption).getByPlaceholderText(/Language/i)
    await user.clear(languageInput)
    await user.type(languageInput, 'en')

    expect(phraseInput).toHaveValue('Heroic explorer')
    expect(languageInput).toHaveValue('en')
  })

  it('randomizes unlocked dropdowns while respecting locked options', async () => {
    const user = userEvent.setup()
    render(<App />)

    const optionRows = await screen.findAllByTestId('option-row')
    const firstRow = optionRows[0]

    const firstPhrase = within(firstRow).getByPlaceholderText(/Option phrase/i)
    await user.clear(firstPhrase)
    await user.type(firstPhrase, 'Alpha')
    const firstLanguage = within(firstRow).getByPlaceholderText(/Language/i)
    await user.clear(firstLanguage)
    await user.type(firstLanguage, 'en')

    await user.click(screen.getByRole('button', { name: /add option/i }))
    const updatedRows = await screen.findAllByTestId('option-row')
    const secondRow = updatedRows[1]

    const secondPhrase = within(secondRow).getByPlaceholderText(/Option phrase/i)
    await user.type(secondPhrase, 'Beta')
    const secondLanguage = within(secondRow).getByPlaceholderText(/Language/i)
    await user.type(secondLanguage, 'en')

    const preview = await screen.findByTestId('prompt-preview')
    expect(preview).toHaveTextContent('Alpha')

    const lockButton = within(firstRow).getByRole('button', { name: /lock option 1/i })
    await user.click(lockButton)

    const randomButton = screen.getByRole('button', { name: /randomize unlocked/i })
    const randomSpy = vi.spyOn(Math, 'random').mockReturnValue(0.9)

    await user.click(randomButton)
    expect(preview).toHaveTextContent('Alpha')

    const unlockButton = within(firstRow).getByRole('button', { name: /unlock option 1/i })
    await user.click(unlockButton)

    await user.click(randomButton)
    expect(preview).toHaveTextContent('Beta')

    randomSpy.mockRestore()
  })

  it('persists dropdown state to local storage', async () => {
    const user = userEvent.setup()
    render(<App />)

    const nameInput = await screen.findByPlaceholderText(/Name your dropdown/i)
    await user.type(nameInput, 'Characters')

    const [optionRow] = await screen.findAllByTestId('option-row')
    const phraseInput = within(optionRow).getByPlaceholderText(/Option phrase/i)
    await user.clear(phraseInput)
    await user.type(phraseInput, 'Curious fox')

    await waitFor(() => {
      const stored = window.localStorage.getItem(STORAGE_KEY)
      expect(stored).toBeTruthy()
      expect(stored).toContain('Characters')
      expect(stored).toContain('Curious fox')
    })
  })
})
