import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

// https://vite.dev/config/
export default defineConfig({
  base: '/grow-gold-admin/',
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
  ],
  resolve: {
    alias: {
      formik: fileURLToPath(new URL('./src/lib/formik.jsx', import.meta.url)),
      yup: fileURLToPath(new URL('./src/lib/yup.js', import.meta.url)),
    },
  },
})
