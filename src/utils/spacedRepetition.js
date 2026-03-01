export function getInitialWordProgress(wordId) {
  return {
    wordId,
    level: 1,
    nextReview: 0,
    timesCorrect: 0,
    timesIncorrect: 0,
    lastSeen: null,
  };
}

export function promoteWord(progress) {
  const newLevel = Math.min(5, progress.level + 1);
  return {
    ...progress,
    level: newLevel,
    timesCorrect: progress.timesCorrect + 1,
    lastSeen: Date.now(),
    nextReview: Date.now() + levelToInterval(newLevel),
  };
}

export function demoteWord(progress) {
  const newLevel = Math.max(1, progress.level - 1);
  return {
    ...progress,
    level: newLevel,
    timesIncorrect: progress.timesIncorrect + 1,
    lastSeen: Date.now(),
    nextReview: Date.now() + levelToInterval(newLevel),
  };
}

function levelToInterval(level) {
  const intervals = {
    1: 0,
    2: 1 * 24 * 60 * 60 * 1000,
    3: 3 * 24 * 60 * 60 * 1000,
    4: 7 * 24 * 60 * 60 * 1000,
    5: 14 * 24 * 60 * 60 * 1000,
  };
  return intervals[level] || 0;
}

export function isDueForReview(progress) {
  if (!progress) return true;
  return Date.now() >= (progress.nextReview || 0);
}

export function sortByPriority(words, wordProgressMap) {
  return [...words].sort((a, b) => {
    const progA = wordProgressMap[a.id] || getInitialWordProgress(a.id);
    const progB = wordProgressMap[b.id] || getInitialWordProgress(b.id);
    if (progA.level !== progB.level) return progA.level - progB.level;
    return (progA.lastSeen || 0) - (progB.lastSeen || 0);
  });
}
