import React from 'react';

export default function ProgressBar({ value, max, color = 'bg-red-500', showLabel = true, label = '' }) {
  const percentage = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between text-sm mb-1">
          <span>{label}</span>
          <span>{value}/{max} ({percentage}%)</span>
        </div>
      )}
      <div className="w-full bg-gray-200 rounded-full h-3 dark:bg-gray-700">
        <div
          className={`${color} h-3 rounded-full transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
