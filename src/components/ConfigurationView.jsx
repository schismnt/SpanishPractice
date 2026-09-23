import React from 'react';

const AVAILABLE_TENSES = [
  'Present',
  'Preterite',
  'Imperfect',
  'Future',
  'Conditional',
  'Present Subjunctive',
  'Imperfect Subjunctive',
  'Imperative Affirmative',
  'Imperative Negative'
];

export function ConfigurationView({ selectedTenses, setSelectedTenses, onStart, gameMode, setGameMode }) {
  const handleToggle = (tense) => {
    if (selectedTenses.includes(tense)) {
      setSelectedTenses(selectedTenses.filter(t => t !== tense));
    } else {
      setSelectedTenses([...selectedTenses, tense]);
    }
  };

  return (
    <div className="card">
      <h1>Spanish Quiz Setup</h1>
      
      <div className="mode-selector">
        <button 
          className={`mode-btn ${gameMode === 'randomizer' ? 'active' : ''}`}
          onClick={() => setGameMode('randomizer')}
        >
          Randomizer
        </button>
        <button 
          className={`mode-btn ${gameMode === 'groups' ? 'active' : ''}`}
          onClick={() => setGameMode('groups')}
        >
          Groups
        </button>
      </div>

      <p className="subtitle">Select the tenses you want to practice</p>
      
      <div className="form-group">
        {AVAILABLE_TENSES.map(tense => (
          <label key={tense} className="checkbox-label">
            <input
              type="checkbox"
              checked={selectedTenses.includes(tense)}
              onChange={() => handleToggle(tense)}
            />
            {tense}
          </label>
        ))}
      </div>

      <button 
        className="btn btn-primary"
        onClick={onStart}
        disabled={selectedTenses.length === 0}
      >
        Start Quiz
      </button>
    </div>
  );
}
