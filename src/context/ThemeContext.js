import React, { createContext, useState } from 'react';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(true);

  const theme = isDark ? darkTheme : lightTheme;

  const toggleTheme = () => setIsDark(!isDark);

  return (
    <ThemeContext.Provider value={{ isDark, theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

const darkTheme = {
  isDark: true,
  colors: {
    background: '#0f0f23',
    surface: '#1e293b',
    card: '#1e293b',
    border: '#334155',
    primary: '#6366f1',
    primaryLight: '#818cf8',
    accent: '#f59e0b',
    accentPink: '#ec4899',
    text: '#ffffff',
    textSecondary: '#e5e7eb',
    textMuted: '#9ca3af',
    textSubtle: '#6b7280',
    success: '#10b981',
    danger: '#ef4444',
  },
  gradients: {
    background: ['#0f0f23', '#1a1a2e'],
    primary: ['#6366f1', '#8b5cf6'],
    accent: ['#f59e0b', '#ec4899'],
  },
};

const lightTheme = {
  isDark: false,
  colors: {
    background: '#ffffff',
    surface: '#f8fafc',
    card: '#f1f5f9',
    border: '#e2e8f0',
    primary: '#6366f1',
    primaryLight: '#818cf8',
    accent: '#f59e0b',
    accentPink: '#ec4899',
    text: '#0f172a',
    textSecondary: '#334155',
    textMuted: '#64748b',
    textSubtle: '#94a3b8',
    success: '#10b981',
    danger: '#ef4444',
  },
  gradients: {
    background: ['#ffffff', '#f8fafc'],
    primary: ['#6366f1', '#8b5cf6'],
    accent: ['#f59e0b', '#ec4899'],
  },
};
