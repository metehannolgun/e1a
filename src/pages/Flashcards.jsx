import React, { useState } from 'react';
import { categories, allWords } from '../data/vocabulary';
import FlashCard from '../components/FlashCard';
import { useSpacedRepetition } from '../hooks/useSpacedRepetition';
import { isDueForReview } from '../utils/spacedRepetition';
import { themes, defaultTheme } from '../data/themes';

export default function Flashcards({ selectedCategory, setSelectedCategory, onProgress, soundEnabled, darkMode, theme }) {
  const { wordProgress, markKnown, markLearning, getSortedWords } = useSpacedRepetition();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sessionCount, setSessionCount] = useState(0);
  const t = themes[theme] || themes[defaultTheme];

  const sortedWords = selectedCategory
    ? getSortedWords(allWords.filter(w => w.categoryId === selectedCategory))
    : getSortedWords(allWords);

  const dueWords = sortedWords.filter(w => isDueForReview(wordProgress[w.id]));
  const safeIndex = dueWords.length > 0 ? currentIndex % dueWords.length : 0;
  const currentWord = dueWords[safeIndex];

  function handleKnown(wordId) {
    markKnown(wordId);
    setSessionCount(n => n + 1);
    onProgress(wordId, true);
    // Reset to 0; on next render the word will be gone from dueWords
    setCurrentIndex(0);
  }

  function handleLearning(wordId) {
    markLearning(wordId);
    setSessionCount(n => n + 1);
    onProgress(wordId, false);
    // Advance so user sees other cards before this one repeats; dueWords.length is still current
    setCurrentIndex(i => (dueWords.length > 1 ? (i + 1) % dueWords.length : 0));
  }

  function goNext() {
    if (dueWords.length > 0) setCurrentIndex(i => (i + 1) % dueWords.length);
  }

  function goPrev() {
    if (dueWords.length > 0) setCurrentIndex(i => (i - 1 + dueWords.length) % dueWords.length);
  }

  if (dueWords.length === 0) {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50'} flex items-center justify-center p-4`}>
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold mb-2">¡Excelente!</h2>
          <p className={`mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            No hay más palabras para repasar. ¡Vuelve mañana!
          </p>
          <button
            onClick={() => { setSelectedCategory(null); setCurrentIndex(0); }}
            className={`px-6 py-3 ${t.buttonBg} text-white rounded-xl font-bold ${t.buttonHover} transition-colors`}
          >
            ← Back to Categories
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50'} p-4 md:p-8`}>
      <div className="max-w-2xl mx-auto">
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => { setSelectedCategory(null); setCurrentIndex(0); }}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              !selectedCategory ? `${t.filterActive} text-white` : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            All Categories
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => { setSelectedCategory(cat.id); setCurrentIndex(0); }}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === cat.id ? `${t.filterActive} text-white` : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {cat.emoji} {cat.name}
            </button>
          ))}
        </div>

        <div className="flex justify-between items-center mb-4 text-sm text-gray-500">
          <span>Card {safeIndex + 1} of {dueWords.length} due</span>
          <span>Session: {sessionCount} practiced</span>
        </div>

        <FlashCard
          word={currentWord}
          progress={wordProgress[currentWord.id]}
          onKnown={handleKnown}
          onLearning={handleLearning}
          soundEnabled={soundEnabled}
          theme={theme}
        />

        <div className="flex justify-center gap-4 mt-6">
          <button
            onClick={goPrev}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              darkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            ← Previous
          </button>
          <button
            onClick={goNext}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              darkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}
