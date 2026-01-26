import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import dotenv from 'dotenv'
import { createServer } from 'http'

// 加载环境变量
dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// 中间件
app.use(helmet())
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// 健康检查
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// API路由
app.get('/api', (_req, res) => {
  res.json({
    message: 'Marketplace Exchange Platform API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      assets: '/api/assets',
      investments: '/api/investments',
      matching: '/api/matching',
      centralKitchen: '/api/central-kitchen',
      dashboard: '/api/dashboard',
    },
  })
})

// 导入路由
import authRoutes from './routes/auth'
import assetRoutes from './routes/assets'
import dashboardRoutes from './routes/dashboard'
import investmentRoutes from './routes/investments'
import matchingRoutes from './routes/matching'
import centralKitchenRoutes from './routes/central-kitchen'
import projectRoutes from './routes/projects'

// 使用路由
app.use('/api/auth', authRoutes)
app.use('/api/assets', assetRoutes)
app.use('/api/dashboard', dashboardRoutes)
app.use('/api/investments', investmentRoutes)
app.use('/api/matching', matchingRoutes)
app.use('/api/central-kitchen', centralKitchenRoutes)
app.use('/api/projects', projectRoutes)

// 404处理
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: '请求的资源不存在',
    },
  })
})

// 错误处理中间件
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Error:', err)

  res.status(err.status || 500).json({
    success: false,
    error: {
      code: err.code || 'SERVER_ERROR',
      message: err.message || '服务器内部错误',
    },
  })
})

// 启动服务器
const server = createServer(app)

server.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`)
  console.log(`📚 API documentation: http://localhost:${PORT}/api`)
  console.log(`🏥 Health check: http://localhost:${PORT}/health`)
})

// 优雅关闭
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server')
  server.close(() => {
    console.log('HTTP server closed')
    process.exit(0)
  })
})

export default app
