/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#07161D",     // night sky over the Hooghly
        deep: "#0E2A35",    // wet asphalt
        river: "#14485A",   // river water
        mist: "#DCE9EC",    // monsoon haze
        rain: "#7FD0E4",    // rain streaks
        taxi: "#F2B632",    // Kolkata yellow cab
        rust: "#E2553F",    // danger
        leaf: "#5FC29A",    // safe
      },
      fontFamily: {
        display: ['"Bricolage Grotesque"', "system-ui", "sans-serif"],
        body: ['"Hanken Grotesk"', "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
