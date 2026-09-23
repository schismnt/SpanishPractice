import React, { useState, useEffect, useRef } from 'react';

const ACCENTS = ['á', 'é', 'í', 'ó', 'ú', 'ñ'];

export function RandomizerQuizView({ 
  currentQuestion, 
  onNext, 
  validateAnswer, 
  streak,
  onBack 
}) {
  const [inputValue, setInputValue] = useState('');
  const [status, setStatus] = useState('typing'); // 'typing', 'correct', 'incorrect'
  const inputRef = useRef(null);

  useEffect(() => {
    // Focus input on mount and when question changes
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [currentQuestion, status]);

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (status !== 'typing') {
      // If already correct or incorrect, proceed to next
      setStatus('typing');
      setInputValue('');
      onNext();
      return;
    }

    if (!inputValue.trim()) return;

    const isCorrect = validateAnswer(inputValue);
    if (isCorrect) {
      setStatus('correct');
      // Automatically proceed after brief delay or immediately? The PRD says:
      // "If correct: Briefly display a success state and automatically load next"
      setTimeout(() => {
        setStatus('typing');
        setInputValue('');
        onNext();
      }, 600);
    } else {
      setStatus('incorrect');
    }
  };

  const insertAccent = (char) => {
    setInputValue(prev => prev + char);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  if (!currentQuestion) return null;

  return (
    <div className="card">
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

      <div className="quiz-pronoun">
        {currentQuestion.pronoun}
      </div>

      <form onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          type="text"
          className={`text-input ${status === 'correct' ? 'success' : status === 'incorrect' ? 'error' : ''}`}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          disabled={status === 'correct'} // Disable if success animation is playing
          autoComplete="off"
          autoCapitalize="none"
          spellCheck="false"
        />

        <div className="accents-toolbar">
          {ACCENTS.map(char => (
            <button 
              key={char} 
              type="button" 
              className="btn-accent"
              onClick={() => insertAccent(char)}
              disabled={status !== 'typing'}
            >
              {char}
            </button>
          ))}
        </div>

        {status === 'incorrect' && (
          <div className="feedback-message error">
            Incorrect. The right answer is: <strong>{currentQuestion.correctAnswer}</strong>
          </div>
        )}

        {status === 'correct' && (
          <div className="feedback-message success">
            ¡Correcto!
          </div>
        )}

        <button type="submit" className="btn btn-primary" disabled={!inputValue.trim() && status === 'typing'}>
          {status === 'incorrect' ? 'Next' : 'Submit'}
        </button>
      </form>

      <div className="streak-counter">
        🔥 Current Streak: {streak}
      </div>
    </div>
  );
}
