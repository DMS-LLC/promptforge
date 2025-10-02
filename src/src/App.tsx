import { useMemo } from 'react'

import { DropdownCard } from './components/DropdownCard'
import { useDropdowns } from './hooks/useDropdowns'
import './App.css'

function App() {
  const {
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
  } = useDropdowns()

  const previewText = useMemo(
    () =>
      dropdowns
        .map((dropdown) =>
          dropdown.options.find((option) => option.id === dropdown.selectedOptionId)?.phrase ?? '',
        )
        .filter((value) => Boolean(value.trim()))
        .join(' '),
    [dropdowns],
  )

  return (
    <div className="app">
      <header className="app__header">
        <div>
          <h1>Prompt dropdown builder</h1>
          <p>
            Define themed dropdowns, lock your favourite lines, and randomize the rest to
            experiment with new prompt combinations.
          </p>
        </div>
        <button type="button" className="app__add" onClick={addDropdown}>
          + Add dropdown
        </button>
      </header>

      <section className="app__content">
        <aside className="app__guidance">
          <h2>How it works</h2>
          <ol>
            <li>Create dropdowns for each prompt segment (for example, subject or style).</li>
            <li>Add options with a short display phrase and the language it belongs to.</li>
            <li>Toggle locks on favourite options. The randomizer will skip those.</li>
            <li>Press <strong>Randomize</strong> any time to remix the unlocked dropdowns.</li>
          </ol>
          <p className="app__hint">
            Your changes are saved automatically in this browser. Come back any time to continue
            from where you left off.
          </p>
        </aside>
        <div className="app__dropdowns">
          {dropdowns.map((dropdown, index) => (
            <DropdownCard
              key={dropdown.id}
              dropdown={dropdown}
              index={index}
              onRename={updateDropdownName}
              onDelete={deleteDropdown}
              onAddOption={addOption}
              onUpdateOptionField={updateOptionField}
              onDeleteOption={deleteOption}
              onToggleLock={toggleOptionLock}
              onSelectOption={selectOption}
            />
          ))}
        </div>
      </section>

      <footer className="app__footer">
        <div className="randomize">
          <div className="randomize__details">
            <h2>Prompt preview</h2>
            <p className="randomize__status">
              {unlockedCount ? `${unlockedCount} dropdown${unlockedCount === 1 ? '' : 's'} ready` : 'All selections are locked'}
            </p>
          </div>
          <button
            type="button"
            className="randomize__button"
            onClick={randomizeUnlocked}
            disabled={unlockedCount === 0}
          >
            Randomize unlocked
          </button>
        </div>
        <output
          role="status"
          aria-live="polite"
          className="preview"
          data-testid="prompt-preview"
        >
          {previewText || 'Your prompt preview will appear here as you add selections.'}
        </output>
      </footer>
    </div>
  )
}

export default App
