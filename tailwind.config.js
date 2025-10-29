/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./index.tsx",
    "./App.tsx",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./hooks/**/*.{js,ts,jsx,tsx}",
    "./contexts/**/*.{js,ts,jsx,tsx}",
    "./lib/**/*.{js,ts,jsx,tsx}",
    "./services/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        border: 'hsl(214.3 31.8% 91.4%)',
        input: 'hsl(214.3 31.8% 91.4%)',
        ring: 'hsl(25 95% 53%)',
        background: 'hsl(0 0% 100%)',
        foreground: 'hsl(222.2 84% 4.9%)',
        primary: {
          DEFAULT: 'hsl(25 95% 53%)',
          foreground: 'hsl(210 40% 98%)',
        },
        secondary: {
          DEFAULT: 'hsl(210 40% 96.1%)',
          foreground: 'hsl(222.2 47.4% 11.2%)',
        },
        destructive: {
          DEFAULT: 'hsl(0 84.2% 60.2%)',
          foreground: 'hsl(210 40% 98%)',
        },
        muted: {
          DEFAULT: 'hsl(210 40% 96.1%)',
          foreground: 'hsl(215.4 16.3% 46.9%)',
        },
        accent: {
          DEFAULT: 'hsl(210 40% 96.1%)',
          foreground: 'hsl(222.2 47.4% 11.2%)',
        },
        popover: {
          DEFAULT: 'hsl(0 0% 100%)',
          foreground: 'hsl(222.2 84% 4.9%)',
        },
        card: {
          DEFAULT: 'hsl(0 0% 100%)',
          foreground: 'hsl(222.2 84% 4.9%)',
        },
        dark: {
          border: "hsl(217 33% 17%)",
          input: "hsl(217 33% 17%)",
          ring: "hsl(25 95% 53%)",
          background: "hsl(222 84% 5%)",
          foreground: "hsl(210 40% 98%)",
          primary: {
            DEFAULT: "hsl(25 95% 53%)",
            foreground: "hsl(210 40% 98%)",
          },
          secondary: {
            DEFAULT: "hsl(217 33% 17%)",
            foreground: "hsl(210 40% 98%)",
          },
          destructive: {
            DEFAULT: "hsl(0 63% 31%)",
            foreground: "hsl(210 40% 98%)",
          },
          muted: {
            DEFAULT: "hsl(217 33% 17%)",
            foreground: "hsl(215 20% 65%)",
          },
          accent: {
            DEFAULT: "hsl(217 33% 17%)",
            foreground: "hsl(210 40% 98%)",
          },
          popover: {
            DEFAULT: "hsl(222 84% 5%)",
            foreground: "hsl(210 40% 98%)",
          },
          card: {
            DEFAULT: "hsl(222 84% 5%)",
            foreground: "hsl(210 40% 98%)",
          },
        },
      },
    }
  },
  plugins: [],
}
