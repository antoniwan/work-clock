# Work Clock ⏰

A simple web application that displays the time remaining until your work day ends.

## Features

- ⏱️ Shows countdown timer until work ends
- 📅 Configurable work days (Monday through Sunday)
- ⚙️ Customizable start and end times
- 🎨 Festive canvas animation when work is done or on non-work days
- 😊 Optional emoji mode for a friendlier display
- 💾 Saves your schedule to browser localStorage

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

1. Click the ⚙️ button to open the configuration panel
2. Select your work days by checking the day boxes
3. Set your start and end times
4. Optionally enable emoji mode
5. Click Save to apply your schedule

The display updates automatically every minute. On non-work days or after work ends, a festive animation appears.

## Technology

- TypeScript
- Vite
- Vanilla JavaScript (no frameworks)

---

Thanks to Mia Luna for asking me every 5 minutes if I'm done with work for today—bless your heart, my love. ❤️
