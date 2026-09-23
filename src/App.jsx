import React, { useState, useEffect } from 'react';
import { ConfigurationView } from './components/ConfigurationView';
import { RandomizerQuizView } from './components/RandomizerQuizView';
import { GroupQuizView } from './components/GroupQuizView';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useQuizLogic } from './hooks/useQuizLogic';
import './index.css';

function App() {
  const [verbs, setVerbs] = useState([]);
  const [view, setView] = useState('config'); // 'config' or 'quiz'
  const [selectedTenses, setSelectedTenses] = useLocalStorage('quiz_selected_tenses', ['Present']);
  const [gameMode, setGameMode] = useLocalStorage('quiz_game_mode', 'randomizer'); // 'randomizer' or 'groups'

  const {
    currentQuestion,
    generateQuestion,
    validateAnswer,
    validateGroupAnswers,
    streak
  } = useQuizLogic(verbs, selectedTenses, gameMode);

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}verbs.json?t=${Date.now()}`)
      .then(res => res.json())
      .then(data => setVerbs(data))
      .catch(err => console.error("Error loading verbs data:", err));
  }, []);

  const handleStart = () => {
    generateQuestion();
    setView('quiz');
  };

  const handleNext = () => {
    generateQuestion();
  };

  const handleBack = () => {
    setView('config');
  };

  return (
    <>
      {view === 'config' ? (
        <ConfigurationView 
          selectedTenses={selectedTenses}
          setSelectedTenses={setSelectedTenses}
          onStart={handleStart}
          gameMode={gameMode}
          setGameMode={setGameMode}
        />
      ) : (
        gameMode === 'groups' ? (
          <GroupQuizView
            currentQuestion={currentQuestion}
            onNext={handleNext}
            validateGroupAnswers={validateGroupAnswers}
            streak={streak}
            onBack={handleBack}
          />
        ) : (
          <RandomizerQuizView 
            currentQuestion={currentQuestion}
            onNext={handleNext}
            validateAnswer={validateAnswer}
            streak={streak}
            onBack={handleBack}
          />
        )
      )}
    </>
  );
}

export default App;
