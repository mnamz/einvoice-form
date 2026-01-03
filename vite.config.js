import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  
  return {
    plugins: [vue()],
    server: {
      proxy: {
        '/api/myinvois': {
          target: env.VITE_MYINVOIS_URL || 'https://api.myinvois.hasil.gov.my',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/myinvois/, ''),
          secure: false
        }
      }
    }
  }
})

