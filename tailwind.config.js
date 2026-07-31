/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx}", "./components/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        terracotta:   "#C25A3F",
        clay:         "#B8933F",
        "clay-dark":  "#9A7A2F",
        cream:        "#FAF7F2",
        ink:          "#2A2520",
        muted:        "#9A8E7E",
        hairline:     "#EAE3D5",
        "success-bg": "#F0E8DC",
        "success-text":"#5A6B3F",
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Georgia", "serif"],
        sans:  ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        card: "14px",
      },
    },
  },
  plugins: [],
};
