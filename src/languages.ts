export type LanguageCode = 'en-US' | 'es-PR' | 'fr-FR' | 'pt-BR';

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
    saved: string;
    
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
      saved: 'Saved!',
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
      saved: '¡Guardado!',
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
  'fr-FR': {
    code: 'fr-FR',
    flag: '🇫🇷',
    name: 'Français (France)',
    strings: {
      themeDarkTitle: 'Mode sombre (cliquer pour clair)',
      themeLightTitle: 'Mode clair (cliquer pour système)',
      themeSystemTitle: 'Thème système (cliquer pour sombre)',
      settingsTitle: 'Paramètres',
      workSchedule: 'Horaires de Travail',
      workDays: 'Jours de Travail:',
      startTime: 'Heure de Début:',
      endTime: 'Heure de Fin:',
      emojiMode: 'Mode Emoji',
      save: 'Enregistrer',
      saved: 'Enregistré!',
      days: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
      noWorkToday: 'PAS DE TRAVAIL AUJOURD\'HUI!',
      workDone: 'TRAVAIL TERMINÉ!',
      hour: 'heure',
      hours: 'heures',
      minute: 'minute',
      minutes: 'minutes',
      contextText: 'Temps jusqu\'à ce qu\'on parte...',
    },
  },
  'pt-BR': {
    code: 'pt-BR',
    flag: '🇧🇷',
    name: 'Português (Brasil)',
    strings: {
      themeDarkTitle: 'Modo escuro (clique para claro)',
      themeLightTitle: 'Modo claro (clique para sistema)',
      themeSystemTitle: 'Tema do sistema (clique para escuro)',
      settingsTitle: 'Configurações',
      workSchedule: 'Horário de Trabalho',
      workDays: 'Dias de Trabalho:',
      startTime: 'Hora de Início:',
      endTime: 'Hora de Término:',
      emojiMode: 'Modo Emoji',
      save: 'Salvar',
      saved: 'Salvo!',
      days: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
      noWorkToday: 'SEM TRABALHO HOJE!',
      workDone: 'TRABALHO CONCLUÍDO!',
      hour: 'hora',
      hours: 'horas',
      minute: 'minuto',
      minutes: 'minutos',
      contextText: 'Tempo até sairmos...',
    },
  },
};

const STORAGE_KEY = 'work-clock-language';
const DEFAULT_LANGUAGE: LanguageCode = 'en-US';

export function getCurrentLanguage(): LanguageCode {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored && (stored === 'en-US' || stored === 'es-PR' || stored === 'fr-FR' || stored === 'pt-BR')) {
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

