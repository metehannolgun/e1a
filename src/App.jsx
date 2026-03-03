import React, { useState, useCallback, useEffect } from 'react';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Flashcards from './pages/Flashcards';
import QuizPage from './pages/QuizPage';
import Progress from './pages/Progress';
import Settings from './pages/Settings';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useSpacedRepetition } from './hooks/useSpacedRepetition';
import { updateStreak, getTodayKey } from './utils/streakTracker';
import { categories } from './data/vocabulary';
import { themes, defaultTheme } from './data/themes';

export default function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [soundEnabled, setSoundEnabled] = useLocalStorage('soundEnabled', true);
  const [darkMode, setDarkMode] = useLocalStorage('darkMode', false);
  const [theme, setTheme] = useLocalStorage('theme', defaultTheme);
  const [streakData, setStreakData] = useLocalStorage('streakData', { currentStreak: 0, longestStreak: 0, lastPracticeDate: null });
  const [badges, setBadges] = useLocalStorage('badges', []);
  const [quizStats, setQuizStats] = useLocalStorage('quizStats', { totalQuizzes: 0, totalCorrect: 0, totalAnswered: 0, todayWords: 0 });
  const { wordProgress, markKnown, markLearning, getCategoryProgress } = useSpacedRepetition();

  useEffect(() => {
    if (darkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [darkMode]);

  const checkBadges = useCallback((currentWordProgress, currentStreakData, currentBadges) => {
    const newBadges = [...currentBadges];
    let changed = false;

    if (!newBadges.includes('first_steps') && Object.keys(currentWordProgress).length > 0) {
      newBadges.push('first_steps'); changed = true;
    }
    if (!newBadges.includes('century_club') && Object.values(currentWordProgress).filter(p => p.lastSeen).length >= 100) {
      newBadges.push('century_club'); changed = true;
    }
    if (!newBadges.includes('week_warrior') && (currentStreakData.currentStreak || 0) >= 7) {
      newBadges.push('week_warrior'); changed = true;
    }
    if (!newBadges.includes('category_master')) {
      const anyMastered = categories.some(cat => {
        const { total, mastered } = getCategoryProgress(cat.id);
        return total > 0 && mastered === total;
      });
      if (anyMastered) { newBadges.push('category_master'); changed = true; }
    }

    if (changed) setBadges(newBadges);
  }, [getCategoryProgress, setBadges]);

  const handleFlashcardProgress = useCallback((wordId, wasKnown) => {
    const today = getTodayKey();
    const newStreak = updateStreak(streakData);
    setStreakData(newStreak);
    setQuizStats(prev => ({
      ...prev,
      todayWords: (prev.lastPracticeDate === today ? (prev.todayWords || 0) : 0) + 1,
      lastPracticeDate: today,
    }));
    checkBadges(wordProgress, newStreak, badges);
  }, [streakData, setStreakData, setQuizStats, checkBadges, wordProgress, badges]);

  const handleQuizComplete = useCallback((result) => {
    setQuizStats(prev => ({
      ...prev,
      totalQuizzes: (prev.totalQuizzes || 0) + 1,
      totalCorrect: (prev.totalCorrect || 0) + (result.finalScore || 0),
      totalAnswered: (prev.totalAnswered || 0) + (result.total || 0),
    }));

    if (!badges.includes('quiz_whiz') && result.finalScore === result.total && result.total > 0) {
      setBadges(prev => [...prev, 'quiz_whiz']);
    }

    const newStreak = updateStreak(streakData);
    setStreakData(newStreak);
    checkBadges(wordProgress, newStreak, badges);
  }, [badges, setBadges, streakData, setStreakData, checkBadges, wordProgress]);

  const handleResetProgress = useCallback(() => {
    localStorage.clear();
    window.location.reload();
  }, []);

  const pages = {
    dashboard: (
      <Dashboard
        wordProgress={wordProgress}
        streakData={streakData}
        badges={badges}
        quizStats={quizStats}
        setCurrentPage={setCurrentPage}
        onCategorySelect={setSelectedCategory}
        darkMode={darkMode}
        theme={theme}
      />
    ),
    flashcards: (
      <Flashcards
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        onProgress={handleFlashcardProgress}
        soundEnabled={soundEnabled}
        darkMode={darkMode}
        theme={theme}
      />
    ),
    quiz: (
      <QuizPage
        onQuizComplete={handleQuizComplete}
        darkMode={darkMode}
        theme={theme}
      />
    ),
    progress: (
      <Progress
        wordProgress={wordProgress}
        streakData={streakData}
        badges={badges}
        quizStats={quizStats}
        darkMode={darkMode}
        theme={theme}
      />
    ),
    settings: (
      <Settings
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        theme={theme}
        setTheme={setTheme}
        onResetProgress={handleResetProgress}
      />
    ),
  };

  return (
    <div className={darkMode ? 'dark' : ''}>
      <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} darkMode={darkMode} theme={theme} />
      {pages[currentPage] || pages.dashboard}
    </div>
  );
}
