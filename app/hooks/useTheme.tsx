import { createContext, useContext, useState, ReactNode } from 'react';
import { Appearance } from 'react-native';

type Theme = {
  dark: boolean;
  colors: {
    primary: string;
    background: string;
    card: string;
    text: string;
    border: string;
    notification: string;
    placeholder: string;
    inputBackground: string;
    buttonText: string;
    disabled: string;
    overlay: string;
    primaryDark?: string;
  };
};

type ThemeContextType = {
  theme: Theme;
  setTheme: (theme: 'light' | 'dark') => void;
  colors: Theme['colors'];
};

const lightTheme: Theme = {
  dark: false,
  colors: {
    primary: '#6200ee',
    background: '#ffffff',
    card: '#ffffff',
    text: '#000000',
    border: '#e0e0e0',
    notification: '#f50057',
    placeholder: '#9e9e9e',
    inputBackground: '#f5f5f5',
    buttonText: '#ffffff',
    disabled: '#b3b3b3',
    overlay: 'rgba(255,255,255,0.6)',
  },
};

const darkTheme: Theme = {
  dark: true,
  colors: {
    primary: '#bb86fc',
    background: '#121212',
    card: '#1e1e1e',
    text: '#e0e0e0',
    border: '#333333',
    notification: '#ff4081',
    placeholder: '#757575',
    inputBackground: '#2d2d2d',
    buttonText: '#000000',
    disabled: '#4d4d4d',
    overlay: 'rgba(0,0,0,0.4)',
    
  },
};

const ThemeContext = createContext<ThemeContextType>({
  theme: lightTheme,
  setTheme: () => {},
  colors: lightTheme.colors,
});

// Explicitly type the return as JSX.Element
export const ThemeProvider = ({ children }: { children: ReactNode }): JSX.Element => {
  const colorScheme = Appearance.getColorScheme();
  const [theme, setTheme] = useState<Theme>(colorScheme === 'dark' ? darkTheme : lightTheme);

  const handleSetTheme = (newTheme: 'light' | 'dark') => {
    setTheme(newTheme === 'dark' ? darkTheme : lightTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme: handleSetTheme, colors: theme.colors }}>
      {children}
    </ThemeContext.Provider>
  );
};
export const useTheme = () => useContext(ThemeContext);