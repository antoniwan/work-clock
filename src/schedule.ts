export interface WorkSchedule {
  days: boolean[]; // [Mon, Tue, Wed, Thu, Fri, Sat, Sun]
  startTime: string; // "HH:MM" format
  endTime: string; // "HH:MM" format
  emojiMode?: boolean; // Optional emoji mode preference
  darkMode?: boolean; // Optional dark mode preference (null = system, true = dark, false = light)
}

const STORAGE_KEY = 'work-clock-schedule';

const DEFAULT_SCHEDULE: WorkSchedule = {
  days: [true, true, true, true, true, false, false], // Mon-Fri
  startTime: '08:00',
  endTime: '17:00',
  emojiMode: false,
};

export function getSchedule(): WorkSchedule {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      // If parsing fails, return default
    }
  }
  return { ...DEFAULT_SCHEDULE };
}

export function saveSchedule(schedule: WorkSchedule): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(schedule));
}

export function getDefaultSchedule(): WorkSchedule {
  return { ...DEFAULT_SCHEDULE };
}

