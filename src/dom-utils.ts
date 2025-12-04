/**
 * DOM utility functions to reduce code duplication
 */

/**
 * Safely get an element by ID with type assertion
 */
export function getElementById<T extends HTMLElement>(id: string): T | null {
  return document.getElementById(id) as T | null;
}

/**
 * Safely get an element by ID, throwing if not found
 */
export function requireElementById<T extends HTMLElement>(id: string): T {
  const element = getElementById<T>(id);
  if (!element) {
    throw new Error(`Element with id "${id}" not found`);
  }
  return element;
}

/**
 * Update text content of an element if it exists
 */
export function updateTextContent(id: string, text: string): void {
  const element = getElementById<HTMLElement>(id);
  if (element) {
    element.textContent = text;
  }
}

/**
 * Update title attribute of an element if it exists
 */
export function updateTitle(id: string, title: string): void {
  const element = getElementById<HTMLElement>(id);
  if (element) {
    element.title = title;
  }
}

/**
 * Check if system prefers dark mode
 */
export function prefersDarkMode(): boolean {
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

/**
 * Apply theme classes to document element
 */
export function applyTheme(theme: 'dark' | 'light' | 'system'): void {
  const root = document.documentElement;
  root.classList.remove('dark-mode', 'light-mode');
  
  if (theme === 'dark') {
    root.classList.add('dark-mode');
  } else if (theme === 'light') {
    root.classList.add('light-mode');
  } else {
    // System preference
    if (prefersDarkMode()) {
      root.classList.add('dark-mode');
    }
  }
}

/**
 * Get current theme from document classes
 */
export function getCurrentTheme(): 'dark' | 'light' | 'system' {
  const root = document.documentElement;
  if (root.classList.contains('dark-mode')) {
    return 'dark';
  }
  if (root.classList.contains('light-mode')) {
    return 'light';
  }
  return 'system';
}

