import React, { useState, useEffect, useRef } from 'react';

const ACCENTS = ['á', 'é', 'í', 'ó', 'ú', 'ñ'];

export function GroupQuizView({ 
  currentQuestion, 
  onNext, 
  validateGroupAnswers, 
  streak,
  onBack 
}) {
  const [inputValues, setInputValues] = useState({});
  const [status, setStatus] = useState('typing'); // 'typing', 'evaluated'
  const [results, setResults] = useState({});
  const [focusedInput, setFocusedInput] = useState(null);
  
  // Create refs array based on pronouns
  const inputRefs = useRef({});

  useEffect(() => {
    // Reset state on new question
    setInputValues({});
    setStatus('typing');
    setResults({});
    setFocusedInput(null);
    
    // Focus first input automatically
    if (currentQuestion && currentQuestion.pronouns.length > 0) {
      const firstPronoun = currentQuestion.pronouns[0];
      if (inputRefs.current[firstPronoun]) {
        inputRefs.current[firstPronoun].focus();
      }
    }
  }, [currentQuestion]);

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (status === 'evaluated') {
      onNext();
      return;
    }

    const validation = validateGroupAnswers(inputValues);
    if (!validation) return;

    setResults(validation.results);
    setStatus('evaluated');

    if (validation.allCorrect) {
      setTimeout(() => {
        onNext();
      }, 800);
    }
  };

  const handleInputChange = (pronoun, value) => {
    setInputValues(prev => ({
      ...prev,
      [pronoun]: value
    }));
  };

  const insertAccent = (char) => {
    if (focusedInput) {
      setInputValues(prev => ({
        ...prev,
        [focusedInput]: (prev[focusedInput] || '') + char
      }));
      if (inputRefs.current[focusedInput]) {
        inputRefs.current[focusedInput].focus();
      }
    }
  };

  if (!currentQuestion || currentQuestion.mode !== 'groups') return null;

  return (
    <div className="card group-card">
      <div className="quiz-header">
        <button className="btn" onClick={onBack} style={{position: 'absolute', top: '1rem', left: '1rem', width: 'auto', background: 'transparent', padding: '0.5rem', border: '1px solid var(--border-color)', color: 'var(--text-secondary)'}}>
          ← Back
        </button>
        <div className="quiz-infinitive">{currentQuestion.infinitive}</div>
        <div className="quiz-translation">{currentQuestion.translation}</div>
        <div className="quiz-meta">
          <span>{currentQuestion.tense}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="group-grid">
          {currentQuestion.pronouns.map(pronoun => {
            const isCorrect = results[pronoun] === true;
            const isIncorrect = results[pronoun] === false;
            
            return (
              <div key={pronoun} className="group-input-container">
                <label className="group-pronoun-label">{pronoun}</label>
                <input
                  ref={el => inputRefs.current[pronoun] = el}
                  type="text"
                  className={`text-input group-input ${isCorrect ? 'success' : isIncorrect ? 'error' : ''}`}
                  value={inputValues[pronoun] || ''}
                  onChange={(e) => handleInputChange(pronoun, e.target.value)}
                  onFocus={() => setFocusedInput(pronoun)}
                  disabled={status === 'evaluated' && isCorrect}
                  autoComplete="off"
                  autoCapitalize="none"
                  spellCheck="false"
                />
                {status === 'evaluated' && isIncorrect && (
                  <div className="group-feedback">
                    {currentQuestion.correctAnswers[pronoun]}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="accents-toolbar">
          {ACCENTS.map(char => (
            <button 
              key={char} 
              type="button" 
              className="btn-accent"
              onClick={() => insertAccent(char)}
              disabled={status === 'evaluated'}
            >
              {char}
            </button>
          ))}
        </div>

        <button type="submit" className="btn btn-primary">
          {status === 'evaluated' ? 'Next' : 'Submit'}
        </button>
      </form>

      <div className="streak-counter">
        🔥 Current Streak: {streak}
      </div>
    </div>
  );
}
