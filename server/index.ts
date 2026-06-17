import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import app from './app.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.resolve(__dirname, '../.env') })

const PORT = Number(process.env.PORT) || 3001
const isVercelRuntime = Boolean(process.env.VERCEL) || Boolean(process.env.VERCEL_REGION)

if (!isVercelRuntime) {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`API server running at http://localhost:${PORT}`)
  })
}

export default app
