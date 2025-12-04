export type LanguageCode = 'en-US' | 'es-PR';

export interface Language {
  code: LanguageCode;
  flag: string;
  name: string;
  strings: {
    // Theme toggle titles
    themeDarkTitle: string;
    themeLightTitle: string;
    themeSystemTitle: string;
    
    // Config form
    settingsTitle: string;
    workSchedule: string;
    workDays: string;
    startTime: string;
    endTime: string;
    emojiMode: string;
    save: string;
    
    // Day names (abbreviated)
    days: [string, string, string, string, string, string, string]; // Mon-Sun
    
    // Display messages
    noWorkToday: string;
    workDone: string;
    hour: string;
    hours: string;
    minute: string;
    minutes: string;
    contextText: string;
  };
}

export const languages: Record<LanguageCode, Language> = {
  'en-US': {
    code: 'en-US',
    flag: '🇺🇸',
    name: 'English (USA)',
    strings: {
      themeDarkTitle: 'Dark mode (click for light)',
      themeLightTitle: 'Light mode (click for system)',
      themeSystemTitle: 'System theme (click for dark)',
      settingsTitle: 'Settings',
      workSchedule: 'Work Schedule',
      workDays: 'Work Days:',
      startTime: 'Start Time:',
      endTime: 'End Time:',
      emojiMode: 'Emoji Mode',
      save: 'Save',
      days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      noWorkToday: 'NO WORK TODAY!',
      workDone: 'WORK DONE!',
      hour: 'hour',
      hours: 'hours',
      minute: 'minute',
      minutes: 'minutes',
      contextText: 'Time until we are off...',
    },
  },
  'es-PR': {
    code: 'es-PR',
    flag: '🇵🇷',
    name: 'Español (Puerto Rico)',
    strings: {
      themeDarkTitle: 'Modo oscuro (clic para claro)',
      themeLightTitle: 'Modo claro (clic para sistema)',
      themeSystemTitle: 'Tema del sistema (clic para oscuro)',
      settingsTitle: 'Configuración',
      workSchedule: 'Horario de Trabajo',
      workDays: 'Días de Trabajo:',
      startTime: 'Hora de Inicio:',
      endTime: 'Hora de Finalización:',
      emojiMode: 'Modo Emoji',
      save: 'Guardar',
      days: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
      noWorkToday: '¡NO HAY TRABAJO HOY!',
      workDone: '¡TRABAJO COMPLETADO!',
      hour: 'hora',
      hours: 'horas',
      minute: 'minuto',
      minutes: 'minutos',
      contextText: 'Tiempo hasta que salgamos...',
    },
  },
};

const STORAGE_KEY = 'work-clock-language';
const DEFAULT_LANGUAGE: LanguageCode = 'en-US';

export function getCurrentLanguage(): LanguageCode {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored && (stored === 'en-US' || stored === 'es-PR')) {
    return stored as LanguageCode;
  }
  return DEFAULT_LANGUAGE;
}

export function setCurrentLanguage(code: LanguageCode): void {
  localStorage.setItem(STORAGE_KEY, code);
}

export function getLanguageStrings(): Language['strings'] {
  const currentCode = getCurrentLanguage();
  return languages[currentCode].strings;
}

export function getAvailableLanguages(): Language[] {
  return Object.values(languages);
}

export function getNextLanguage(): LanguageCode {
  const current = getCurrentLanguage();
  const available = getAvailableLanguages();
  const currentIndex = available.findIndex(lang => lang.code === current);
  const nextIndex = (currentIndex + 1) % available.length;
  return available[nextIndex].code;
}

