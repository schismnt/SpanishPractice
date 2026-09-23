import { useState, useCallback } from 'react';

export const PRONOUNS = [
  'yo',
  'tú',
  'él/ella/usted',
  'nosotros/as',
  'vosotros/as',
  'ellos/ellas/ustedes',
];

export function useQuizLogic(verbs, selectedTenses, gameMode = 'randomizer') {
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [streak, setStreak] = useState(0);

  const generateQuestion = useCallback(() => {
    if (!verbs || verbs.length === 0 || !selectedTenses || selectedTenses.length === 0) {
      return;
    }
    
    // 1. Pick a random verb
    const randomVerb = verbs[Math.floor(Math.random() * verbs.length)];
    // 2. Pick a random tense from selected tenses
    const randomTense = selectedTenses[Math.floor(Math.random() * selectedTenses.length)];
    // 3. Pick valid pronouns (Imperative lacks 'yo', so filter valid ones)
    const validPronouns = PRONOUNS.filter(p => {
      const answer = randomVerb.conjugations[randomTense][p];
      return answer && answer !== "-";
    });

    if (validPronouns.length === 0) return; // Fallback

    if (gameMode === 'groups') {
      const correctAnswers = {};
      validPronouns.forEach(p => {
        correctAnswers[p] = randomVerb.conjugations[randomTense][p];
      });
      setCurrentQuestion({
        mode: 'groups',
        infinitive: randomVerb.infinitive,
        translation: randomVerb.translation,
        tense: randomTense,
        pronouns: validPronouns,
        correctAnswers: correctAnswers,
      });
    } else {
      const randomPronoun = validPronouns[Math.floor(Math.random() * validPronouns.length)];
      const correctAnswer = randomVerb.conjugations[randomTense][randomPronoun];
      
      setCurrentQuestion({
        mode: 'randomizer',
        infinitive: randomVerb.infinitive,
        translation: randomVerb.translation,
        tense: randomTense,
        pronoun: randomPronoun,
        correctAnswer: correctAnswer,
      });
    }
  }, [verbs, selectedTenses, gameMode]);

  const validateAnswer = useCallback((inputAnswer) => {
    if (!currentQuestion || currentQuestion.mode !== 'randomizer') return false;
    const sanitizedInput = inputAnswer.trim().toLowerCase();
    const sanitizedCorrect = currentQuestion.correctAnswer.trim().toLowerCase();
    
    const isCorrect = sanitizedInput === sanitizedCorrect;
    if (isCorrect) {
      setStreak(s => s + 1);
    } else {
      setStreak(0);
    }
    return isCorrect;
  }, [currentQuestion]);

  const validateGroupAnswers = useCallback((inputAnswers) => {
    if (!currentQuestion || currentQuestion.mode !== 'groups') return null;
    let allCorrect = true;
    const results = {};

    currentQuestion.pronouns.forEach(p => {
      const sanitizedInput = (inputAnswers[p] || '').trim().toLowerCase();
      const sanitizedCorrect = currentQuestion.correctAnswers[p].trim().toLowerCase();
      const isCorrect = sanitizedInput === sanitizedCorrect;
      results[p] = isCorrect;
      if (!isCorrect) allCorrect = false;
    });

    if (allCorrect) {
      setStreak(s => s + 1);
    } else {
      setStreak(0);
    }

    return { allCorrect, results };
  }, [currentQuestion]);

  return {
    currentQuestion,
    generateQuestion,
    validateAnswer,
    validateGroupAnswers,
    streak,
  };
}
