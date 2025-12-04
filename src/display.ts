import type { WorkSchedule } from './schedule';
import { getTimeRemaining, isWorkDayToday } from './time-calculator';
import { drawFestiveCanvas } from './canvas-drawing';

export function updateDisplay(schedule: WorkSchedule): void {
  const displayElement = document.getElementById('main-display');
  const canvasElement = document.getElementById('festive-canvas') as HTMLCanvasElement | null;
  
  if (!displayElement) return;

  const isWorkDay = isWorkDayToday(schedule);
  const timeRemaining = getTimeRemaining(schedule);

  // Show/hide canvas
  if (canvasElement) {
    const isWorkDone = timeRemaining && timeRemaining.hours === 0 && timeRemaining.minutes === 0;
    
    if (!isWorkDay) {
      // Not a work day - show festive
      canvasElement.style.display = 'block';
      drawFestiveCanvas(canvasElement);
      displayElement.textContent = schedule.emojiMode ? '🎉' : 'NO WORK TODAY!';
      displayElement.style.display = 'block';
    } else if (isWorkDone) {
      // Work day but work is done - show festive
      canvasElement.style.display = 'block';
      drawFestiveCanvas(canvasElement);
      displayElement.textContent = schedule.emojiMode ? '🎉' : 'WORK DONE!';
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
          // Default mode: show "X hours Y minutes" format
          const parts: string[] = [];
          if (timeRemaining.hours > 0) {
            const hourLabel = timeRemaining.hours === 1 ? 'hour' : 'hours';
            parts.push(`${timeRemaining.hours} ${hourLabel}`);
          }
          if (timeRemaining.minutes > 0 || parts.length === 0) {
            const minuteLabel = timeRemaining.minutes === 1 ? 'minute' : 'minutes';
            parts.push(`${timeRemaining.minutes} ${minuteLabel}`);
          }
          displayElement.textContent = parts.join(' ');
        }
      }
    }
  }
}


