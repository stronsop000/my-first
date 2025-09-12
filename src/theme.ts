export const theme = {
  colors: {
    primary: {
      green: '#4CAF50',
      blue: '#2196F3',
    },
    accent: {
      yellow: '#FFC107',
      red: '#F44336',
    },
    neutral: {
      white: '#FFFFFF',
      light: '#F5F5F5',
      gray: '#9E9E9E',
      dark: '#424242',
      black: '#212121',
    },
  },
  fonts: {
    heading: '"Poppins", sans-serif',
    body: '"Roboto", sans-serif',
  },
  breakpoints: {
    mobile: '576px',
    tablet: '768px',
    desktop: '1024px',
  },
  shadows: {
    light: '0 2px 4px rgba(0,0,0,0.1)',
    medium: '0 4px 8px rgba(0,0,0,0.15)',
    heavy: '0 8px 16px rgba(0,0,0,0.2)',
  },
  transitions: {
    fast: '0.2s ease-in-out',
    medium: '0.3s ease-in-out',
    slow: '0.5s ease-in-out',
  },
};

export type Theme = typeof theme;