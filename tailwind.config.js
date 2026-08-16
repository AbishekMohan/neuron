/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // "neuron" theme: deep royal blue fading to black
        neuron: {
          DEFAULT: '#0A1E4D',
          black: '#000000',
        },
      },
    },
  },
  plugins: [],
}
