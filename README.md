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

## Project Structure

```
src/
├── main.ts           # App initialization and event handlers
├── display.ts        # Display update logic
├── schedule.ts       # Schedule data and localStorage management
├── time-calculator.ts # Time calculation utilities
├── languages.ts      # Language localization system
├── canvas-drawing.ts # Festive animation canvas
└── style.css         # Styling with dark/light mode support
```

## Technology

- **TypeScript** - Type-safe development
- **Vite** - Fast development server and build tool
- **Vanilla JavaScript** - No frameworks, lightweight and simple
- **Canvas API** - For festive animations
- **localStorage** - Client-side persistence

---

Thanks to Mia Luna for asking me every 5 minutes if I'm done with work for today—bless your heart, my love. ❤️
