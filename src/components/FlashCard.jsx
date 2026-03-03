import React, { useState } from 'react';
import { useSpeech } from '../hooks/useSpeech';
import { themes, defaultTheme } from '../data/themes';

export default function FlashCard({ word, onKnown, onLearning, progress, soundEnabled = true, theme }) {
  const [flipped, setFlipped] = useState(false);
  const { speak } = useSpeech();
  const t = themes[theme] || themes[defaultTheme];

  const level = progress?.level || 1;
  const levelColors = ['', 'bg-red-100', 'bg-orange-100', 'bg-yellow-100', 'bg-blue-100', 'bg-green-100'];
  const levelLabels = ['', '🔴 Level 1', '🟠 Level 2', '🟡 Level 3', '🔵 Level 4', '🟢 Mastered!'];

  function handleSpeak(e) {
    e.stopPropagation();
    speak(word.spanish, soundEnabled);
  }

  function handleKnown(e) {
    e.stopPropagation();
    setFlipped(false);
    onKnown(word.id);
  }

  function handleLearning(e) {
    e.stopPropagation();
    setFlipped(false);
    onLearning(word.id);
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className={`px-3 py-1 rounded-full text-sm font-medium ${levelColors[level] || levelColors[1]}`}>
        {levelLabels[level] || levelLabels[1]}
      </div>

      <div className="card-flip-container w-full max-w-lg" style={{ height: 280 }}>
        <div
          className={`card-flip w-full h-full cursor-pointer ${flipped ? 'flipped' : ''}`}
          onClick={() => setFlipped(f => !f)}
        >
          <div className={`card-face w-full h-full rounded-2xl shadow-xl bg-gradient-to-br ${t.cardGradient} flex flex-col items-center justify-center p-6 select-none`}>
            <p className="text-4xl font-bold text-white text-center mb-3">{word.spanish}</p>
            <button
              onClick={handleSpeak}
              className="mt-2 p-2 bg-white/20 rounded-full hover:bg-white/40 transition-colors text-white text-xl"
              title="Listen"
            >
              🔊
            </button>
            <p className="text-white/70 text-sm mt-4">Click to reveal translation</p>
          </div>

          <div className="card-face card-back w-full h-full rounded-2xl shadow-xl bg-gradient-to-br from-yellow-400 to-amber-300 flex flex-col items-center justify-center p-6 select-none">
            <p className="text-3xl font-bold text-gray-800 text-center mb-2">{word.english}</p>
            {word.example && (
              <p className="text-gray-600 text-sm italic text-center mt-2">"{word.example}"</p>
            )}
            <p className="text-gray-500 text-xs mt-3">Click to flip back</p>
          </div>
        </div>
      </div>

      <div className="flex gap-4 w-full max-w-lg">
        <button
          onClick={handleLearning}
          className="flex-1 py-3 rounded-xl bg-orange-100 text-orange-700 font-bold hover:bg-orange-200 transition-colors"
        >
          Still Learning 📖
        </button>
        <button
          onClick={handleKnown}
          className="flex-1 py-3 rounded-xl bg-green-100 text-green-700 font-bold hover:bg-green-200 transition-colors"
        >
          I Know This ✓
        </button>
      </div>
    </div>
  );
}
