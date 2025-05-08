export const colors = {
  primary: '#4A90E2', // Blue
  secondary: '#8E44AD', // Purple
  accent: '#1ABC9C', // Teal
  background: '#F0F9FF', // Light blue
  cardBackground: '#FFFFFF', // White
  text: {
    primary: '#2C3E50', // Dark blue-grey
    secondary: '#7F8C8D', // Grey
    accent: '#E91E63', // Pink
  },
  border: '#ECF0F1', // Light grey
  shadow: '#000000',
};

export const typography = {
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  fontSize: {
    small: 12,
    medium: 16,
    large: 20,
    xlarge: 24,
  },
  fontWeight: {
    normal: '400',
    bold: '700',
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const borderRadius = {
  small: 4,
  medium: 8,
  large: 12,
};

export const shadows = {
  small: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
}; 