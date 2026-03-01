import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { getInitialWordProgress, promoteWord, demoteWord, sortByPriority } from '../utils/spacedRepetition';
import { allWords } from '../data/vocabulary';

export function useSpacedRepetition() {
  const [wordProgress, setWordProgress] = useLocalStorage('wordProgress', {});

  const getProgress = useCallback((wordId) => {
    return wordProgress[wordId] || getInitialWordProgress(wordId);
  }, [wordProgress]);

  const markKnown = useCallback((wordId) => {
    setWordProgress(prev => ({
      ...prev,
      [wordId]: promoteWord(prev[wordId] || getInitialWordProgress(wordId))
    }));
  }, [setWordProgress]);

  const markLearning = useCallback((wordId) => {
    setWordProgress(prev => ({
      ...prev,
      [wordId]: demoteWord(prev[wordId] || getInitialWordProgress(wordId))
    }));
  }, [setWordProgress]);

  const getSortedWords = useCallback((words) => {
    return sortByPriority(words, wordProgress);
  }, [wordProgress]);

  const getMasteredCount = useCallback(() => {
    return Object.values(wordProgress).filter(p => p.level >= 5).length;
  }, [wordProgress]);

  const getWordsAtLevel = useCallback((level) => {
    return Object.values(wordProgress).filter(p => p.level === level).length;
  }, [wordProgress]);

  const getCategoryProgress = useCallback((categoryId) => {
    const catWords = allWords.filter(w => w.categoryId === categoryId);
    const mastered = catWords.filter(w => (wordProgress[w.id]?.level || 1) >= 5).length;
    return { total: catWords.length, mastered };
  }, [wordProgress]);

  return {
    wordProgress,
    getProgress,
    markKnown,
    markLearning,
    getSortedWords,
    getMasteredCount,
    getWordsAtLevel,
    getCategoryProgress,
  };
}
