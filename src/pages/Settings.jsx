import React, { useState } from 'react';
import { themes, defaultTheme } from '../data/themes';

export default function Settings({ soundEnabled, setSoundEnabled, darkMode, setDarkMode, theme, setTheme, onResetProgress }) {
  const [showConfirm, setShowConfirm] = useState(false);
  const t = themes[theme] || themes[defaultTheme];

  function handleReset() {
    if (showConfirm) {
      onResetProgress();
      setShowConfirm(false);
    } else {
      setShowConfirm(true);
    }
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50'} p-4 md:p-8`}>
      <div className="max-w-2xl mx-auto">
        <h1 className={`text-3xl font-bold ${t.accentText} mb-6`}>⚙️ Settings</h1>

        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-100'}`}>
          <div className="p-5 flex items-center justify-between">
            <div>
              <p className="font-semibold">🔊 Sound</p>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Enable pronunciation audio</p>
            </div>
            <button
              onClick={() => setSoundEnabled(s => !s)}
              className={`w-14 h-7 rounded-full transition-colors relative ${soundEnabled ? t.toggleActive : 'bg-gray-300'}`}
            >
              <span className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform ${soundEnabled ? 'translate-x-7' : 'translate-x-0.5'}`} />
            </button>
          </div>

          <div className="p-5 flex items-center justify-between">
            <div>
              <p className="font-semibold">🌙 Dark Mode</p>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Switch to dark theme</p>
            </div>
            <button
              onClick={() => setDarkMode(d => !d)}
              className={`w-14 h-7 rounded-full transition-colors relative ${darkMode ? t.toggleActive : 'bg-gray-300'}`}
            >
              <span className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform ${darkMode ? 'translate-x-7' : 'translate-x-0.5'}`} />
            </button>
          </div>

          <div className="p-5">
            <p className="font-semibold mb-3">🎨 Color Theme</p>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
              {Object.entries(themes).map(([key, th]) => (
                <button
                  key={key}
                  onClick={() => setTheme(key)}
                  className={`flex flex-col items-center gap-1 p-2 rounded-xl border-2 transition-all ${
                    theme === key
                      ? 'border-gray-800 dark:border-white scale-105'
                      : 'border-transparent hover:border-gray-300'
                  }`}
                  title={th.name}
                >
                  <span className={`w-8 h-8 rounded-full ${th.swatch} ${theme === key ? 'ring-2 ring-offset-2 ring-gray-600' : ''}`} />
                  <span className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{th.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="p-5">
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="font-semibold">🔄 Reset Progress</p>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Clear all learning data</p>
              </div>
              <button
                onClick={handleReset}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  showConfirm ? t.resetBtnActive : t.resetBtnDefault
                }`}
              >
                {showConfirm ? 'Confirm Reset' : 'Reset'}
              </button>
            </div>
            {showConfirm && (
              <div className={`mt-2 p-3 ${t.resetWarning} rounded-lg text-sm`}>
                ⚠️ This will delete all your progress, streaks, and badges. Are you sure?{' '}
                <button onClick={() => setShowConfirm(false)} className="underline">Cancel</button>
              </div>
            )}
          </div>
        </div>

        <div className={`mt-6 p-4 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow`}>
          <h2 className="font-bold mb-2">ℹ️ About SpanishEasy</h2>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            SpanishEasy uses Spain Spanish (es-ES) pronunciation and vocabulary.
            Powered by React + Vite + Tailwind CSS.
          </p>
        </div>
      </div>
    </div>
  );
}
