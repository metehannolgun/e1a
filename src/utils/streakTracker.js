export function getTodayKey() {
  return new Date().toISOString().split('T')[0];
}

export function getYesterdayKey() {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return yesterday.toISOString().split('T')[0];
}

export function updateStreak(streakData) {
  const today = getTodayKey();
  const yesterday = getYesterdayKey();

  if (streakData.lastPracticeDate === today) {
    return streakData;
  }

  if (streakData.lastPracticeDate === yesterday) {
    return {
      ...streakData,
      currentStreak: streakData.currentStreak + 1,
      lastPracticeDate: today,
      longestStreak: Math.max(streakData.longestStreak || 0, streakData.currentStreak + 1),
    };
  }

  return {
    ...streakData,
    currentStreak: 1,
    lastPracticeDate: today,
    longestStreak: Math.max(streakData.longestStreak || 0, 1),
  };
}

export function hasPracticedToday(streakData) {
  return streakData.lastPracticeDate === getTodayKey();
}
