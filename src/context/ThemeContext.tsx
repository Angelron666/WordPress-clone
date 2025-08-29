import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import Cookies from 'js-cookie';

type ThemeColors = {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
};

type Theme = {
  name: string;
  colors: ThemeColors;
};

type ThemeContextType = {
  currentTheme: Theme;
  setTheme: (theme: Theme) => void;
  availableThemes: Theme[];
};

const defaultThemes: Theme[] = [
  {
    name: 'Default',
    colors: {
      primary: '#0073aa',
      secondary: '#23282d',
      accent: '#ffb900',
      background: '#f1f1f1',
      text: '#23282d',
    },
  },
  {
    name: 'Dark',
    colors: {
      primary: '#00a0d2',
      secondary: '#1a1a1a',
      accent: '#ffd700',
      background: '#121212',
      text: '#ffffff',
    },
  },
  {
    name: 'Light',
    colors: {
      primary: '#2271b1',
      secondary: '#1d2327',
      accent: '#ff6b6b',
      background: '#ffffff',
      text: '#1d2327',
    },
  },
];

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_COOKIE_NAME = 'wordpress_clone_theme';

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [currentTheme, setCurrentTheme] = useState<Theme>(() => {
    const savedTheme = Cookies.get(THEME_COOKIE_NAME);
    if (savedTheme) {
      try {
        return JSON.parse(savedTheme);
      } catch (error) {
        console.error('Error parsing theme cookie:', error);
      }
    }
    return defaultThemes[0];
  });

  const setTheme = (theme: Theme) => {
    setCurrentTheme(theme);
    Cookies.set(THEME_COOKIE_NAME, JSON.stringify(theme), {
      expires: 365,
      secure: true,
      sameSite: 'strict',
    });

    // Update CSS variables
    const root = document.documentElement;
    Object.entries(theme.colors).forEach(([key, value]) => {
      root.style.setProperty(`--theme-${key}`, value);
    });
  };

  // Set initial CSS variables
  useEffect(() => {
    setTheme(currentTheme);
  }, []);

  return (
    <ThemeContext.Provider
      value={{
        currentTheme,
        setTheme,
        availableThemes: defaultThemes,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};