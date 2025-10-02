import type { DropdownDefinition } from '../types'

interface DropdownCardProps {
  dropdown: DropdownDefinition
  index: number
  onRename: (dropdownId: string, value: string) => void
  onDelete: (dropdownId: string) => void
  onAddOption: (dropdownId: string) => void
  onUpdateOptionField: (
    dropdownId: string,
    optionId: string,
    field: 'phrase' | 'language',
    value: string,
  ) => void
  onDeleteOption: (dropdownId: string, optionId: string) => void
  onToggleLock: (dropdownId: string, optionId: string) => void
  onSelectOption: (dropdownId: string, optionId: string) => void
}

export const DropdownCard = ({
  dropdown,
  index,
  onRename,
  onDelete,
  onAddOption,
  onUpdateOptionField,
  onDeleteOption,
  onToggleLock,
  onSelectOption,
}: DropdownCardProps) => {
  const selected = dropdown.options.find((option) => option.id === dropdown.selectedOptionId)

  return (
    <section className="dropdown-card" aria-label={`Dropdown ${index + 1}`}>
      <header className="dropdown-card__header">
        <div className="dropdown-card__title">
          <label className="dropdown-card__label" htmlFor={`${dropdown.id}-name`}>
            Name
          </label>
          <input
            id={`${dropdown.id}-name`}
            className="dropdown-card__name"
            value={dropdown.name}
            placeholder="Name your dropdown"
            onChange={(event) => onRename(dropdown.id, event.target.value)}
          />
        </div>
        <button
          type="button"
          className="dropdown-card__delete"
          onClick={() => onDelete(dropdown.id)}
        >
          Delete
        </button>
      </header>
      <div className="dropdown-card__body">
        <label className="dropdown-card__select-label" htmlFor={`${dropdown.id}-select`}>
          Active option
        </label>
        <select
          id={`${dropdown.id}-select`}
          className="dropdown-card__select"
          value={dropdown.selectedOptionId ?? ''}
          onChange={(event) => onSelectOption(dropdown.id, event.target.value)}
          disabled={!dropdown.options.length}
        >
          {dropdown.options.length === 0 ? (
            <option value="" disabled>
              Add an option to begin
            </option>
          ) : null}
          {dropdown.options.map((option) => (
            <option key={option.id} value={option.id}>
              {option.phrase.trim() ? option.phrase : 'Untitled option'}
            </option>
          ))}
        </select>
        {selected ? (
          <p className="dropdown-card__current">
            Previewing: <span>{selected.phrase || 'Untitled option'}</span>
          </p>
        ) : (
          <p className="dropdown-card__current dropdown-card__current--muted">
            Select or add an option to see it in the prompt preview.
          </p>
        )}
        <div className="dropdown-card__options">
          {dropdown.options.map((option, optionIndex) => (
            <OptionRow
              key={option.id}
              dropdownId={dropdown.id}
              optionId={option.id}
              index={optionIndex}
              phrase={option.phrase}
              language={option.language}
              locked={option.locked}
              isSelected={option.id === dropdown.selectedOptionId}
              onUpdateOptionField={onUpdateOptionField}
              onDeleteOption={onDeleteOption}
              onToggleLock={onToggleLock}
            />
          ))}
        </div>
        <button
          type="button"
          className="dropdown-card__add-option"
          onClick={() => onAddOption(dropdown.id)}
        >
          + Add option
        </button>
      </div>
    </section>
  )
}

interface OptionRowProps {
  dropdownId: string
  optionId: string
  index: number
  phrase: string
  language: string
  locked: boolean
  isSelected: boolean
  onUpdateOptionField: DropdownCardProps['onUpdateOptionField']
  onDeleteOption: DropdownCardProps['onDeleteOption']
  onToggleLock: DropdownCardProps['onToggleLock']
}

const OptionRow = ({
  dropdownId,
  optionId,
  index,
  phrase,
  language,
  locked,
  isSelected,
  onUpdateOptionField,
  onDeleteOption,
  onToggleLock,
}: OptionRowProps) => {
  const legend = `Option ${index + 1}`

  return (
    <fieldset
      className={`option-row${locked ? ' option-row--locked' : ''}`}
      data-testid="option-row"
    >
      <legend>{legend}</legend>
      <div className="option-row__grid">
        <label className="option-row__field" htmlFor={`${optionId}-phrase`}>
          Phrase
          <input
            id={`${optionId}-phrase`}
            value={phrase}
            placeholder="Option phrase"
            onChange={(event) =>
              onUpdateOptionField(dropdownId, optionId, 'phrase', event.target.value)
            }
          />
        </label>
        <label className="option-row__field" htmlFor={`${optionId}-language`}>
          Language
          <input
            id={`${optionId}-language`}
            value={language}
            placeholder="Language (e.g. en)"
            onChange={(event) =>
              onUpdateOptionField(dropdownId, optionId, 'language', event.target.value)
            }
          />
        </label>
      </div>
      <div className="option-row__footer">
        <span className="option-row__status">
          {isSelected ? 'Currently selected' : 'Available'}
        </span>
        <div className="option-row__actions">
          <button
            type="button"
            className="option-row__lock"
            aria-pressed={locked}
            aria-label={`${locked ? 'Unlock' : 'Lock'} option ${index + 1}`}
            onClick={() => onToggleLock(dropdownId, optionId)}
          >
            {locked ? 'Unlock' : 'Lock'}
          </button>
          <button
            type="button"
            className="option-row__delete"
            onClick={() => onDeleteOption(dropdownId, optionId)}
            aria-label={`Delete option ${index + 1}`}
          >
            Remove
          </button>
        </div>
      </div>
    </fieldset>
  )
}
