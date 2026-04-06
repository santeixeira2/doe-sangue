export const colors = {
  primary: {
    DEFAULT: '#E53935',
    dark: '#C62828',
    light: '#EF5350',
    50: '#FDECEA',
    100: '#F9D0CE',
    200: '#F5A3A0',
    500: '#E53935',
    600: '#C62828',
    700: '#B71C1C',
  },
  background: '#FAFAFA',
  card: '#FFFFFF',
  text: {
    primary: '#111111',
    secondary: '#666666',
    muted: '#999999',
    inverse: '#FFFFFF',
  },
  teal: {
    DEFAULT: '#00897B',
    dark: '#00695C',
    light: '#4DB6AC',
    50: '#E0F2F1',
  },
  dark: {
    DEFAULT: '#3E2723',
    light: '#4E342E',
    surface: '#5D4037',
  },
  success: '#43A047',
  warning: '#FB8C00',
  error: '#E53935',
  border: '#E0E0E0',
  skeleton: '#E8E8E8',
} as const;

export type ColorToken = typeof colors;
