/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        wordpress: {
          blue: '#0073aa',
          darkblue: '#00669b',
          lightblue: '#00a0d2',
          gray: '#f1f1f1',
          darkgray: '#23282d',
          mediumgray: '#32373c',
          lightgray: '#f9f9f9',
          border: '#e5e5e5',
          accent: '#ffb900',
          success: '#46b450',
          warning: '#ffb900',
          error: '#dc3232',
        },
      },
      boxShadow: {
        'wp': '0 1px 1px rgba(0, 0, 0, 0.04)',
        'wp-hover': '0 1px 2px rgba(0, 0, 0, 0.1)',
      },
      fontFamily: {
        'wp': ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Oxygen-Sans', 'Ubuntu', 'Cantarell', 'Helvetica Neue', 'sans-serif'],
      },
      fontSize: {
        'wp-tiny': ['11px', '1.4'],
        'wp-small': ['13px', '1.4'],
        'wp-base': ['14px', '1.4'],
        'wp-medium': ['16px', '1.4'],
        'wp-large': ['18px', '1.4'],
        'wp-xl': ['20px', '1.4'],
        'wp-2xl': ['24px', '1.3'],
        'wp-3xl': ['28px', '1.3'],
      },
      spacing: {
        'wp-1': '8px',
        'wp-2': '16px',
        'wp-3': '24px',
        'wp-4': '32px',
      },
      animation: {
        'spin-slow': 'spin 2s linear infinite',
        'fade-in': 'fade-in 0.3s ease-in-out',
        'slide-in': 'slide-in 0.3s ease-in-out',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-in': {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: '#23282d',
            a: {
              color: '#0073aa',
              '&:hover': {
                color: '#00669b',
              },
            },
            h1: {
              color: '#23282d',
            },
            h2: {
              color: '#23282d',
            },
            h3: {
              color: '#23282d',
            },
            h4: {
              color: '#23282d',
            },
            blockquote: {
              borderLeftColor: '#0073aa',
            },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};