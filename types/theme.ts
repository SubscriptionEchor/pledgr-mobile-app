export interface ThemeColors {
  primary: string;
  primaryHover: string;
  primaryLight: string;
  primaryDark: string;
  secondary: string;
  background: string;
  surface: string;
  surfaceHover: string;
  border: string;
  textPrimary: string;
  textSecondary: string;
  error: string;
  success: string;
  warning: string;
  info: string;
  buttonText: string;
}

export interface Shadow {
  sm: string;
  md: string;
  lg: string;
}

export interface Theme {
  colors: ThemeColors;
  shadows: Shadow;
  isDark: boolean;
}