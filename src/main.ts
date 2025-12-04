import './style.css';
import { inject } from '@vercel/analytics';
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
import {
  getElementById,
  updateTextContent,
  updateTitle,
  applyTheme,
  getCurrentTheme,
} from './dom-utils';

// Initialize Vercel Analytics
inject();

let schedule: WorkSchedule = getSchedule();
let updateTimeoutId: number | null = null;

function updateThemeIcon(): void {
  const themeToggle = getElementById<HTMLButtonElement>('toggle-theme');
  if (!themeToggle) return;
  
  const strings = getLanguageStrings();
  const currentTheme = getCurrentTheme();
  
  if (currentTheme === 'dark') {
    themeToggle.textContent = '🌙';
    themeToggle.setAttribute('aria-label', strings.themeDarkTitle);
    updateTitle('toggle-theme', strings.themeDarkTitle);
  } else if (currentTheme === 'light') {
    themeToggle.textContent = '☀️';
    themeToggle.setAttribute('aria-label', strings.themeLightTitle);
    updateTitle('toggle-theme', strings.themeLightTitle);
  } else {
    themeToggle.textContent = '🌓';
    themeToggle.setAttribute('aria-label', strings.themeSystemTitle);
    updateTitle('toggle-theme', strings.themeSystemTitle);
  }
}

function updateAllUIText(): void {
  const strings = getLanguageStrings();
  const currentLang = getCurrentLanguage();
  
  // Update HTML lang attribute
  document.documentElement.lang = currentLang;
  
  // Update language toggle button
  const languageToggle = getElementById<HTMLButtonElement>('toggle-language');
  if (languageToggle) {
    languageToggle.textContent = languages[currentLang].flag;
    const label = `${languages[currentLang].name} (click to change)`;
    languageToggle.setAttribute('aria-label', label);
    updateTitle('toggle-language', label);
  }
  
  // Update config toggle button
  updateTitle('toggle-config', strings.settingsTitle);
  const configToggle = getElementById<HTMLButtonElement>('toggle-config');
  if (configToggle) {
    configToggle.setAttribute('aria-label', strings.settingsTitle);
  }
  
  // Update config form labels
  updateTextContent('work-schedule-title', strings.workSchedule);
  updateTextContent('work-days-label', strings.workDays);
  updateTextContent('start-time-label', strings.startTime);
  updateTextContent('end-time-label', strings.endTime);
  updateTextContent('emoji-mode-label', strings.emojiMode);
  updateTextContent('save-config', strings.save);
  
  // Update day names
  strings.days.forEach((dayName, index) => {
    const daySpan = document.querySelector<HTMLSpanElement>(`span[data-day-name="${index}"]`);
    if (daySpan) {
      daySpan.textContent = dayName;
    }
  });
  
  // Update theme icon titles
  updateThemeIcon();
  
  // Update display (to refresh localized messages)
  updateDisplay(schedule);
}

function initializeLanguage(): void {
  const languageToggle = getElementById<HTMLButtonElement>('toggle-language');
  if (!languageToggle) return;
  
  // Set initial language
  updateAllUIText();
  
  // Handle language toggle
  languageToggle.addEventListener('click', () => {
    const nextLang = getNextLanguage();
    setCurrentLanguage(nextLang);
    updateAllUIText();
  });
  
  // Keyboard shortcut: L for language toggle
  document.addEventListener('keydown', (e) => {
    if (e.key === 'l' && !e.ctrlKey && !e.metaKey && !e.altKey && !e.shiftKey) {
      const activeElement = document.activeElement;
      // Only trigger if not typing in an input
      if (activeElement?.tagName !== 'INPUT' && activeElement?.tagName !== 'TEXTAREA') {
        languageToggle.click();
      }
    }
  });
  
  // Keyboard shortcut: S for settings
  document.addEventListener('keydown', (e) => {
    if (e.key === 's' && !e.ctrlKey && !e.metaKey && !e.altKey && !e.shiftKey) {
      const activeElement = document.activeElement;
      const configForm = getElementById<HTMLDivElement>('config-form');
      // Only trigger if not typing in an input and modal is not open
      if (
        activeElement?.tagName !== 'INPUT' &&
        activeElement?.tagName !== 'TEXTAREA' &&
        configForm?.classList.contains('hidden')
      ) {
        const toggleButton = getElementById<HTMLButtonElement>('toggle-config');
        toggleButton?.click();
      }
    }
  });
}

