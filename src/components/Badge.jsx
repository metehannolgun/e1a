import React from 'react';

const BADGE_DEFINITIONS = {
  first_steps: { emoji: '👣', name: 'First Steps', description: 'Complete your first flashcard session' },
  quiz_whiz: { emoji: '🏆', name: 'Quiz Whiz', description: 'Score 100% on a quiz' },
  week_warrior: { emoji: '🔥', name: 'Week Warrior', description: '7-day streak' },
  century_club: { emoji: '💯', name: 'Century Club', description: 'Practice 100 words' },
  category_master: { emoji: '⭐', name: 'Category Master', description: 'Master all words in a category' },
};

export function BadgeDisplay({ badgeId, earned = false }) {
  const badge = BADGE_DEFINITIONS[badgeId];
  if (!badge) return null;
  return (
    <div className={`flex flex-col items-center p-3 rounded-xl border-2 transition-all ${
      earned 
        ? 'border-yellow-400 bg-yellow-50 dark:bg-yellow-900/20' 
        : 'border-gray-200 bg-gray-50 dark:bg-gray-800 opacity-50 grayscale'
    }`}>
      <span className="text-3xl mb-1">{badge.emoji}</span>
      <span className="font-semibold text-sm text-center">{badge.name}</span>
      <span className="text-xs text-gray-500 text-center mt-1">{badge.description}</span>
      {earned && <span className="text-xs text-green-600 font-bold mt-1">✓ Earned!</span>}
    </div>
  );
}

export { BADGE_DEFINITIONS };
