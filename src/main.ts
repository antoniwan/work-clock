import './style.css';
import { getSchedule, saveSchedule, type WorkSchedule } from './schedule';
import { updateDisplay } from './display';
import { getMsUntilNextMinute } from './time-calculator';
import { drawFestiveCanvas } from './canvas-drawing';

let schedule: WorkSchedule = getSchedule();
let updateTimeoutId: number | null = null;

function updateThemeIcon(): void {
  const themeToggle = document.getElementById('toggle-theme');
  if (!themeToggle) return;
  
  const isDark = document.documentElement.classList.contains('dark-mode');
  const isLight = document.documentElement.classList.contains('light-mode');
  
  if (isDark) {
    themeToggle.textContent = '🌙';
    themeToggle.title = 'Dark mode (click for light)';
  } else if (isLight) {
    themeToggle.textContent = '☀️';
    themeToggle.title = 'Light mode (click for system)';
  } else {
    themeToggle.textContent = '🌓';
    themeToggle.title = 'System theme (click for dark)';
  }
}

function initializeTheme(): void {
  const themeToggle = document.getElementById('toggle-theme');
  if (!themeToggle) return;

  // Initialize theme from stored preference or system preference
  const storedTheme = schedule.darkMode;
  if (storedTheme === true) {
    document.documentElement.classList.add('dark-mode');
  } else if (storedTheme === false) {
    document.documentElement.classList.add('light-mode');
  } else {
    // Use system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (prefersDark) {
      document.documentElement.classList.add('dark-mode');
    }
  }

  // Update icon based on initial state
  updateThemeIcon();

  // Listen for system theme changes (only if using system preference)
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (schedule.darkMode === undefined) {
      document.documentElement.classList.remove('dark-mode', 'light-mode');
      if (e.matches) {
        document.documentElement.classList.add('dark-mode');
      }
      updateThemeIcon();
    }
  });

  // Toggle theme on button click
  themeToggle.addEventListener('click', () => {
    const isDark = document.documentElement.classList.contains('dark-mode');
    const isLight = document.documentElement.classList.contains('light-mode');
    
    document.documentElement.classList.remove('dark-mode', 'light-mode');
    
    if (isDark) {
      // Switch to light mode
      document.documentElement.classList.add('light-mode');
      schedule.darkMode = false;
    } else if (isLight) {
      // Switch to system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        document.documentElement.classList.add('dark-mode');
      }
      schedule.darkMode = undefined;
    } else {
      // Currently using system, switch to dark
      document.documentElement.classList.add('dark-mode');
      schedule.darkMode = true;
    }
    
    saveSchedule(schedule);
    updateThemeIcon();
  });
}

function initializeConfigForm(): void {
  const toggleButton = document.getElementById('toggle-config');
  const configForm = document.getElementById('config-form');
  const saveButton = document.getElementById('save-config');
  
  if (!toggleButton || !configForm || !saveButton) return;

  // Toggle form visibility
  toggleButton.addEventListener('click', () => {
    configForm.classList.toggle('hidden');
    if (!configForm.classList.contains('hidden')) {
      populateConfigForm();
    }
  });

  // Populate form with current schedule
  populateConfigForm();

  // Save configuration
  saveButton.addEventListener('click', () => {
    const newSchedule = readConfigForm();
    if (newSchedule) {
      schedule = newSchedule;
      saveSchedule(schedule);
      configForm.classList.add('hidden');
      updateDisplay(schedule);
    }
  });
}

function populateConfigForm(): void {
  // Set day checkboxes
  schedule.days.forEach((isWorkDay, index) => {
    const checkbox = document.querySelector<HTMLInputElement>(`input[data-day="${index}"]`);
    if (checkbox) {
      checkbox.checked = isWorkDay;
    }
  });

  // Set times
  const startTimeInput = document.getElementById('start-time') as HTMLInputElement;
  const endTimeInput = document.getElementById('end-time') as HTMLInputElement;
  if (startTimeInput) startTimeInput.value = schedule.startTime;
  if (endTimeInput) endTimeInput.value = schedule.endTime;

  // Set emoji mode
  const emojiModeCheckbox = document.getElementById('emoji-mode') as HTMLInputElement;
  if (emojiModeCheckbox) {
    emojiModeCheckbox.checked = schedule.emojiMode ?? false;
  }
}

function readConfigForm(): WorkSchedule | null {
  const days: boolean[] = [];
  for (let i = 0; i < 7; i++) {
    const checkbox = document.querySelector<HTMLInputElement>(`input[data-day="${i}"]`);
    days.push(checkbox?.checked ?? false);
  }

  const startTimeInput = document.getElementById('start-time') as HTMLInputElement;
  const endTimeInput = document.getElementById('end-time') as HTMLInputElement;
  const emojiModeCheckbox = document.getElementById('emoji-mode') as HTMLInputElement;

  if (!startTimeInput || !endTimeInput) return null;

  return {
    days,
    startTime: startTimeInput.value,
    endTime: endTimeInput.value,
    emojiMode: emojiModeCheckbox?.checked ?? false,
  };
}

function scheduleNextUpdate(): void {
  if (updateTimeoutId !== null) {
    clearTimeout(updateTimeoutId);
  }

  updateDisplay(schedule);
  
  const msUntilNext = getMsUntilNextMinute();
  updateTimeoutId = window.setTimeout(() => {
    scheduleNextUpdate();
  }, msUntilNext);
}

// Handle canvas resize
function setupCanvasResize(): void {
  const canvasElement = document.getElementById('festive-canvas') as HTMLCanvasElement | null;
  if (!canvasElement) return;

  const resizeHandler = () => {
    if (canvasElement.style.display !== 'none') {
      drawFestiveCanvas(canvasElement);
    }
  };

  window.addEventListener('resize', resizeHandler);
}

// Initialize app
function init(): void {
  initializeTheme();
  initializeConfigForm();
  setupCanvasResize();
  updateDisplay(schedule);
  scheduleNextUpdate();
}

// Start the app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