function initializeTheme(): void {
  const themeToggle = getElementById<HTMLButtonElement>('toggle-theme');
  if (!themeToggle) return;

  // Initialize theme from stored preference or system preference
  const storedTheme = schedule.darkMode;
  if (storedTheme === true) {
    applyTheme('dark');
  } else if (storedTheme === false) {
    applyTheme('light');
  } else {
    applyTheme('system');
  }

  // Update icon based on initial state
  updateThemeIcon();

  // Listen for system theme changes (only if using system preference)
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (schedule.darkMode === undefined) {
      applyTheme('system');
      updateThemeIcon();
    }
  });

  // Toggle theme on button click
  themeToggle.addEventListener('click', () => {
    const currentTheme = getCurrentTheme();
    
    if (currentTheme === 'dark') {
      // Switch to light mode
      applyTheme('light');
      schedule.darkMode = false;
    } else if (currentTheme === 'light') {
      // Switch to system preference
      applyTheme('system');
      schedule.darkMode = undefined;
    } else {
      // Currently using system, switch to dark
      applyTheme('dark');
      schedule.darkMode = true;
    }
    
    saveSchedule(schedule);
    updateThemeIcon();
  });
  
  // Keyboard shortcut: T for theme toggle
  document.addEventListener('keydown', (e) => {
    if (e.key === 't' && !e.ctrlKey && !e.metaKey && !e.altKey && !e.shiftKey) {
      const activeElement = document.activeElement;
      // Only trigger if not typing in an input
      if (activeElement?.tagName !== 'INPUT' && activeElement?.tagName !== 'TEXTAREA') {
        themeToggle.click();
      }
    }
  });
}

function trapFocus(element: HTMLElement): void {
  const focusableElements = element.querySelectorAll<HTMLElement>(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  element.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab') return;

    if (e.shiftKey) {
      // Shift + Tab
      if (document.activeElement === firstElement) {
        e.preventDefault();
        lastElement?.focus();
      }
    } else {
      // Tab
      if (document.activeElement === lastElement) {
        e.preventDefault();
        firstElement?.focus();
      }
    }
  });
}

function initializeConfigForm(): void {
  const toggleButton = getElementById<HTMLButtonElement>('toggle-config');
  const configForm = getElementById<HTMLDivElement>('config-form');
  const saveButton = getElementById<HTMLButtonElement>('save-config');
  
  if (!toggleButton || !configForm || !saveButton) return;

  // Set up focus trapping
  trapFocus(configForm);

  // Toggle form visibility
  toggleButton.addEventListener('click', () => {
    const isHidden = configForm.classList.toggle('hidden');
    toggleButton.setAttribute('aria-expanded', String(!isHidden));
    
    if (!isHidden) {
      populateConfigForm();
      // Focus first input when opening
      const firstInput = getElementById<HTMLInputElement>('start-time');
      firstInput?.focus();
    } else {
      // Return focus to toggle button when closing
      toggleButton.focus();
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
      const originalText = saveButton.textContent || '';
      updateTextContent('save-config', strings.saved);
      saveButton.classList.add('saved');
      
      // Hide form and update display
      configForm.classList.add('hidden');
      toggleButton.setAttribute('aria-expanded', 'false');
      toggleButton.focus();
      updateDisplay(schedule);
      
      // Reset button after delay
      setTimeout(() => {
        updateTextContent('save-config', originalText);
        saveButton.classList.remove('saved');
      }, 1500);
    }
  });
  
  // Close modal on Escape key
  configForm.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !configForm.classList.contains('hidden')) {
      configForm.classList.add('hidden');
      toggleButton.setAttribute('aria-expanded', 'false');
      toggleButton.focus();
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
  const startTimeInput = getElementById<HTMLInputElement>('start-time');
  const endTimeInput = getElementById<HTMLInputElement>('end-time');
  if (startTimeInput) startTimeInput.value = schedule.startTime;
  if (endTimeInput) endTimeInput.value = schedule.endTime;

  // Set emoji mode
  const emojiModeCheckbox = getElementById<HTMLInputElement>('emoji-mode');
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

  const startTimeInput = getElementById<HTMLInputElement>('start-time');
  const endTimeInput = getElementById<HTMLInputElement>('end-time');
  const emojiModeCheckbox = getElementById<HTMLInputElement>('emoji-mode');

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
  const canvasElement = getElementById<HTMLCanvasElement>('festive-canvas');
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
