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

export interface FontFamily {
  light: string;
  regular: string;
  medium: string;
  semibold: string;
  bold: string;
}

export interface FontSize {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  '2xl': number;
  '3xl': number;
  '4xl': number;
}

export interface Theme {
  colors: ThemeColors;
  shadows: Shadow;
  fonts: FontFamily;
  fontSize: FontSize;
  isDark: boolean;
}