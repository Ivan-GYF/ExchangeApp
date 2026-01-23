# 前端组件架构设计

## 组件层级结构

```
App
├── Layout (布局组件)
│   ├── Header (顶部导航)
│   ├── Sidebar (侧边栏)
│   └── Footer (页脚)
├── Pages (页面组件)
│   ├── Dashboard (首页仪表板)
│   ├── Marketplace (市场浏览器)
│   ├── AssetDetail (资产详情)
│   ├── Portfolio (投资组合)
│   ├── CentralKitchen (中央厨房)
│   ├── MatchingWorkbench (匹配工作台)
│   ├── Login (登录)
│   └── Register (注册)
└── Components (可复用组件)
    ├── AssetCard (资产卡片)
    ├── InvestmentCard (投资卡片)
    ├── FilterPanel (筛选面板)
    ├── Charts (图表组件)
    │   ├── TrendChart (趋势图)
    │   ├── PieChart (饼图)
    │   ├── StackedAreaChart (堆叠面积图)
    │   └── BarChart (柱状图)
    ├── RiskBadge (风险徽章)
    ├── TypeTag (类型标签)
    ├── ProgressBar (进度条)
    ├── InvestmentCalculator (投资计算器)
    └── MatchScore (匹配评分)
```

## 核心页面组件

### 1. Dashboard (首页仪表板)
**路径**: `/`
**功能**:
- 显示KPI指标卡片
- 四类投资项目轮播
- 多维度趋势图
- 快速操作入口

**子组件**:
- `KPICard`: KPI指标卡片
- `AssetCarousel`: 资产轮播
- `TrendChart`: 趋势图表

### 2. Marketplace (市场浏览器)
**路径**: `/marketplace`
**功能**:
- 左侧筛选面板
- 资产卡片网格展示
- 分页和排序

**子组件**:
- `FilterPanel`: 筛选面板
- `AssetCard`: 资产卡片
- `Pagination`: 分页组件

### 3. AssetDetail (资产详情)
**路径**: `/assets/:id`
**功能**:
- 资产基本信息
- 收益结构可视化
- 财务表现图表
- 投资操作面板

**子组件**:
- `AssetInfo`: 资产信息
- `RevenueStructure`: 收益结构图
- `FinancialChart`: 财务图表
- `InvestmentPanel`: 投资面板

### 4. Portfolio (投资组合)
**路径**: `/portfolio`
**功能**:
- 组合总值展示
- 资产分布图
- 持仓明细表
- 里程碑提醒

**子组件**:
- `PortfolioSummary`: 组合摘要
- `DistributionChart`: 分布图
- `HoldingsTable`: 持仓表格
- `MilestoneList`: 里程碑列表

### 5. CentralKitchen (中央厨房)
**路径**: `/central-kitchen`
**权限**: 仅管理员
**功能**:
- 总览指标
- 资产流水线
- 待审批队列
- 实时活动流

**子组件**:
- `OverviewMetrics`: 总览指标
- `PipelineFlow`: 流水线图
- `ApprovalQueue`: 审批队列
- `ActivityFeed`: 活动流

### 6. MatchingWorkbench (匹配工作台)
**路径**: `/matching`
**功能**:
- 投资偏好设置
- AI智能推荐
- 项目对比
- 投资计算器

**子组件**:
- `PreferencePanel`: 偏好设置
- `RecommendationList`: 推荐列表
- `ComparisonTable`: 对比表格
- `InvestmentCalculator`: 投资计算器

## 可复用组件库

### 数据展示组件

#### AssetCard
```tsx
interface AssetCardProps {
  asset: Asset
  onClick?: (asset: Asset) => void
  showActions?: boolean
}
```
**功能**: 展示资产卡片，包含标题、类型、回报率、风险等级等

#### InvestmentCard
```tsx
interface InvestmentCardProps {
  investment: Investment
  onClick?: (investment: Investment) => void
}
```
**功能**: 展示投资记录卡片

#### RiskBadge
```tsx
interface RiskBadgeProps {
  level: RiskLevel
  score?: number
}
```
**功能**: 显示风险等级徽章，带颜色编码

#### TypeTag
```tsx
interface TypeTagProps {
  type: AssetType
  icon?: boolean
}
```
**功能**: 显示资产类型标签

### 表单组件

#### FilterPanel
```tsx
interface FilterPanelProps {
  filters: AssetListParams
  onChange: (filters: AssetListParams) => void
  onReset?: () => void
}
```
**功能**: 多维度筛选面板

#### InvestmentCalculator
```tsx
interface InvestmentCalculatorProps {
  onCalculate: (params: InvestmentCalculatorRequest) => void
  loading?: boolean
}
```
**功能**: 投资收益计算器

### 图表组件

#### TrendChart
```tsx
interface TrendChartProps {
  data: TrendData
  height?: number
  loading?: boolean
}
```
**功能**: 多线趋势图

