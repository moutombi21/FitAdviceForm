/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"], 
  theme: {
    extend: {
      fontFamily: {
        sans: ['Montserrat', 'sans-serif'],
      },
      colors: {
        darkPurple: '#100f1f',
        blackRaisin: '#231F20', 
        green: '#04FC81',    
        blue: '#02E1FF',       
      },
      backgroundImage: {
        myGradient: 'linear-gradient(90deg, #04FC81 1.10%, #02E1FF 100%)', 
      },
    },
  },
  plugins: [],
}