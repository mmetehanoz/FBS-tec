/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef7ff",
          100: "#d9edff",
          500: "#1976d2",
          600: "#0f5faf",
          700: "#0d4f93",
          900: "#0b1d33"
        },
        ink: "#14213d"
      },
      boxShadow: {
        soft: "0 16px 40px rgba(15, 76, 129, 0.12)"
      }
    }
  },
  plugins: []
};
