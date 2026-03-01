import React, { useState } from 'react';
import { categories, allWords } from '../data/vocabulary';
import FlashCard from '../components/FlashCard';
import { useSpacedRepetition } from '../hooks/useSpacedRepetition';

export default function Flashcards({ selectedCategory, setSelectedCategory, onProgress, soundEnabled, darkMode }) {
  const { wordProgress, markKnown, markLearning, getSortedWords } = useSpacedRepetition();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sessionCount, setSessionCount] = useState(0);

  const currentWords = selectedCategory
    ? getSortedWords(allWords.filter(w => w.categoryId === selectedCategory))
    : getSortedWords(allWords);

  const currentWord = currentWords[currentIndex];

  function handleKnown(wordId) {
    markKnown(wordId);
    setSessionCount(n => n + 1);
    onProgress(wordId, true);
    goNext();
  }

  function handleLearning(wordId) {
    markLearning(wordId);
    setSessionCount(n => n + 1);
    onProgress(wordId, false);
    goNext();
  }

  function goNext() {
    setCurrentIndex(i => (i + 1) % currentWords.length);
  }

  function goPrev() {
    setCurrentIndex(i => (i - 1 + currentWords.length) % currentWords.length);
  }

  if (!currentWord) {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50'} flex items-center justify-center`}>
        <div className="text-center">
          <p className="text-2xl mb-4">No words available</p>
          <button onClick={() => setSelectedCategory(null)} className="px-4 py-2 bg-red-600 text-white rounded-lg">
            Show All Categories
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
              !selectedCategory ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            All Categories
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => { setSelectedCategory(cat.id); setCurrentIndex(0); }}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === cat.id ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {cat.emoji} {cat.name}
            </button>
          ))}
        </div>

        <div className="flex justify-between items-center mb-4 text-sm text-gray-500">
          <span>Card {currentIndex + 1} of {currentWords.length}</span>
          <span>Session: {sessionCount} practiced</span>
        </div>

        <FlashCard
          word={currentWord}
          progress={wordProgress[currentWord.id]}
          onKnown={handleKnown}
          onLearning={handleLearning}
          soundEnabled={soundEnabled}
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
