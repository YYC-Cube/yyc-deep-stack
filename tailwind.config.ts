import type { Config } from 'tailwindcss';
import plugin from 'tailwindcss/plugin';

const config: Config = {
  darkMode: ['class'],
  content: [
    './app/**/*.{ts,tsx,js,jsx,mdx}',
    './components/**/*.{ts,tsx,js,jsx,mdx}',
    './pages/**/*.{ts,tsx,js,jsx,mdx}',
    './lib/**/*.{ts,tsx,js,jsx}',
    './src/**/*.{ts,tsx,js,jsx}',
  ],
  theme: {
    extend: {
      colors: Object.fromEntries(
        [
          'background',
          'foreground',
          'border',
          'input',
          'ring',
          'primary',
          'secondary',
          'accent',
          'muted',
          'destructive',
          'card',
          'popover',
          'sidebar',
        ].flatMap((key) =>
          key === 'sidebar'
            ? [
                [`${key}`, 'hsl(var(--sidebar-background))'],
                [`${key}-foreground`, 'hsl(var(--sidebar-foreground))'],
                [`${key}-primary`, 'hsl(var(--sidebar-primary))'],
                [`${key}-primary-foreground`, 'hsl(var(--sidebar-primary-foreground))'],
                [`${key}-accent`, 'hsl(var(--sidebar-accent))'],
                [`${key}-accent-foreground`, 'hsl(var(--sidebar-accent-foreground))'],
                [`${key}-border`, 'hsl(var(--sidebar-border))'],
                [`${key}-ring`, 'hsl(var(--sidebar-ring))'],
              ]
            : [
                [`${key}`, `hsl(var(--${key}))`],
                [`${key}-foreground`, `hsl(var(--${key}-foreground))`],
              ]
        )
      ),
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
    plugin(function ({ addBase }) {
      addBase({
        ':root': {
          '--background': '0 0% 100%',
          '--foreground': '222.2 47.4% 11.2%',
          '--card': '0 0% 100%',
          '--card-foreground': '222.2 47.4% 11.2%',
          '--popover': '0 0% 100%',
          '--popover-foreground': '222.2 47.4% 11.2%',
          '--primary': '222.2 47.4% 11.2%',
          '--primary-foreground': '0 0% 100%',
          '--secondary': '210 40% 96.1%',
          '--secondary-foreground': '222.2 47.4% 11.2%',
          '--muted': '210 40% 96.1%',
          '--muted-foreground': '222.2 47.4% 11.2%',
          '--accent': '210 40% 96.1%',
          '--accent-foreground': '222.2 47.4% 11.2%',
          '--destructive': '0 100% 50%',
          '--destructive-foreground': '0 0% 100%',
          '--border': '214.3 31.8% 91.4%',
          '--input': '214.3 31.8% 91.4%',
          '--ring': '222.2 47.4% 11.2%',
          '--radius': '0.5rem',
        },
      });
    }),
  ],
};

export default config;
