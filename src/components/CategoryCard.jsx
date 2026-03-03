import React from 'react';
import ProgressBar from './ProgressBar';
import { themes, defaultTheme } from '../data/themes';

export default function CategoryCard({ category, mastered, total, onClick, theme }) {
  const t = themes[theme] || themes[defaultTheme];
  return (
    <div
      onClick={onClick}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all border border-gray-100 dark:border-gray-700"
    >
      <div className="flex items-center gap-3 mb-3">
        <span className="text-3xl">{category.emoji}</span>
        <div>
          <h3 className="font-bold text-gray-800 dark:text-white">{category.name}</h3>
          <p className="text-sm text-gray-500">{category.description}</p>
        </div>
      </div>
      <ProgressBar value={mastered} max={total} color={t.progressBar} label="Mastered" />
    </div>
  );
}
