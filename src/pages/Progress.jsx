import React from 'react';
import { categories, allWords } from '../data/vocabulary';
import ProgressBar from '../components/ProgressBar';
import { BadgeDisplay } from '../components/Badge';
import { themes, defaultTheme } from '../data/themes';

export default function Progress({ wordProgress, streakData, badges, quizStats, darkMode, theme }) {
  const t = themes[theme] || themes[defaultTheme];
  const totalWords = allWords.length;
  const masteredWords = Object.values(wordProgress).filter(p => p.level >= 5).length;
  const learnedWords = Object.values(wordProgress).filter(p => p.lastSeen).length;
  const totalAnswers = quizStats.totalAnswered || 0;
  const correctAnswers = quizStats.totalCorrect || 0;
  const accuracy = totalAnswers > 0 ? Math.round((correctAnswers / totalAnswers) * 100) : 0;

  const levelCounts = [1,2,3,4,5].map(l => Object.values(wordProgress).filter(p => p.level === l).length);

  function getCategoryMastered(catId) {
    const catWords = allWords.filter(w => w.categoryId === catId);
    return catWords.filter(w => (wordProgress[w.id]?.level || 1) >= 5).length;
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50'} p-4 md:p-8`}>
      <div className="max-w-4xl mx-auto">
        <h1 className={`text-3xl font-bold ${t.accentText} mb-6`}>📊 Your Progress</h1>

        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow p-6 mb-6`}>
          <h2 className="text-xl font-bold mb-4">🔥 Streaks</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-3xl font-bold text-orange-500">{streakData.currentStreak || 0}</p>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Current Streak</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-red-500">{streakData.longestStreak || 0}</p>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Longest Streak</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-yellow-500">{accuracy}%</p>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Quiz Accuracy</p>
            </div>
          </div>
        </div>

        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow p-6 mb-6`}>
          <h2 className="text-xl font-bold mb-4">📈 Mastery Levels</h2>
          <div className="space-y-3">
            {['🔴 Level 1 (New)', '🟠 Level 2', '🟡 Level 3', '🔵 Level 4', '🟢 Level 5 (Mastered)'].map((label, i) => (
              <ProgressBar key={i} value={levelCounts[i]} max={totalWords} label={label} color={
                i === 4 ? 'bg-green-500' : i === 3 ? 'bg-blue-500' : i === 2 ? 'bg-yellow-500' : i === 1 ? 'bg-orange-500' : t.progressBar
              } />
            ))}
          </div>
        </div>

        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow p-6 mb-6`}>
          <h2 className="text-xl font-bold mb-4">📚 Category Progress</h2>
          <div className="space-y-4">
            {categories.map(cat => {
              const mastered = getCategoryMastered(cat.id);
              return (
                <div key={cat.id}>
                  <div className="flex items-center gap-2 mb-1">
                    <span>{cat.emoji}</span>
                    <span className="font-medium">{cat.name}</span>
                  </div>
                  <ProgressBar value={mastered} max={cat.words.length} color={t.progressBar} label={`${mastered}/${cat.words.length} mastered`} />
                </div>
              );
            })}
          </div>
        </div>

        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow p-6`}>
          <h2 className="text-xl font-bold mb-4">🏆 Achievements</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {['first_steps', 'quiz_whiz', 'week_warrior', 'century_club', 'category_master'].map(id => (
              <BadgeDisplay key={id} badgeId={id} earned={badges.includes(id)} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
