# 开发指南

## 快速开始

### 前置要求
- Node.js 18+
- PostgreSQL 14+
- Redis 6+
- Git

### 安装步骤

1. **安装后端依赖**
```bash
cd backend
npm install
```

2. **安装前端依赖**
```bash
cd frontend
npm install
```

3. **配置环境变量**
```bash
# 后端
cd backend
cp .env.example .env
# 编辑 .env 配置数据库等信息

# 前端
cd frontend
cp .env.example .env
# 编辑 .env 配置API地址
```

4. **初始化数据库**
```bash
cd backend
npm run prisma:generate
npm run prisma:migrate
```

5. **启动开发服务器**
```bash
# 终端1 - 启动后端
cd backend
npm run dev

# 终端2 - 启动前端
cd frontend
npm run dev
```

6. **访问应用**
- 前端: http://localhost:3000
- 后端: http://localhost:5000
- API文档: http://localhost:5000/api

## 项目结构说明

### 后端结构
```
backend/
├── src/
│   ├── controllers/    # 控制器层
│   ├── services/       # 业务逻辑层
│   ├── models/         # 数据模型
│   ├── middleware/     # 中间件
│   ├── routes/         # 路由定义
│   ├── utils/          # 工具函数
│   └── index.ts        # 入口文件
├── prisma/
│   └── schema.prisma   # 数据库Schema
└── package.json
```

### 前端结构
```
frontend/
├── src/
│   ├── components/     # 可复用组件
│   ├── pages/          # 页面组件
│   ├── stores/         # 状态管理
│   ├── services/       # API服务
│   ├── utils/          # 工具函数
│   ├── types/          # TypeScript类型
│   ├── assets/         # 静态资源
│   ├── App.tsx         # 根组件
│   └── main.tsx        # 入口文件
└── package.json
```

## 开发规范

### 代码风格
- 使用 ESLint + Prettier 进行代码格式化
- 遵循 TypeScript 严格模式
- 组件使用函数式组件 + Hooks

### 命名规范
- **组件**: PascalCase (例: `AssetCard.tsx`)
- **文件**: kebab-case (例: `asset-service.ts`)
- **变量/函数**: camelCase (例: `getUserProfile`)
- **常量**: UPPER_SNAKE_CASE (例: `API_BASE_URL`)
- **类型/接口**: PascalCase (例: `AssetType`)

### Git 提交规范
使用 Conventional Commits 规范:
```
feat: 新功能
fix: 修复bug
docs: 文档更新
style: 代码格式调整
refactor: 重构
test: 测试相关
chore: 构建/工具链相关
```

示例:
```bash
git commit -m "feat: 添加资产筛选功能"
git commit -m "fix: 修复投资计算器精度问题"
```

## 常用命令

### 后端命令
```bash
npm run dev          # 启动开发服务器
npm run build        # 构建生产版本
npm run start        # 启动生产服务器
npm run lint         # 代码检查
npm run format       # 代码格式化
npm run prisma:generate  # 生成Prisma客户端
npm run prisma:migrate   # 运行数据库迁移
npm run prisma:studio    # 打开Prisma Studio
```

### 前端命令
```bash
npm run dev          # 启动开发服务器
npm run build        # 构建生产版本
npm run preview      # 预览生产构建
npm run lint         # 代码检查
npm run format       # 代码格式化
```

## API 开发

### 创建新的API端点

1. **定义路由** (`backend/src/routes/example.ts`)
```typescript
import { Router } from 'express'
import { exampleController } from '../controllers/example'

const router = Router()

router.get('/', exampleController.getAll)
router.post('/', exampleController.create)

export default router
```

2. **实现控制器** (`backend/src/controllers/example.ts`)
```typescript
import { Request, Response } from 'express'
import { exampleService } from '../services/example'

export const exampleController = {
  async getAll(req: Request, res: Response) {
    try {
      const data = await exampleService.getAll()
      res.json({ success: true, data })
    } catch (error) {
      res.status(500).json({ success: false, error })
    }
  }
}
```

3. **实现服务层** (`backend/src/services/example.ts`)
```typescript
import { prisma } from '../utils/prisma'

export const exampleService = {
  async getAll() {
    return await prisma.example.findMany()
  }
}
```

## 前端开发

### 创建新页面

1. **创建页面组件** (`frontend/src/pages/Example/index.tsx`)
```typescript
import { useEffect, useState } from 'react'
import { Card } from 'antd'

const Example = () => {
  const [data, setData] = useState([])

  useEffect(() => {
    // 获取数据
  }, [])

  return (
    <Card title="示例页面">
      {/* 页面内容 */}
    </Card>
  )
}

export default Example
```

2. **添加路由** (`frontend/src/App.tsx`)
```typescript
import Example from './pages/Example'

// 在 Routes 中添加
<Route path="/example" element={<Example />} />
```

### 创建可复用组件

```typescript
// frontend/src/components/ExampleCard/index.tsx
import { Card } from 'antd'
import './ExampleCard.css'

interface ExampleCardProps {
  title: string
  content: string
  onClick?: () => void
}

const ExampleCard = ({ title, content, onClick }: ExampleCardProps) => {
  return (
    <Card title={title} onClick={onClick} hoverable>
      {content}
    </Card>
  )
}

export default ExampleCard
```

## 状态管理

使用 Zustand 创建 Store:

```typescript
// frontend/src/stores/exampleStore.ts
import { create } from 'zustand'

interface ExampleState {
  items: any[]
  loading: boolean
  fetchItems: () => Promise<void>
}

export const useExampleStore = create<ExampleState>((set) => ({
  items: [],
  loading: false,

  fetchItems: async () => {
    set({ loading: true })
    try {
      // API调用
      const items = await apiClient.get('/example')
      set({ items, loading: false })
    } catch (error) {
      set({ loading: false })
    }
  }
}))
```

## 测试

### 单元测试
```bash
# 运行测试
npm test

# 测试覆盖率
npm run test:coverage
```

### E2E测试
```bash
# 运行E2E测试
npm run test:e2e
```

## 调试技巧

### 后端调试
1. 使用 VS Code 调试器
2. 添加断点
3. 查看日志输出

### 前端调试
1. 使用 React DevTools
2. 使用 Chrome DevTools
3. 使用 Redux DevTools (如果使用Redux)

## 性能优化

### 前端优化
- 使用 React.memo 避免不必要的重渲染
- 使用 useMemo 和 useCallback 优化计算
- 代码分割和懒加载
- 图片优化和懒加载

### 后端优化
- 数据库查询优化
- 使用 Redis 缓存
- API 响应压缩
- 连接池管理

## 常见问题

### Q: 数据库连接失败
A: 检查 .env 中的 DATABASE_URL 配置是否正确

### Q: 前端无法访问后端API
A: 检查 CORS 配置和 API_BASE_URL

### Q: Prisma 生成失败
A: 运行 `npm run prisma:generate` 重新生成

## 资源链接

- [React 文档](https://react.dev/)
- [Ant Design 文档](https://ant.design/)
- [Prisma 文档](https://www.prisma.io/docs)
- [Express 文档](https://expressjs.com/)
- [TypeScript 文档](https://www.typescriptlang.org/)
