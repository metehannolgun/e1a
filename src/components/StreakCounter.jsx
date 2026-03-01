import React from 'react';

export default function StreakCounter({ streak, hasPracticed }) {
  return (
    <div className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-lg ${
      streak > 0 ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-400'
    }`}>
      <span>{streak > 0 ? '🔥' : '💤'}</span>
      <span>{streak} day{streak !== 1 ? 's' : ''}</span>
      {hasPracticed && <span className="text-sm text-green-600">✓</span>}
    </div>
  );
}
