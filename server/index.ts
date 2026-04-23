import app from './app.js'

const PORT = Number(process.env.PORT) || 3101
const isVercelRuntime = Boolean(process.env.VERCEL) || Boolean(process.env.VERCEL_REGION)

if (!isVercelRuntime) {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`API server running at http://localhost:${PORT}`)
  })
}

export default app
