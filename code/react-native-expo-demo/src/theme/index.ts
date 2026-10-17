import { MD3LightTheme, MD3DarkTheme, MD3Theme } from 'react-native-paper';

export const lightTheme: MD3Theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#1976D2',
    secondary: '#009688',
    tertiary: '#FF9800',
    background: '#F8F9FA',
    surface: '#FFFFFF',
    error: '#D32F2F',
  },
};

export const darkTheme: MD3Theme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#90CAF9',
    secondary: '#80CBC4',
    tertiary: '#FFB74D',
    background: '#121212',
    surface: '#1E1E1E',
    error: '#EF5350',
  },
};
