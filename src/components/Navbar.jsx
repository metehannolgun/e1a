import React, { useState } from 'react';
import { themes, defaultTheme } from '../data/themes';

export default function Navbar({ currentPage, setCurrentPage, darkMode, theme }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const t = themes[theme] || themes[defaultTheme];

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', emoji: '🏠' },
    { id: 'flashcards', label: 'Flashcards', emoji: '📚' },
    { id: 'quiz', label: 'Quiz', emoji: '🧠' },
    { id: 'progress', label: 'Progress', emoji: '📊' },
    { id: 'settings', label: 'Settings', emoji: '⚙️' },
  ];

  return (
    <nav className={`${darkMode ? 'bg-gray-900 text-white' : `${t.navBg} text-white`} shadow-lg`}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setCurrentPage('dashboard')}>
            <span className="text-2xl">🇪🇸</span>
            <span className="font-bold text-xl">SpanishEasy</span>
          </div>
          
          <div className="hidden md:flex gap-1">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  currentPage === item.id
                    ? `bg-white ${t.navActiveText}`
                    : t.navHover
                }`}
              >
                {item.emoji} {item.label}
              </button>
            ))}
          </div>

          <button
            className={`md:hidden p-2 rounded-lg ${t.navHover}`}
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? '✕' : '☰'}
          </button>
        </div>

        {mobileOpen && (
          <div className="md:hidden pb-3 flex flex-col gap-1">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => { setCurrentPage(item.id); setMobileOpen(false); }}
                className={`px-3 py-2 rounded-lg text-sm font-medium text-left transition-colors ${
                  currentPage === item.id
                    ? `bg-white ${t.navActiveText}`
                    : t.navHover
                }`}
              >
                {item.emoji} {item.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
