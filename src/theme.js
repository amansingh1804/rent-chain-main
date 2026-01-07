import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#2563eb", // Modern blue
      light: "#60a5fa",
      dark: "#1d4ed8",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#059669", // Modern green
      light: "#34d399",
      dark: "#047857",
      contrastText: "#ffffff",
    },
    background: {
      default: "#fafafa",
      paper: "#ffffff",
      alt: "#f8fafc",
    },
    error: {
      main: "#dc2626",
      light: "#ef4444",
      dark: "#b91c1c",
    },
    warning: {
      main: "#d97706",
      light: "#f59e0b",
      dark: "#92400e",
    },
    info: {
      main: "#0891b2",
      light: "#06b6d4",
      dark: "#0e7490",
    },
    success: {
      main: "#059669",
      light: "#34d399",
      dark: "#047857",
    },
    text: {
      primary: "#1e293b",
      secondary: "#64748b",
      disabled: "#94a3b8",
    },
    divider: "rgba(148, 163, 184, 0.1)",
    action: {
      hover: "rgba(37, 99, 235, 0.04)",
      selected: "rgba(37, 99, 235, 0.08)",
      disabled: "rgba(148, 163, 184, 0.26)",
      disabledBackground: "rgba(148, 163, 184, 0.12)",
    },
  },
  typography: {
    fontFamily: "'Inter', 'Roboto', 'Helvetica', 'Arial', sans-serif",
    h1: {
      fontSize: '3rem',
      fontWeight: 800,
      lineHeight: 1.1,
      letterSpacing: '-0.025em',
    },
    h2: {
      fontSize: '2.25rem',
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: '-0.02em',
    },
    h3: {
      fontSize: '1.875rem',
      fontWeight: 600,
      lineHeight: 1.25,
      letterSpacing: '-0.01em',
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.3,
      letterSpacing: '-0.005em',
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h6: {
      fontSize: '1.125rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
      fontWeight: 400,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
      fontWeight: 400,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
      letterSpacing: '0.025em',
    },
    caption: {
      fontSize: '0.75rem',
      lineHeight: 1.4,
      fontWeight: 500,
      letterSpacing: '0.05em',
    },
    overline: {
      fontSize: '0.75rem',
      lineHeight: 1.4,
      fontWeight: 600,
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
    },
  },
  shape: {
    borderRadius: 16,
  },
  shadows: [
    'none',
    '0px 1px 2px 0px rgba(0, 0, 0, 0.05)',
    '0px 1px 3px 0px rgba(0, 0, 0, 0.1), 0px 1px 2px 0px rgba(0, 0, 0, 0.06)',
    '0px 4px 6px -1px rgba(0, 0, 0, 0.1), 0px 2px 4px -1px rgba(0, 0, 0, 0.06)',
    '0px 10px 15px -3px rgba(0, 0, 0, 0.1), 0px 4px 6px -2px rgba(0, 0, 0, 0.05)',
    '0px 20px 25px -5px rgba(0, 0, 0, 0.1), 0px 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '0px 25px 50px -12px rgba(0, 0, 0, 0.25)',
    '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    '0 35px 60px -12px rgba(0, 0, 0, 0.3)',
    '0px 32px 64px -12px rgba(0, 0, 0, 0.14), 0px 16px 32px -8px rgba(0, 0, 0, 0.08)',
    '0px 40px 80px -20px rgba(0, 0, 0, 0.16)',
    '0px 48px 96px -24px rgba(0, 0, 0, 0.18)',
    '0px 56px 112px -28px rgba(0, 0, 0, 0.2)',
    '0px 64px 128px -32px rgba(0, 0, 0, 0.22)',
    '0px 72px 144px -36px rgba(0, 0, 0, 0.24)',
    '0px 80px 160px -40px rgba(0, 0, 0, 0.26)',
    '0px 88px 176px -44px rgba(0, 0, 0, 0.28)',
    '0px 96px 192px -48px rgba(0, 0, 0, 0.3)',
    '0px 104px 208px -52px rgba(0, 0, 0, 0.32)',
    '0px 112px 224px -56px rgba(0, 0, 0, 0.34)',
    '0px 120px 240px -60px rgba(0, 0, 0, 0.36)',
    '0px 128px 256px -64px rgba(0, 0, 0, 0.38)',
    '0px 136px 272px -68px rgba(0, 0, 0, 0.4)',
    '0px 144px 288px -72px rgba(0, 0, 0, 0.42)',
  ],
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        '*': {
          boxSizing: 'border-box',
        },
        html: {
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale',
        },
        body: {
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(148, 163, 184, 0.5) transparent',
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'rgba(148, 163, 184, 0.5)',
            borderRadius: '4px',
            '&:hover': {
              background: 'rgba(148, 163, 184, 0.7)',
            },
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          fontWeight: 600,
          padding: '12px 24px',
          fontSize: '0.875rem',
          lineHeight: 1.2,
          letterSpacing: '0.025em',
          boxShadow: 'none',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: 0,
            height: 0,
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.3)',
            transition: 'width 0.6s, height 0.6s',
            transform: 'translate(-50%, -50%)',
          },
          '&:hover::before': {
            width: '300px',
            height: '300px',
          },
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
          },
          '&:active': {
            transform: 'translateY(0)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          },
        },
        contained: {
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          '&:hover': {
            background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
            boxShadow: '0 12px 40px rgba(102, 126, 234, 0.4)',
          },
        },
        outlined: {
          borderWidth: '2px',
          '&:hover': {
            borderWidth: '2px',
            backgroundColor: 'rgba(37, 99, 235, 0.04)',
          },
        },
        text: {
          '&:hover': {
            backgroundColor: 'rgba(37, 99, 235, 0.04)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          '&:hover': {
            transform: 'translateY(-8px) scale(1.02)',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        },
        elevation1: {
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
        },
        elevation2: {
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
        },
        elevation3: {
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(148, 163, 184, 0.1)',
          color: '#1e293b',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            transition: 'all 0.2s ease',
            '& fieldset': {
              borderColor: 'rgba(148, 163, 184, 0.2)',
              borderWidth: '2px',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(37, 99, 235, 0.3)',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#2563eb',
              borderWidth: '2px',
            },
            '&.Mui-focused': {
              boxShadow: '0 0 0 4px rgba(37, 99, 235, 0.1)',
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 600,
          fontSize: '0.75rem',
          height: 28,
          transition: 'all 0.2s ease',
          '&:hover': {
            transform: 'scale(1.05)',
          },
        },
        filled: {
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          backdropFilter: 'blur(10px)',
        },
      },
    },
    MuiSkeleton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          background: 'linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%)',
          backgroundSize: '200% 100%',
          animation: 'loading 1.5s infinite',
        },
        '@keyframes loading': {
          '0%': {
            backgroundPosition: '200% 0',
          },
          '100%': {
            backgroundPosition: '-200% 0',
          },
        },
      },
    },
  },
});

export default theme;
