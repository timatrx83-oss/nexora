import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'
import { mentorApiPlugin } from './server/vitePlugin.ts'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [
      react(),
      mentorApiPlugin({
        OPENAI_API_KEY: env.OPENAI_API_KEY,
        OPENAI_MODEL: env.OPENAI_MODEL,
      }),
    ],
  }
})
