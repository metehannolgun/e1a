import React, { useState } from 'react';
import { allWords, categories } from '../data/vocabulary';
import { themes, defaultTheme } from '../data/themes';

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function generateMCQuestion(word, pool) {
  const wrong = shuffle(pool.filter(w => w.id !== word.id)).slice(0, 3);
  const options = shuffle([word, ...wrong]);
  return { word, options, correctId: word.id, type: 'mc' };
}

function MultipleChoiceQuiz({ questions, onComplete, darkMode, theme }) {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const t = themes[theme] || themes[defaultTheme];

  const q = questions[current];

  function handleSelect(option) {
    if (showFeedback) return;
    const correct = option.id === q.correctId;
    setSelected(option.id);
    setShowFeedback(true);
    setAnswered(a => a + 1);
    if (correct) setScore(s => s + 1);
  }

  function handleNext() {
    const isLast = current + 1 >= questions.length;
    const finalScore = score + (selected === q.correctId ? 1 : 0);
    if (isLast) {
      onComplete({ finalScore, total: questions.length, type: 'mc' });
    } else {
      setCurrent(c => c + 1);
      setSelected(null);
      setShowFeedback(false);
    }
  }

  const isCorrect = selected === q.correctId;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          Question {current + 1} of {questions.length}
        </span>
        <span className="font-bold text-green-600">Score: {score}/{answered}</span>
      </div>

      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-lg p-6 mb-4`}>
        <p className={`text-sm mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>What does this mean in English?</p>
        <p className={`text-4xl font-bold ${t.accentText} mb-6 text-center`}>{q.word.spanish}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {q.options.map(option => {
            let btnClass = 'p-3 rounded-xl border-2 text-left transition-all font-medium ';
            if (!showFeedback) {
              btnClass += darkMode ? `border-gray-600 ${t.quizHoverBorder} text-white` : `border-gray-200 ${t.quizHoverBorder}`;
            } else if (option.id === q.correctId) {
              btnClass += 'border-green-500 bg-green-50 text-green-700';
            } else if (option.id === selected) {
              btnClass += 'border-red-500 bg-red-50 text-red-700';
            } else {
              btnClass += darkMode ? 'border-gray-600 text-gray-500' : 'border-gray-200 text-gray-400';
            }
            return (
              <button key={option.id} onClick={() => handleSelect(option)} className={btnClass}>
                {option.english}
              </button>
            );
          })}
        </div>
      </div>

      {showFeedback && (
        <div className={`mb-4 p-4 rounded-xl ${isCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {isCorrect ? '¡Muy bien! 🎉' : `Lo siento. The answer was: ${q.word.english}`}
        </div>
      )}

      {showFeedback && (
        <button onClick={handleNext} className={`w-full py-3 ${t.buttonBg} text-white rounded-xl font-bold ${t.buttonHover} transition-colors`}>
          {current + 1 >= questions.length ? 'See Results' : 'Next Question →'}
        </button>
      )}
    </div>
  );
}

function FillInBlankQuiz({ questions, onComplete, darkMode, theme }) {
  const [current, setCurrent] = useState(0);
  const [input, setInput] = useState('');
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const t = themes[theme] || themes[defaultTheme];

  const q = questions[current];

  function normalize(str) {
    return str.trim().toLowerCase()
      .replace(/[áàä]/g, 'a')
      .replace(/[éèë]/g, 'e')
      .replace(/[íìï]/g, 'i')
      .replace(/[óòö]/g, 'o')
      .replace(/[úùü]/g, 'u')
      .replace(/ñ/g, 'n')
      .replace(/[¿¡]/g, '');
  }

  const isCorrect = normalize(input) === normalize(q.word.spanish);

  function handleSubmit(e) {
    e.preventDefault();
    if (showFeedback) return;
    if (isCorrect) setScore(s => s + 1);
    setShowFeedback(true);
  }

  function handleNext() {
    const isLast = current + 1 >= questions.length;
    if (isLast) {
      onComplete({ finalScore: score, total: questions.length, type: 'fill' });
    } else {
      setCurrent(c => c + 1);
      setInput('');
      setShowFeedback(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          Question {current + 1} of {questions.length}
        </span>
        <span className="font-bold text-green-600">Score: {score}/{current + (showFeedback ? 1 : 0)}</span>
      </div>

      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-lg p-6 mb-4`}>
        <p className={`text-sm mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Type the Spanish translation:</p>
        <p className="text-4xl font-bold text-gray-800 dark:text-white mb-6 text-center">{q.word.english}</p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            disabled={showFeedback}
            placeholder="Type in Spanish..."
            className={`w-full p-3 rounded-xl border-2 text-lg outline-none ${
              showFeedback
                ? isCorrect ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'
                : `border-gray-300 ${t.inputFocusBorder}`
            } ${darkMode ? 'bg-gray-700 text-white' : ''}`}
            autoComplete="off"
          />
          {!showFeedback && (
            <button type="submit" className={`w-full mt-3 py-3 ${t.buttonBg} text-white rounded-xl font-bold ${t.buttonHover} transition-colors`}>
              Check Answer
            </button>
          )}
        </form>
      </div>

      {showFeedback && (
        <div className={`mb-4 p-4 rounded-xl ${isCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {isCorrect ? '¡Excelente! 🎉' : `Lo siento. The correct answer is: "${q.word.spanish}"`}
        </div>
      )}

      {showFeedback && (
        <button onClick={handleNext} className={`w-full py-3 ${t.buttonBg} text-white rounded-xl font-bold ${t.buttonHover} transition-colors`}>
          {current + 1 >= questions.length ? 'See Results' : 'Next Question →'}
        </button>
      )}
    </div>
  );
}

function ResultsScreen({ result, onRestart, darkMode, theme }) {
  const t = themes[theme] || themes[defaultTheme];
  const pct = Math.round((result.finalScore / result.total) * 100);
  const msg = pct === 100 ? '¡Perfecto! 🏆' : pct >= 80 ? '¡Muy bien! 🎉' : pct >= 60 ? '¡Sigue así! 💪' : 'Keep practicing! 📖';
  return (
    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-lg p-8 text-center max-w-md mx-auto`}>
      <div className="text-6xl mb-4">{pct === 100 ? '🏆' : pct >= 80 ? '⭐' : '📚'}</div>
      <h2 className="text-3xl font-bold mb-2">{msg}</h2>
      <p className={`text-5xl font-bold ${t.accentText} mb-2`}>{result.finalScore}/{result.total}</p>
      <p className={`text-xl mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{pct}% correct</p>
      <button onClick={onRestart} className={`px-8 py-3 ${t.buttonBg} text-white rounded-xl font-bold ${t.buttonHover} transition-colors`}>
        Try Again
      </button>
    </div>
  );
}

export default function QuizPage({ onQuizComplete, darkMode, theme }) {
  const t = themes[theme] || themes[defaultTheme];
  const [quizType, setQuizType] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [result, setResult] = useState(null);
  const [selectedCat, setSelectedCat] = useState('all');

  function startQuiz(type) {
    const wordPool = selectedCat === 'all'
      ? allWords
      : allWords.filter(w => w.categoryId === selectedCat);
    const picked = shuffle(wordPool).slice(0, Math.min(10, wordPool.length));
    const pool = wordPool.length >= 4 ? wordPool : allWords;
    if (type === 'mc') {
      setQuestions(picked.map(w => generateMCQuestion(w, pool)));
    } else {
      setQuestions(picked.map(w => ({ word: w, type: 'fill' })));
    }
    setQuizType(type);
    setResult(null);
  }

  function handleComplete(res) {
    setResult(res);
    onQuizComplete(res);
  }

  function handleRestart() {
    setQuizType(null);
    setResult(null);
    setQuestions([]);
  }

  if (result) {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50'} p-4 md:p-8`}>
        <ResultsScreen result={result} onRestart={handleRestart} darkMode={darkMode} theme={theme} />
      </div>
    );
  }

  if (quizType === 'mc') {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50'} p-4 md:p-8`}>
        <MultipleChoiceQuiz questions={questions} onComplete={handleComplete} darkMode={darkMode} theme={theme} />
      </div>
    );
  }

  if (quizType === 'fill') {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50'} p-4 md:p-8`}>
        <FillInBlankQuiz questions={questions} onComplete={handleComplete} darkMode={darkMode} theme={theme} />
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50'} p-4 md:p-8`}>
      <div className="max-w-2xl mx-auto">
        <h1 className={`text-3xl font-bold ${t.accentText} mb-2`}>🧠 Quizzes</h1>
        <p className={`mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Test your Spanish knowledge!</p>

        <div className="mb-6">
          <label className={`block font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Choose Category:</label>
          <select
            value={selectedCat}
            onChange={e => setSelectedCat(e.target.value)}
            className={`w-full p-3 rounded-xl border-2 border-gray-300 ${darkMode ? 'bg-gray-800 text-white' : 'bg-white'}`}
          >
            <option value="all">All Categories</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.emoji} {c.name}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={() => startQuiz('mc')}
            className={`p-6 bg-gradient-to-br ${t.mcGradient} text-white rounded-2xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-1`}
          >
            <div className="text-4xl mb-2">🎯</div>
            <h2 className="text-xl font-bold mb-1">Multiple Choice</h2>
            <p className="text-sm opacity-80">Pick the correct translation from 4 options</p>
          </button>
          <button
            onClick={() => startQuiz('fill')}
            className="p-6 bg-gradient-to-br from-yellow-400 to-amber-500 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
          >
            <div className="text-4xl mb-2">✏️</div>
            <h2 className="text-xl font-bold mb-1">Fill in the Blank</h2>
            <p className="text-sm opacity-80">Type the Spanish translation</p>
          </button>
        </div>
      </div>
    </div>
  );
}
