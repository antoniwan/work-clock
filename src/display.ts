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
      displayElement.textContent = schedule.emojiMode ? '🎉 NO WORK TODAY! 🎉' : 'NO WORK TODAY!';
      displayElement.style.display = 'block';
    } else if (isWorkDone) {
      // Work day but work is done - show festive
      canvasElement.style.display = 'block';
      drawFestiveCanvas(canvasElement);
      displayElement.textContent = schedule.emojiMode ? '🎉 WORK DONE! 🎉' : 'WORK DONE!';
      displayElement.style.display = 'block';
    } else {
      canvasElement.style.display = 'none';
      displayElement.style.display = 'block';
      
      // Show countdown
      if (timeRemaining) {
        if (schedule.emojiMode) {
          if (timeRemaining.hours === 0 && timeRemaining.minutes === 0) {
            displayElement.textContent = '🎉 Done! 🎉';
          } else {
            const parts: string[] = [];
            if (timeRemaining.hours > 0) {
              parts.push(`${timeRemaining.hours}${getEmojiHours(timeRemaining.hours)}`);
            }
            if (timeRemaining.minutes > 0 || parts.length === 0) {
              parts.push(`${timeRemaining.minutes}${getEmojiMinutes(timeRemaining.minutes)}`);
            }
            displayElement.textContent = `⏰ ${parts.join(' ')}`;
          }
        } else {
          const hoursStr = timeRemaining.hours.toString().padStart(2, '0');
          const minutesStr = timeRemaining.minutes.toString().padStart(2, '0');
          displayElement.textContent = `${hoursStr}:${minutesStr}`;
        }
      }
    }
  }
}

function getEmojiHours(hours: number): string {
  if (hours === 0) return '';
  if (hours === 1) return ' hour';
  return ' hours';
}

function getEmojiMinutes(minutes: number): string {
  if (minutes === 0) return '';
  if (minutes === 1) return ' min';
  return ' mins';
}

