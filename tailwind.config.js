/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0B0B0B',
        charcoal: '#1C1C1C',
        gold: {
          DEFAULT: '#D4AF37',
          50: '#FBF6E7',
          100: '#F5E9C2',
          200: '#EBD68A',
          300: '#E0C25C',
          400: '#D4AF37',
          500: '#B8932A',
          600: '#8F7320',
        },
        amber: {
          DEFAULT: '#FFB703',
          400: '#FFB703',
          500: '#E6A300',
        },
        paper: '#FFFFFF',
        mist: {
          DEFAULT: '#BDBDBD',
          400: '#BDBDBD',
          500: '#9A9A9A',
          600: '#7A7A7A',
        },
      },
      fontFamily: {
        sans: ['Poppins', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display-1': ['4.5rem', { lineHeight: '1.05', letterSpacing: '-0.02em' }],
        'display-2': ['3.5rem', { lineHeight: '1.08', letterSpacing: '-0.02em' }],
        h1: ['3.5rem', { lineHeight: '1.1', letterSpacing: '-0.015em' }],
        h2: ['3rem', { lineHeight: '1.15', letterSpacing: '-0.015em' }],
        h3: ['1.75rem', { lineHeight: '1.3', letterSpacing: '-0.01em' }],
        h4: ['1.375rem', { lineHeight: '1.35' }],
        'body-lg': ['1.125rem', { lineHeight: '1.6' }],
        body: ['1rem', { lineHeight: '1.6' }],
        small: ['0.875rem', { lineHeight: '1.5' }],
        eyebrow: ['0.8125rem', { lineHeight: '1', letterSpacing: '0.2em' }],
      },
      spacing: {
        section: '8rem',
        'section-lg': '10rem',
        'section-sm': '5rem',
      },
      backgroundImage: {
        'gold-sweep': 'linear-gradient(135deg, #D4AF37 0%, #FFB703 100%)',
        'gold-sweep-soft': 'linear-gradient(90deg, rgba(212,175,55,0) 0%, #D4AF37 25%, #FFB703 50%, #D4AF37 75%, rgba(212,175,55,0) 100%)',
        'ink-fade': 'linear-gradient(to bottom, rgba(11,11,11,0) 0%, rgba(11,11,11,0.6) 60%, rgba(11,11,11,1) 100%)',
      },
      boxShadow: {
        gold: '0 4px 24px rgba(212,175,55,0.38), 0 2px 8px rgba(212,175,55,0.18)',
        'gold-lg': '0 8px 48px rgba(212,175,55,0.62), 0 4px 16px rgba(212,175,55,0.28)',
        'gold-ghost': '0 4px 20px rgba(212,175,55,0.22)',
        glass: '0 8px 32px -8px rgba(0,0,0,0.6)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      animation: {
        'gold-sweep': 'goldSweep 2.4s ease-in-out forwards',
        float: 'float 3s ease-in-out infinite',
        'fade-up': 'fadeUp 0.7s ease-out forwards',
        marquee: 'marquee 32s linear infinite',
      },
      keyframes: {
        goldSweep: {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '0% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(8px)' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      maxWidth: {
        '7xl': '80rem',
      },
      backdropBlur: {
        xl: '24px',
      },
    },
  },
  plugins: [],
}
