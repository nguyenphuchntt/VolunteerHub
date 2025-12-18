import { createTheme } from '@mui/material/styles';

// MUI Theme based on existing VolunteerHub color scheme
const theme = createTheme({
  palette: {
    primary: {
      main: '#88b28b',
      light: '#96ba9c',
      dark: '#7aa07d',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#036b30',
      light: '#81ad89',
      dark: '#025a28',
      contrastText: '#ffffff',
    },
    background: {
      default: '#fafbff',
      paper: '#ffffff',
    },
    text: {
      primary: '#27364b',
      secondary: '#5d6778',
      disabled: '#838b98',
    },
    grey: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827',
    },
    success: {
      main: '#22c55e',
    },
    info: {
      main: '#3b82f6',
    },
    warning: {
      main: '#f59e0b',
    },
    error: {
      main: '#ef4444',
      light: '#fee2e2',
    },
  },
  typography: {
    fontFamily: '"Poppins", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    h1: {
      fontSize: '48px',
      fontWeight: 700,
      lineHeight: 1.2,
    },
    h2: {
      fontSize: '36px',
      fontWeight: 700,
      lineHeight: 1.2,
    },
    h3: {
      fontSize: '28px',
      fontWeight: 600,
      lineHeight: 1.25,
    },
    h4: {
      fontSize: '20px',
      fontWeight: 600,
      lineHeight: 1.3,
    },
    h5: {
      fontSize: '16px',
      fontWeight: 600,
      lineHeight: 1.21,
    },
    h6: {
      fontSize: '14px',
      fontWeight: 600,
      lineHeight: 1.21,
    },
    body1: {
      fontSize: '14px',
      fontWeight: 400,
      lineHeight: 1.75,
    },
    body2: {
      fontSize: '13px',
      fontWeight: 400,
      lineHeight: 1.5,
    },
    caption: {
      fontSize: '12px',
      fontWeight: 400,
      lineHeight: 1.21,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 8,
  },
  shadows: [
    'none',
    '0 1px 2px rgba(0, 0, 0, 0.05)',
    '0 2px 8px rgba(0, 0, 0, 0.1)',
    '0 4px 12px rgba(0, 0, 0, 0.1)',
    '0 8px 24px rgba(0, 0, 0, 0.15)',
    ...Array(20).fill('0 8px 24px rgba(0, 0, 0, 0.15)'),
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '6px',
          padding: '8px 16px',
          fontSize: '14px',
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 8px rgba(136, 178, 139, 0.3)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '8px',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: '6px',
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          border: '2px solid #ffffff',
        },
      },
    },
  },
});

export default theme;
