# Work Clock ⏰

A simple web application that displays the time remaining until your work day ends. Perfect for quick glances to see how much work time is left in your day.

## Features

- ⏱️ **Countdown Timer** - Shows time remaining until work ends (updates every minute)
- 📅 **Flexible Schedule** - Configure work days (Monday through Sunday)
- ⏰ **Custom Hours** - Set your start and end times
- 🎨 **Festive Animation** - Canvas animation appears when work is done or on non-work days
- 😊 **Emoji Mode** - Optional emoji-only display for a friendlier, minimal interface
- 🌐 **Multi-language** - Toggle between English (USA) 🇺🇸 and Spanish (Puerto Rico) 🇵🇷
- 🌓 **Theme Support** - Dark mode, light mode, or system preference
- 💾 **Persistent Settings** - All preferences saved to browser localStorage

## Getting Started

### Prerequisites

- Node.js
- pnpm (or npm/yarn)

### Installation

1. Install dependencies:
```bash
pnpm install
```

2. Start the development server:
```bash
pnpm dev
```

3. Open your browser to the URL shown in the terminal (usually `http://localhost:5173`)

### Building

To build for production:
```bash
pnpm build
```

To preview the production build:
```bash
pnpm preview
```

## Usage

### Quick Controls

Three toggle buttons are available in the top-right corner:

- **🇺🇸/🇵🇷 Language Toggle** - Click to cycle between English (USA) and Spanish (Puerto Rico)
- **🌓/🌙/☀️ Theme Toggle** - Click to cycle through system theme, dark mode, and light mode
- **⚙️ Settings** - Click to open the configuration panel

### Configuring Your Schedule

1. Click the ⚙️ button to open the configuration panel
2. Select your work days by checking the day boxes (Mon-Sun)
3. Set your start and end times using the time inputs
4. Optionally enable emoji mode for a simpler display
5. Click Save to apply your schedule

### Display States

- **During Work Hours**: Shows countdown (e.g., "3 hours 45 minutes" or 💼 in emoji mode)
- **Work Complete**: Shows "WORK DONE!" with festive animation
- **Non-Work Day**: Shows "NO WORK TODAY!" with festive animation

The display updates automatically every minute. All settings (schedule, language, theme) are saved automatically.

## Adding Your Own Language

The app uses a simple language object system in `src/languages.ts`. To add a new language:

1. **Add your language code** to the `LanguageCode` type:
   ```typescript
   export type LanguageCode = 'en-US' | 'es-PR' | 'your-code';
   ```

2. **Add your language object** to the `languages` record with all required strings:
   ```typescript
   'your-code': {
     code: 'your-code',
     flag: '🏳️',  // Your flag emoji
     name: 'Your Language Name',
     strings: {
       themeDarkTitle: '...',
       themeLightTitle: '...',
       themeSystemTitle: '...',
       settingsTitle: '...',
       workSchedule: '...',
       workDays: '...',
       startTime: '...',
       endTime: '...',
       emojiMode: '...',
       save: '...',
       days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], // Your day abbreviations
       noWorkToday: '...',
       workDone: '...',
       hour: '...',
       hours: '...',
       minute: '...',
       minutes: '...',
     },
   },
   ```

3. **Update the validation** in `getCurrentLanguage()` to include your new code:
   ```typescript
   if (stored && (stored === 'en-US' || stored === 'es-PR' || stored === 'your-code')) {
   ```

That's it! The language toggle will automatically include your new language in the cycle.

## Architecture

The app is built with a modular TypeScript structure. The core logic is separated into focused modules: `main.ts` handles initialization and UI interactions, `display.ts` manages the countdown display, `schedule.ts` handles data persistence, and `time-calculator.ts` performs time calculations. The language system in `languages.ts` uses simple objects (no external files), making it easy to add new languages. Styling supports system-aware dark/light modes, and the festive canvas animation uses the Canvas API for visual feedback when work is complete.

## Technology

- **TypeScript** - Type-safe development
- **Vite** - Fast development server and build tool
- **Vanilla JavaScript** - No frameworks, lightweight and simple
- **Canvas API** - For festive animations
- **localStorage** - Client-side persistence

---

Thanks to Mia Luna for asking me every 5 minutes if I'm done with work for today—bless your heart, my love. ❤️
