import { Router, Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const router = Router()

// 模拟用户数据库
const users: any[] = []

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

// 注册
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { name, email, password, phone } = req.body

    // 检查用户是否已存在
    const existingUser = users.find(u => u.email === email)
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: { code: 'USER_EXISTS', message: '该邮箱已被注册' }
      })
    }

    // 加密密码
    const hashedPassword = await bcrypt.hash(password, 10)

    // 创建用户
    const user = {
      id: String(users.length + 1),
      name,
      email,
      phone: phone || null,
      password: hashedPassword,
      role: 'investor',
      createdAt: new Date().toISOString()
    }
    users.push(user)

    // 生成 token
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' })

    // 返回用户信息（不含密码）
    const { password: _, ...userWithoutPassword } = user
    res.json({
      success: true,
      data: {
        token,
        user: userWithoutPassword
      }
    })
  } catch (error) {
    console.error('Register error:', error)
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: '注册失败，请重试' }
    })
  }
})

// 登录
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body

    // 查找用户
    const user = users.find(u => u.email === email)
    if (!user) {
      return res.status(401).json({
        success: false,
        error: { code: 'INVALID_CREDENTIALS', message: '邮箱或密码错误' }
      })
    }

    // 验证密码
    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        error: { code: 'INVALID_CREDENTIALS', message: '邮箱或密码错误' }
      })
    }

    // 生成 token
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' })

    // 返回用户信息（不含密码）
    const { password: _, ...userWithoutPassword } = user
    res.json({
      success: true,
      data: {
        token,
        user: userWithoutPassword
      }
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: '登录失败，请重试' }
    })
  }
})

// 获取当前用户
router.get('/me', (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: '未登录' }
      })
    }

    const token = authHeader.split(' ')[1]
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string }
    
    const user = users.find(u => u.id === decoded.userId)
    if (!user) {
      return res.status(401).json({
        success: false,
        error: { code: 'USER_NOT_FOUND', message: '用户不存在' }
      })
    }

    const { password: _, ...userWithoutPassword } = user
    res.json({
      success: true,
      data: userWithoutPassword
    })
  } catch (error) {
    res.status(401).json({
      success: false,
      error: { code: 'INVALID_TOKEN', message: '登录已过期，请重新登录' }
    })
  }
})

export default router
