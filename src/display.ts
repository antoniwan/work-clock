import type { WorkSchedule } from './schedule';
import { getTimeRemaining, isWorkDayToday } from './time-calculator';
import { drawFestiveCanvas } from './canvas-drawing';
import { getLanguageStrings } from './languages';

export function updateDisplay(schedule: WorkSchedule): void {
  const displayElement = document.getElementById('main-display');
  const canvasElement = document.getElementById('festive-canvas') as HTMLCanvasElement | null;
  const contextTextElement = document.getElementById('context-text');
  
  if (!displayElement) return;

  const isWorkDay = isWorkDayToday(schedule);
  const timeRemaining = getTimeRemaining(schedule);
  const strings = getLanguageStrings();
  
  // Update context text
  if (contextTextElement) {
    const isWorkDone = timeRemaining && timeRemaining.hours === 0 && timeRemaining.minutes === 0;
    if (!isWorkDay || isWorkDone) {
      contextTextElement.style.display = 'none';
    } else {
      contextTextElement.textContent = strings.contextText;
      contextTextElement.style.display = 'block';
    }
  }

  // Show/hide canvas
  if (canvasElement) {
    const isWorkDone = timeRemaining && timeRemaining.hours === 0 && timeRemaining.minutes === 0;
    
    if (!isWorkDay) {
      // Not a work day - show festive
      canvasElement.style.display = 'block';
      drawFestiveCanvas(canvasElement);
      displayElement.textContent = schedule.emojiMode ? '🎉' : strings.noWorkToday;
      displayElement.style.display = 'block';
    } else if (isWorkDone) {
      // Work day but work is done - show festive
      canvasElement.style.display = 'block';
      drawFestiveCanvas(canvasElement);
      displayElement.textContent = schedule.emojiMode ? '🎉' : strings.workDone;
      displayElement.style.display = 'block';
    } else {
      canvasElement.style.display = 'none';
      displayElement.style.display = 'block';
      
      // Show countdown
      if (timeRemaining) {
        if (schedule.emojiMode) {
          // Emoji mode: show busy emoji when working
          displayElement.textContent = '💼';
        } else {
          // Default mode: show "X hours Y minutes" format with line breaks
          const parts: string[] = [];
          if (timeRemaining.hours > 0) {
            const hourLabel = timeRemaining.hours === 1 ? strings.hour : strings.hours;
            parts.push(`${timeRemaining.hours} ${hourLabel}`);
          }
          if (timeRemaining.minutes > 0 || parts.length === 0) {
            const minuteLabel = timeRemaining.minutes === 1 ? strings.minute : strings.minutes;
            parts.push(`${timeRemaining.minutes} ${minuteLabel}`);
          }
          displayElement.innerHTML = parts.join('<br>');
        }
      }
    }
  }
}


