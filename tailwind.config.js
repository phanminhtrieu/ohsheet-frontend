/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      keyframes: {
        shake: {
          "0%, 100%": { transform: "translateX(0)" },
          "25%": { transform: "translateX(-4px)" },
          "50%": { transform: "translateX(4px)" },
          "75%": { transform: "translateX(-2px)" },
        },
        shakeY: {
          "0%, 100%": { transform: "translateY(0)" },
          "25%": { transform: "translateY(-4px)" },
          "50%": { transform: "translateY(4px)" },
          "75%": { transform: "translateY(-2px)" },
        },
        "bounce-custom": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-20px)" },
        },
      },
      animation: {
        // Shake (X)
        shake: "shake 0.5s ease-in-out 1", // rung ngang
        "shake-continuous": "shake 0.5s ease-in-out infinite",
        "shake-continuous-slow": "shake 1s ease-in-out infinite",

        // Shake Y
        shakeY: "shakeY 0.5s ease-in-out 1", // rung dọc 1 lần
        "shakeY-continuous": "shakeY 0.5s ease-in-out infinite",
        "shakeY-continuous-slow": "shakeY 1s ease-in-out infinite",

        // Bounce custom
        "bounce-custom": "bounce-custom 1s infinite",
      },
    },
  },
  plugins: [],
};
