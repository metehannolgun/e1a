# SpanishEasy 🇪🇸

A complete Spanish (Spain) language learning web app built with React + Vite and Tailwind CSS.

## Features

- 📚 **Vocabulary Flashcards** — 6 categories with 15-20 words each, flip animation, pronunciation
- 🔊 **Spain Spanish Pronunciation** — Web Speech API with `es-ES` locale
- 🧠 **Spaced Repetition** — Leitner-style system tracking word mastery levels 1-5
- 📝 **Quizzes** — Multiple choice and fill-in-the-blank
- 📊 **Progress Dashboard** — Stats, streaks, per-category progress
- 🎮 **Gamification** — Daily goals, streak counter, achievement badges
- 🎨 **Responsive UI** — Spanish-inspired red/yellow/orange color theme, dark mode

## Getting Started

```bash
npm install
npm run dev
```

Then open http://localhost:5173 in your browser.

## Tech Stack

- **React 18** + **Vite**
- **Tailwind CSS**
- **localStorage** for persistence
- **Web Speech API** (`es-ES`) for pronunciation

## Vocabulary Categories

| Category | Description | Words |
|----------|-------------|-------|
| 👋 Saludos | Greetings | 18 |
| 🍽️ Comida | Food | 18 |
| ✈️ Viajes | Travel | 18 |
| 🔢 Números | Numbers | 19 |
| 💬 Frases Comunes | Common Phrases | 18 |
| 👨‍👩‍👧‍👦 Familia | Family | 18 |

## Future Roadmap

- Audio recordings for all words
- Conjugation practice
- Story mode with full sentences
- Leaderboard / social features
- iOS/Android PWA support