#### PieChart
```tsx
interface PieChartProps {
  data: Array<{ name: string; value: number }>
  height?: number
}
```
**功能**: 饼图/环形图

#### StackedAreaChart
```tsx
interface StackedAreaChartProps {
  data: any[]
  categories: string[]
  height?: number
}
```
**功能**: 堆叠面积图

#### BarChart
```tsx
interface BarChartProps {
  data: any[]
  xField: string
  yField: string
  height?: number
}
```
**功能**: 柱状图

### 业务组件

#### MatchScore
```tsx
interface MatchScoreProps {
  score: number
  reasons: string[]
}
```
**功能**: 显示AI匹配评分和原因

#### ProgressBar
```tsx
interface ProgressBarProps {
  current: number
  target: number
  showPercentage?: boolean
}
```
**功能**: 募资进度条

## 状态管理设计

使用 Zustand 进行状态管理，按模块划分：

### authStore
```typescript
interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  login: (credentials: LoginRequest) => Promise<void>
  logout: () => void
  updateProfile: (profile: Partial<User>) => Promise<void>
}
```

### assetStore
```typescript
interface AssetState {
  assets: Asset[]
  currentAsset: Asset | null
  filters: AssetListParams
  loading: boolean
  fetchAssets: (params?: AssetListParams) => Promise<void>
  fetchAssetById: (id: string) => Promise<void>
  setFilters: (filters: AssetListParams) => void
}
```

### investmentStore
```typescript
interface InvestmentState {
  investments: Investment[]
  portfolioStats: PortfolioStats | null
  loading: boolean
  fetchInvestments: () => Promise<void>
  fetchPortfolioStats: () => Promise<void>
  createInvestment: (request: CreateInvestmentRequest) => Promise<void>
}
```

### matchingStore
```typescript
interface MatchingState {
  profile: InvestorProfile | null
  recommendations: MatchRecommendation[]
  loading: boolean
  updateProfile: (profile: UpdateProfileRequest) => Promise<void>
  fetchRecommendations: () => Promise<void>
}
```

## 路由设计

```typescript
const routes = [
  { path: '/', component: Dashboard, auth: true },
  { path: '/marketplace', component: Marketplace, auth: true },
  { path: '/assets/:id', component: AssetDetail, auth: true },
  { path: '/portfolio', component: Portfolio, auth: true },
  { path: '/matching', component: MatchingWorkbench, auth: true },
  { path: '/central-kitchen', component: CentralKitchen, auth: true, role: 'ADMIN' },
  { path: '/login', component: Login, auth: false },
  { path: '/register', component: Register, auth: false },
]
```

## 样式设计规范

### 颜色系统

#### 资产类型颜色
- 轻资产赛道: `#91D5FF` (浅蓝)
- 抖音投流: `#95DE64` (浅绿)
- 天猫校园: `#FFD591` (浅橙)
- 演唱会门票: `#FFA39E` (浅粉)

#### 风险等级颜色
- 低风险: `#52C41A` (绿色)
- 中风险: `#FAAD14` (黄色)
- 高风险: `#FF4D4F` (橙红色)

#### 状态颜色
- 成功/完成: `#52C41A`
- 警告/待处理: `#FAAD14`
- 错误/拒绝: `#FF4D4F`
- 信息/进行中: `#1890FF`

### 间距系统
- xs: 4px
- sm: 8px
- md: 16px
- lg: 24px
- xl: 32px
- xxl: 48px

### 字体大小
- xs: 12px
- sm: 14px
- base: 16px
- lg: 18px
- xl: 20px
- 2xl: 24px
- 3xl: 30px

## 响应式设计

### 断点
- xs: < 576px (手机)
- sm: ≥ 576px (大手机)
- md: ≥ 768px (平板)
- lg: ≥ 992px (桌面)
- xl: ≥ 1200px (大桌面)
- xxl: ≥ 1600px (超大桌面)

### 布局适配
- 移动端: 单列布局，侧边栏折叠
- 平板: 两列布局，部分图表简化
- 桌面: 三列布局，完整功能展示

## 性能优化策略

1. **代码分割**: 按路由进行懒加载
2. **组件懒加载**: 使用 React.lazy 和 Suspense
3. **虚拟滚动**: 长列表使用虚拟滚动
4. **图片优化**: 使用 WebP 格式，懒加载
5. **缓存策略**: API 响应缓存，状态持久化
6. **防抖节流**: 搜索、筛选等操作使用防抖
7. **Memo优化**: 使用 React.memo 避免不必要的重渲染

## 无障碍设计

1. 语义化 HTML 标签
2. ARIA 属性支持
3. 键盘导航支持
4. 屏幕阅读器友好
5. 颜色对比度符合 WCAG 2.1 AA 标准
