import fs from 'fs'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import dotenv from 'dotenv'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  // Prefer values from .env so frontend works even when .env.local is absent.
  let envFile: Record<string, string> = {}
  const envPath = path.resolve(__dirname, '.env')
  if (fs.existsSync(envPath)) {
    envFile = dotenv.parse(fs.readFileSync(envPath))
  }

  const supabaseUrl =
    envFile.VITE_SUPABASE_URL ||
    envFile.SUPABASE_URL ||
    env.VITE_SUPABASE_URL ||
    env.SUPABASE_URL ||
    ''

  const supabaseAnonKey =
    envFile.VITE_SUPABASE_ANON_KEY ||
    envFile.SUPABASE_ANON_KEY ||
    env.VITE_SUPABASE_ANON_KEY ||
    env.SUPABASE_ANON_KEY ||
    ''

  const apiUrl =
    env.VITE_API_URL ||
    (mode === 'development' ? 'http://localhost:3001' : '/api')

  return {
    plugins: [react()],
    resolve: {
      alias: { '@': path.resolve(__dirname, 'src') },
    },
    css: {
      modules: {
        localsConvention: 'camelCase',
      },
    },
    define: {
      'import.meta.env.VITE_SUPABASE_URL': JSON.stringify(supabaseUrl),
      'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(supabaseAnonKey),
      'import.meta.env.VITE_API_URL': JSON.stringify(apiUrl),
    },
    server: {
      port: 3000,
      host: true,
      strictPort: false,
      proxy: {
        '/api': {
          target: apiUrl.startsWith('http') ? apiUrl : 'http://localhost:3001',
          changeOrigin: true,
        },
      },
    },
  }
})
