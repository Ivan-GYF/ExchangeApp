# Lakeside Exchange 湖畔通市场 - 外挂市场系统

## 项目概述

基于"中央厨房"模式的投资资产交易平台，实现资产方和资金方的智能匹配与交易。

### 核心定位
- **中央决策核心**：统一的投资决策和风险把控
- **资产标签化**：精细化标签系统（行业、地区、风险等级、回报率）
- **智能匹配**：AI驱动的资产-资金匹配引擎
- **交易闭环**：统一的资金流和管理流

### 四大投资类型（收入分成模式）

1. **轻资产赛道收入分成** 🏁
   - 赛车场馆运营收益权
   - 收益来源：门票40% + 赛事承办35% + 商业租赁25%
   - 风险等级：中等，稳定现金流

2. **抖音投流收入分成** 📱
   - KOL/品牌投放广告收益
   - 收益来源：广告投放ROI分成
   - 风险等级：高回报高波动

3. **天猫校园设施收入分成** 🏫
   - 高校便利店/服务设施
   - 收益来源：销售额分成 + 租金收益
   - 风险等级：低风险，学生群体稳定

4. **演唱会门票收入分成** 🎤
   - 巡演票务收益权
   - 收益来源：门票销售分成 + 周边商品
   - 风险等级：中高风险，依赖艺人影响力

## 技术架构

### 前端技术栈
- **框架**: React 18 + TypeScript
- **状态管理**: Zustand (轻量级)
- **UI组件库**: Ant Design 5.x
- **图表可视化**: ECharts / Recharts
- **路由**: React Router v6
- **HTTP客户端**: Axios
- **构建工具**: Vite

### 后端技术栈
- **框架**: Node.js + Express / NestJS
- **数据库**: PostgreSQL (主数据) + Redis (缓存)
- **ORM**: Prisma
- **认证**: JWT + OAuth2.0
- **API文档**: Swagger/OpenAPI

### AI/智能匹配
- **推荐引擎**: 基于用户画像和资产标签的协同过滤
- **风险评估**: 多维度评分模型
- **匹配算法**: 加权评分 + 机器学习优化

## 核心功能模块

### 1. 首页仪表板 (Dashboard)
- KPI指标展示：总投资额、活跃机会、匹配交易、投资组合回报
- 四类收入分成项目轮播
- 多维度趋势图（按投资类型）

### 2. 市场浏览器 (Marketplace Browser)
- 多维度筛选：类型、风险等级、回报率、投资金额
- 项目卡片展示
- 风险徽章颜色编码

### 3. 资产详情页 (Asset Detail)
- 项目基本信息
- 收益结构可视化
- 财务表现图表
- 现金流时间线
- 尽调清单
- 投资进度条

### 4. 投资组合管理 (Portfolio Management)
- 组合总值和回报率
- 堆叠面积图（按类型分布）
- 持仓明细表
- 即将到期的里程碑提醒

### 5. 中央厨房控制中心 (Central Kitchen)
- 总览指标
- 资产流水线管理
- 待审批队列
- 系统分析图表
- 实时活动动态

### 6. 匹配工作台 (Matching Workbench)
- 投资者偏好设置
- AI智能推荐
- 匹配质量评分
- 项目对比分析
- 投资计算器
- 交易执行面板

## 项目结构

```
ExchangeApp/
├── frontend/                 # 前端应用
│   ├── src/
│   │   ├── components/      # 可复用组件
│   │   ├── pages/           # 页面组件
│   │   ├── stores/          # 状态管理
│   │   ├── services/        # API服务
│   │   ├── utils/           # 工具函数
│   │   ├── types/           # TypeScript类型定义
│   │   ├── assets/          # 静态资源
│   │   └── App.tsx          # 根组件
│   ├── public/
│   └── package.json
├── backend/                  # 后端API
│   ├── src/
│   │   ├── controllers/     # 控制器
│   │   ├── services/        # 业务逻辑
│   │   ├── models/          # 数据模型
│   │   ├── middleware/      # 中间件
│   │   ├── routes/          # 路由定义
│   │   └── utils/           # 工具函数
│   ├── prisma/              # 数据库schema
│   └── package.json
├── docs/                     # 文档
│   ├── api/                 # API文档
│   ├── design/              # 设计文档
│   └── deployment/          # 部署文档
└── concept pics/            # 设计概念图
```

## 快速开始

### 前端开发
```bash
cd frontend
npm install
npm run dev
```

### 后端开发
```bash
cd backend
npm install
npm run dev
```

## 开发规范

### 代码风格
- 使用ESLint + Prettier
- 遵循Airbnb JavaScript Style Guide
- TypeScript严格模式

### Git工作流
- main: 生产环境
- develop: 开发环境
- feature/*: 功能分支
- hotfix/*: 紧急修复

### 命名规范
- 组件：PascalCase (e.g., `AssetCard.tsx`)
- 文件：kebab-case (e.g., `asset-service.ts`)
- 变量/函数：camelCase (e.g., `getUserProfile`)
- 常量：UPPER_SNAKE_CASE (e.g., `API_BASE_URL`)

## 安全考虑

- 所有API请求需要JWT认证
- 敏感数据加密存储
- HTTPS强制使用
- CSRF保护
- SQL注入防护
- XSS防护

## 性能优化

- 前端代码分割和懒加载
- 图片优化和CDN加速
- API响应缓存
- 数据库查询优化
- 服务端渲染（SSR）考虑

## 部署方案

- **前端**: Vercel / Netlify / Nginx
- **后端**: Docker + Kubernetes / AWS ECS
- **数据库**: AWS RDS / 阿里云RDS
- **缓存**: Redis Cluster
- **CDN**: CloudFlare / 阿里云CDN

## 监控和日志

- 应用性能监控：Sentry
- 日志管理：ELK Stack
- 用户行为分析：Google Analytics / 神策数据

## 许可证

Proprietary - All Rights Reserved
