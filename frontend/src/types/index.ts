// ==================== 枚举类型 ====================

export enum UserRole {
  INVESTOR = 'INVESTOR',           // 投资人
  PROJECT_OWNER = 'PROJECT_OWNER', // 项目方
  ADMIN = 'ADMIN',                 // 平台管理员
}

export enum RiskTolerance {
  CONSERVATIVE = 'CONSERVATIVE',
  BALANCED = 'BALANCED',
  AGGRESSIVE = 'AGGRESSIVE',
}

export enum AssetType {
  MIFC_FUND_LP = 'MIFC_FUND_LP',      // MIFC主基金LP份额（劣后级）
  MIFC_ABS = 'MIFC_ABS',              // MIFC主基金ABS份额（优先级）
  CO_INVESTMENT = 'CO_INVESTMENT',    // 跟投项目
}

// 跟投项目原始类别（用于标签展示）
export enum CoInvestmentCategory {
  RACING_TRACK = 'RACING_TRACK',
  STREAMING = 'STREAMING',
  CAMPUS_FACILITY = 'CAMPUS_FACILITY',
  CONCERT_TICKET = 'CONCERT_TICKET',
}

export enum RiskLevel {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
}

export enum AssetStatus {
  PENDING = 'PENDING',
  UNDER_REVIEW = 'UNDER_REVIEW',
  APPROVED = 'APPROVED',
  LISTED = 'LISTED',
  FUNDING = 'FUNDING',
  FUNDED = 'FUNDED',
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  REJECTED = 'REJECTED',
}

export enum InvestmentStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  ACTIVE = 'ACTIVE',
  DISTRIBUTING = 'DISTRIBUTING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export enum DividendType {
  QUARTERLY = 'QUARTERLY',
  CAMPAIGN = 'CAMPAIGN',
  EVENT = 'EVENT',
}

export enum DividendStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  FAILED = 'FAILED',
}

export enum MilestoneStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  OVERDUE = 'OVERDUE',
}

export enum DocumentType {
  CONTRACT = 'CONTRACT',
  AUDIT_REPORT = 'AUDIT_REPORT',
  DUE_DILIGENCE = 'DUE_DILIGENCE',
  FINANCIAL = 'FINANCIAL',
  OTHER = 'OTHER',
}

export enum ActivityType {
  ASSET_SUBMITTED = 'ASSET_SUBMITTED',
  ASSET_APPROVED = 'ASSET_APPROVED',
  ASSET_REJECTED = 'ASSET_REJECTED',
  INVESTMENT_MADE = 'INVESTMENT_MADE',
  DIVIDEND_PAID = 'DIVIDEND_PAID',
  MILESTONE_REACHED = 'MILESTONE_REACHED',
  SYSTEM_EVENT = 'SYSTEM_EVENT',
}

// ==================== 基础类型 ====================

export interface User {
  id: string
  email: string
  name: string
  phone?: string
  role: UserRole
  investorProfile?: InvestorProfile
  createdAt: string
  updatedAt: string
}

export interface InvestorProfile {
  id: string
  userId: string
  investmentRange: {
    min: number
    max: number
  }
  riskTolerance: RiskTolerance
  preferredTypes: AssetType[]
  preferredRegions: string[]
  returnExpectation: {
    min: number
    max: number
  }
  aiMatchingEnabled: boolean
  createdAt: string
  updatedAt: string
}

export interface Asset {
  id: string
  title: string
  description: string
  type: AssetType | string
  targetAmount: number
  raisedAmount: number
  minInvestment: number
  maxInvestment: number
  expectedReturn: {
    min: number
    max: number
    type: string
  }
  // 兼容后端 API 返回的扁平化字段
  expectedReturnMin?: number
  expectedReturnMax?: number
  expectedReturnType?: string
  revenueStructure: Record<string, number>
  riskLevel: RiskLevel | string
  riskScore: number
  region: string
  city?: string
  status: AssetStatus | string
  fundingDeadline?: string
  investmentPeriod?: number
  dueDiligence?: Record<string, boolean>
  milestones?: Milestone[]
  documents?: Document[]
  createdAt: string
  updatedAt: string
  
  // 主基金专属字段
  fundStructure?: {
    totalScale: number           // 总规模（5亿）
    priority: 'SENIOR' | 'JUNIOR' // 优先级/劣后级
    seniorScale?: number         // 优先级规模
    juniorScale?: number         // 劣后级规模
  }
  
  // 跟投项目专属字段
  overflowFrom?: {
    fundId: string                 // 来源主基金ID
    fundName: string               // 来源主基金名称
    projectInvestLimit: number     // 主基金单项目限额
    projectTotalNeed: number       // 项目总需求
    overflowAmount: number         // 溢出金额
  }
  originalCategory?: CoInvestmentCategory | string  // 跟投项目原类别
}

