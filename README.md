# musique 🎵

A responsive, portfolio-quality music player web application featuring a modern, soft neumorphic user interface built with React, Zustand, and the native HTML5 Audio API.

---

## ✨ Features

- **Soft Neumorphic UI**: Precision CSS dual-shadow elevation with an accent playback palette.
- **Audio Engine Architecture**: Clean separation between React components and browser audio playback using a dedicated JavaScript Audio Engine.
- **Global State Management**: Powered by Zustand for predictable playback and playlist state without unnecessary re-renders.
- **Full Playback Controls**: Play, pause, previous track, next track, shuffle, and cycle repeat modes (off / repeat all / repeat one).
- **Interactive Timeline & Volume**: Scrubbable seek bar with live time formatting and volume controls with mute toggle.
- **Accessible & Responsive**: Fully semantic controls, visible focus indicators, `aria-*` state attributes, and mobile-to-desktop responsive layouts.

---

## 🛠️ Tech Stack

- **Frontend Framework**: React (Functional Components & Hooks)
- **State Management**: Zustand
- **Audio Handling**: Native HTML5 Audio API (Single `HTMLAudioElement` engine)
- **Styling**: Plain CSS with CSS Custom Properties (Design Tokens)
- **Icons**: Lucide React
- **Build Tool**: Vite

---

## 🏛️ Architecture

`musique` enforces a strict unidirectional data flow:

```text
React UI Components
        ↓ (dispatches user actions)
Zustand Store Actions
        ↓ (synchronizes state changes)
usePlayerSync Hook
        ↓ (executes playback commands)
Audio Engine (audioEngine.js)
        ↓
HTMLAudioElement (Native Browser Audio)