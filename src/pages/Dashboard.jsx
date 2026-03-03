import React from 'react';
import { categories, allWords } from '../data/vocabulary';
import { hasPracticedToday } from '../utils/streakTracker';
import ProgressBar from '../components/ProgressBar';
import StreakCounter from '../components/StreakCounter';
import { BadgeDisplay } from '../components/Badge';
import CategoryCard from '../components/CategoryCard';
import { themes, defaultTheme } from '../data/themes';

export default function Dashboard({ wordProgress, streakData, badges, quizStats, setCurrentPage, onCategorySelect, darkMode, theme }) {
  const t = themes[theme] || themes[defaultTheme];
  const totalWords = allWords.length;
  const masteredWords = Object.values(wordProgress).filter(p => p.level >= 5).length;
  const learnedWords = Object.values(wordProgress).filter(p => p.lastSeen).length;
  const practiced = hasPracticedToday(streakData);
  const totalQuizzes = quizStats.totalQuizzes || 0;
  const correctAnswers = quizStats.totalCorrect || 0;
  const totalAnswers = quizStats.totalAnswered || 0;
  const accuracy = totalAnswers > 0 ? Math.round((correctAnswers / totalAnswers) * 100) : 0;
  const dailyGoalProgress = Math.min(quizStats.todayWords || 0, 10);

  const allBadgeIds = ['first_steps', 'quiz_whiz', 'week_warrior', 'century_club', 'category_master'];

  function getCategoryMastered(catId) {
    const catWords = allWords.filter(w => w.categoryId === catId);
    return catWords.filter(w => (wordProgress[w.id]?.level || 1) >= 5).length;
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50'} p-4 md:p-8`}>
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className={`text-3xl font-bold ${t.accentText} mb-1`}>¡Bienvenido! 🇪🇸</h1>
          <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            {practiced ? "¡Muy bien! You've practiced today! Keep it up! 🔥" : 'Start practicing to keep your streak alive!'}
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Words Learned', value: learnedWords, total: totalWords, emoji: '📚' },
            { label: 'Mastered', value: masteredWords, total: totalWords, emoji: '⭐' },
            { label: 'Quiz Accuracy', value: `${accuracy}%`, emoji: '🎯' },
            { label: 'Quizzes Done', value: totalQuizzes, emoji: '📝' },
          ].map((stat, i) => (
            <div key={i} className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow p-4`}>
              <div className="text-2xl mb-1">{stat.emoji}</div>
              <div className={`text-2xl font-bold ${t.accentText}`}>{stat.value}</div>
              <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{stat.label}</div>
              {stat.total && <div className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>of {stat.total}</div>}
            </div>
          ))}
        </div>

        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow p-6 mb-6`}>
          <div className="flex flex-wrap items-center gap-4 justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold mb-1">Daily Streak</h2>
              <StreakCounter streak={streakData.currentStreak || 0} hasPracticed={practiced} />
            </div>
            <div className="text-right">
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Longest streak: {streakData.longestStreak || 0} days</p>
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Daily Goal (10 words)</h3>
            <ProgressBar value={dailyGoalProgress} max={10} color="bg-orange-500" label="Today's Progress" />
          </div>
        </div>

        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow p-6 mb-6`}>
          <h2 className="text-xl font-bold mb-4">Overall Progress</h2>
          <ProgressBar value={masteredWords} max={totalWords} color={t.progressBar} label="Words Mastered" />
          <div className="mt-4">
            <ProgressBar value={learnedWords} max={totalWords} color="bg-yellow-500" label="Words Seen" />
          </div>
        </div>

        <div className="mb-6">
          <h2 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Categories</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map(cat => (
              <CategoryCard
                key={cat.id}
                category={cat}
                mastered={getCategoryMastered(cat.id)}
                total={cat.words.length}
                onClick={() => { onCategorySelect(cat.id); setCurrentPage('flashcards'); }}
                theme={theme}
              />
            ))}
          </div>
        </div>

        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow p-6`}>
          <h2 className="text-xl font-bold mb-4">🏆 Achievements</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {allBadgeIds.map(id => (
              <BadgeDisplay key={id} badgeId={id} earned={badges.includes(id)} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