export interface Investment {
  id: string
  userId: string
  assetId: string
  asset?: Asset
  amount: number
  managementFee: number
  transactionFee: number
  netAmount: number
  currentValue: number
  returnRate: number
  status: InvestmentStatus
  pNoteNumber?: string
  dividends?: Dividend[]
  createdAt: string
  updatedAt: string
}

export interface Dividend {
  id: string
  investmentId: string
  amount: number
  type: DividendType
  period: string
  status: DividendStatus
  paidAt?: string
  createdAt: string
}

export interface Milestone {
  id: string
  assetId: string
  title: string
  description?: string
  dueDate: string
  status: MilestoneStatus
  createdAt: string
  updatedAt: string
}

export interface Document {
  id: string
  assetId: string
  title: string
  type: DocumentType
  fileUrl: string
  fileSize: number
  createdAt: string
}

export interface Activity {
  id: string
  userId?: string
  user?: User
  type: ActivityType
  description: string
  metadata?: Record<string, any>
  createdAt: string
}

// ==================== API 请求/响应类型 ====================

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
  }
  message?: string
}

export interface PaginationParams {
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface PaginationMeta {
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface PaginatedResponse<T> {
  items: T[]
  pagination: PaginationMeta
}

// 认证相关
export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  name: string
  phone?: string
  role?: UserRole
}

export interface AuthResponse {
  token: string
  user: User
}

// 资产相关
export interface AssetListParams extends PaginationParams {
  type?: AssetType[]
  riskLevel?: RiskLevel[]
  minReturn?: number
  maxReturn?: number
  region?: string
  status?: AssetStatus
}

export interface CreateAssetRequest {
  title: string
  description: string
  type: AssetType
  targetAmount: number
  minInvestment: number
  maxInvestment: number
  expectedReturn: {
    min: number
    max: number
    type: string
  }
  revenueStructure: Record<string, number>
  riskLevel: RiskLevel
  region: string
  city?: string
  fundingDeadline?: string
  investmentPeriod?: number
}

// 投资相关
export interface CreateInvestmentRequest {
  assetId: string
  amount: number
}

export interface PortfolioStats {
  totalValue: number
  totalReturn: number
  distribution: Record<AssetType, number>
  upcomingMilestones: Milestone[]
}

// 匹配相关
export interface UpdateProfileRequest {
  investmentRange: {
    min: number
    max: number
  }
  riskTolerance: RiskTolerance
  preferredTypes: AssetType[]
  preferredRegions: string[]
  returnExpectation: {
    min: number
    max: number
  }
  aiMatchingEnabled: boolean
}

export interface MatchRecommendation {
  asset: Asset
  matchScore: number
  matchReasons: string[]
}

export interface RecommendationsResponse {
  matchQuality: number
  totalMatches: number
  recommendations: MatchRecommendation[]
}

export interface CompareAssetsRequest {
  assetIds: string[]
}

export interface InvestmentCalculatorRequest {
  amount: number
  expectedReturn: number
  period: number
}

export interface InvestmentCalculatorResponse {
  totalReturn: number
  yearlyBreakdown: number[]
  projectedValue: number
}

// 中央厨房相关
export interface CentralKitchenOverview {
  totalAssets: number
  assetPipeline: number
  pendingApproval: number
  systemHealth: number
  pipeline: {
    acquisition: number
    dueDiligence: number
    pricing: number
    listed: number
    matched: number
  }
  distribution: Record<AssetType, number>
}

export interface ApprovalRequest {
  action: 'APPROVE' | 'REJECT' | 'REQUEST_REVIEW'
  comment: string
}

// 仪表板相关
export interface DashboardKPI {
  totalInvestment: number
  activeOpportunities: number
  matchedTransactions: number
  portfolioReturn: number
}

export interface TrendData {
  [key: string]: Array<{
    date: string
    value: number
  }>
}

// ==================== 组件 Props 类型 ====================

export interface AssetCardProps {
  asset: Asset
  onClick?: (asset: Asset) => void
  showActions?: boolean
}

export interface InvestmentCardProps {
  investment: Investment
  onClick?: (investment: Investment) => void
}

export interface FilterPanelProps {
  filters: AssetListParams
  onChange: (filters: AssetListParams) => void
}

export interface ChartProps {
  data: any[]
  height?: number
  loading?: boolean
}

// ==================== 工具类型 ====================

export type Nullable<T> = T | null
export type Optional<T> = T | undefined
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}
