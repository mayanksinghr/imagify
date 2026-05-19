/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "index.html",
    "./src/**/*.{html,js,jsx,tsx}"
  ],
  theme: {
    extend: {
     screens:{
      "custom":{
        max:"768px"
      },
     } 
    },
  },
  plugins: [],
}

