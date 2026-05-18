export const colors = {
  primary: '#2563eb',
  primaryHover: '#1d4ed8',
  secondary: '#64748b',
  accent: '#f59e0b',
  background: '#f8fafc',
  cardBg: '#ffffff',
  textMain: '#1e293b',
  textMuted: '#64748b',
  white: '#ffffff',
  error: '#ef4444',
  success: '#10b981',
  border: '#e2e8f0',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const typography = {
  h1: { fontSize: 32, fontWeight: '700', color: colors.textMain },
  h2: { fontSize: 24, fontWeight: '600', color: colors.textMain },
  h3: { fontSize: 20, fontWeight: '600', color: colors.textMain },
  body: { fontSize: 16, fontWeight: '400', color: colors.textMain },
  caption: { fontSize: 14, fontWeight: '400', color: colors.textMuted },
  small: { fontSize: 12, fontWeight: '400', color: colors.textMuted },
};

export const shadows = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
};
