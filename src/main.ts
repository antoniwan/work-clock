import './style.css';
import { getSchedule, saveSchedule, type WorkSchedule } from './schedule';
import { updateDisplay } from './display';
import { getMsUntilNextMinute } from './time-calculator';
import { drawFestiveCanvas } from './canvas-drawing';

let schedule: WorkSchedule = getSchedule();
let updateTimeoutId: number | null = null;

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
