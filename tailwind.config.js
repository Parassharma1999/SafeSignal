/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    './node_modules/leaflet/dist/leaflet.css',
  ],
  safelist: [
    'leaflet-container',
    'leaflet-control-attribution',
    'leaflet-popup',
    'leaflet-popup-content-wrapper',
    'leaflet-popup-content',
  ],
  theme: {
    extend: {
      
     
      },
    },
  
  plugins: [],
}