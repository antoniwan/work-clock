import './style.css';
import { getSchedule, saveSchedule, type WorkSchedule } from './schedule';
import { updateDisplay } from './display';
import { getMsUntilNextMinute } from './time-calculator';
import { drawFestiveCanvas } from './canvas-drawing';
import {
  getCurrentLanguage,
  setCurrentLanguage,
  getLanguageStrings,
  getNextLanguage,
  languages,
} from './languages';

let schedule: WorkSchedule = getSchedule();
let updateTimeoutId: number | null = null;

function updateThemeIcon(): void {
  const themeToggle = document.getElementById('toggle-theme');
  if (!themeToggle) return;
  
  const strings = getLanguageStrings();
  const isDark = document.documentElement.classList.contains('dark-mode');
  const isLight = document.documentElement.classList.contains('light-mode');
  
  if (isDark) {
    themeToggle.textContent = '🌙';
    themeToggle.title = strings.themeDarkTitle;
  } else if (isLight) {
    themeToggle.textContent = '☀️';
    themeToggle.title = strings.themeLightTitle;
  } else {
    themeToggle.textContent = '🌓';
    themeToggle.title = strings.themeSystemTitle;
  }
}

function updateAllUIText(): void {
  const strings = getLanguageStrings();
  const currentLang = getCurrentLanguage();
  
  // Update HTML lang attribute
  document.documentElement.lang = currentLang;
  
  // Update language toggle button
  const languageToggle = document.getElementById('toggle-language');
  if (languageToggle) {
    languageToggle.textContent = languages[currentLang].flag;
    languageToggle.title = `${languages[currentLang].name} (click to change)`;
  }
  
  // Update config toggle button
  const configToggle = document.getElementById('toggle-config');
  if (configToggle) {
    configToggle.title = strings.settingsTitle;
  }
  
  // Update config form
  const workScheduleTitle = document.getElementById('work-schedule-title');
  if (workScheduleTitle) {
    workScheduleTitle.textContent = strings.workSchedule;
  }
  
  const workDaysLabel = document.getElementById('work-days-label');
  if (workDaysLabel) {
    workDaysLabel.textContent = strings.workDays;
  }
  
  // Update day names
  strings.days.forEach((dayName, index) => {
    const daySpan = document.querySelector(`span[data-day-name="${index}"]`);
    if (daySpan) {
      daySpan.textContent = dayName;
    }
  });
  
  const startTimeLabel = document.getElementById('start-time-label');
  if (startTimeLabel) {
    startTimeLabel.textContent = strings.startTime;
  }
  
  const endTimeLabel = document.getElementById('end-time-label');
  if (endTimeLabel) {
    endTimeLabel.textContent = strings.endTime;
  }
  
  const emojiModeLabel = document.getElementById('emoji-mode-label');
  if (emojiModeLabel) {
    emojiModeLabel.textContent = strings.emojiMode;
  }
  
  const saveButton = document.getElementById('save-config');
  if (saveButton) {
    saveButton.textContent = strings.save;
  }
  
  // Update theme icon titles
  updateThemeIcon();
  
  // Update display (to refresh localized messages)
  updateDisplay(schedule);
}

function initializeLanguage(): void {
  const languageToggle = document.getElementById('toggle-language');
  if (!languageToggle) return;
  
  // Set initial language
  updateAllUIText();
  
  // Handle language toggle
  languageToggle.addEventListener('click', () => {
    const nextLang = getNextLanguage();
    setCurrentLanguage(nextLang);
    updateAllUIText();
  });
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
      
      // Show feedback
      const strings = getLanguageStrings();
      const originalText = saveButton.textContent;
      saveButton.textContent = strings.saved;
      saveButton.classList.add('saved');
      
      // Hide form and update display
      configForm.classList.add('hidden');
      updateDisplay(schedule);
      
      // Reset button after delay
      setTimeout(() => {
        saveButton.textContent = originalText;
        saveButton.classList.remove('saved');
      }, 1500);
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
  initializeLanguage();
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
