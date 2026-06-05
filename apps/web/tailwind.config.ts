import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './features/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  safelist: [
    // Tailwind's JIT scanner misses some arbitrary-value and
    // variant classes that are unique to app/page.tsx (the hero
    // block). Listing them explicitly here guarantees they ship
    // in the production CSS.
    'sm:h-[460px]',
    'sm:min-h-[460px]',
    'sm:px-10',
    'sm:flex-row',
    'sm:text-xl',
    'sm:text-[4rem]',
    'left-1/2',
    '-translate-x-1/2',
    'text-[2.5rem]',
    'leading-[1.02]',
    'text-[#f5cf83]',
    'bg-[#1f3763]',
    'border-[#d0b57a]',
    'border-[#eadfca]',
    'shadow-[0_28px_70px_rgba(46,37,20,0.12)]',
    'hover:bg-[#172c53]',
    'hover:bg-[#f8f2e5]',
  ],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [],
}
export default config
