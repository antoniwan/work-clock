import type { WorkSchedule } from './schedule';

export function isWorkDayToday(schedule: WorkSchedule): boolean {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  // Convert to our format: [Mon, Tue, Wed, Thu, Fri, Sat, Sun]
  // dayOfWeek 0 (Sun) -> index 6
  // dayOfWeek 1 (Mon) -> index 0
  // dayOfWeek 6 (Sat) -> index 5
  const scheduleIndex = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  return schedule.days[scheduleIndex];
}

export function getTimeRemaining(schedule: WorkSchedule): { hours: number; minutes: number } | null {
  if (!isWorkDayToday(schedule)) {
    return null;
  }

  const now = new Date();
  const [endHour, endMinute] = schedule.endTime.split(':').map(Number);
  
  const endTime = new Date(now);
  endTime.setHours(endHour, endMinute, 0, 0);

  // If end time has already passed today, return 0
  if (endTime <= now) {
    return { hours: 0, minutes: 0 };
  }

  const diffMs = endTime.getTime() - now.getTime();
  const totalMinutes = Math.floor(diffMs / (1000 * 60));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return { hours, minutes };
}

export function getMsUntilNextMinute(): number {
  const now = new Date();
  const msUntilNextMinute = 60000 - (now.getSeconds() * 1000 + now.getMilliseconds());
  return msUntilNextMinute;
}


