// 项目方提交的项目数据

export interface ProjectSubmission {
  id: string
  ownerId: string // 对应 demo-users.ts 中的 project owner ID
  ownerName: string
  title: string
  description: string
  type: string // CO_INVESTMENT 或其他类型
  originalCategory?: string // 对于跟投项目，保存原始类别
  targetAmount: number
  minInvestment: number
  maxInvestment: number
  expectedReturn: {
    min: number
    max: number
    type: string
  }
  revenueStructure: Record<string, number>
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH'
  region: string
  city: string
  investmentPeriod: number // 投资期限（月）
  fundingDeadline: string
  status: 'DRAFT' | 'PENDING' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED' | 'LISTED' | 'FUNDING' | 'FUNDED'
  submittedAt?: string
  reviewedAt?: string
  reviewNotes?: string
  documents?: {
    name: string
    url: string
    type: string
  }[]
  createdAt: string
  updatedAt: string
}

// Demo项目数据
export const demoProjects: ProjectSubmission[] = [
  // ========== 华娱文化传媒集团的项目 ==========
  // 项目1：已提交审核中
  {
    id: 'project-submit-001',
    ownerId: 'project-owner-001',
    ownerName: '华娱文化传媒集团',
    title: '周杰伦"地表最强"世界巡回演唱会收益权',
    description: `周杰伦2026年"地表最强"世界巡回演唱会中国站收益权融资项目。

【项目概况】
周杰伦作为华语乐坛天王，本次巡演计划覆盖北京、上海、深圳、成都、杭州5座城市，共计12场演唱会。每场场馆容量4-6万人，预计总观众人数超60万。

【收益来源】
1. 门票收入：约占总收入的65%
   - VIP座位：2880-8880元/张
   - 看台座位：580-1880元/张
   - 预计总票房收入：3.2亿元

2. 赞助与广告：约占总收入的25%
   - 主赞助商：某国际饮料品牌，5000万
   - 其他赞助：服装、汽车、电子产品等，共计3000万

3. 周边商品：约占总收入的10%
   - 演唱会纪念T恤、海报、应援物品等
   - 预计销售额：4000万元

【财务预测】
- 项目总投资需求：1500万元
- 预计总收入：4.2亿元
- 预计净利润：2500万元
- 投资者收益：18-28%（12个月）

【风险控制】
- 已签订场馆租赁合同
- 与周杰伦经纪公司签订演出合约
- 票务系统由大麦网独家代理
- 购买演出取消保险

【投资亮点】
✓ 头部艺人，粉丝基础庞大，票房有保障
✓ 多元化收入来源，降低单一风险
✓ 成熟的运营团队，操盘过多场大型演唱会
✓ 短周期高回报，资金周转快`,
    type: 'CO_INVESTMENT',
    originalCategory: 'CONCERT_TICKET',
    targetAmount: 15000000,
    minInvestment: 500000,
    maxInvestment: 5000000,
    expectedReturn: {
      min: 18,
      max: 28,
      type: '项目收益',
    },
    revenueStructure: {
      '门票收入': 65,
      '赞助广告': 25,
      '周边商品': 10,
    },
    riskLevel: 'MEDIUM',
    region: '全国',
    city: '北京',
    investmentPeriod: 12,
    fundingDeadline: '2026-03-31',
    status: 'UNDER_REVIEW', // 已提交，正在审核中
    submittedAt: '2026-01-20T10:30:00.000Z',
    documents: [
      {
        name: '演出合同.pdf',
        url: '/documents/project-001/contract.pdf',
        type: 'application/pdf',
      },
      {
        name: '场馆租赁协议.pdf',
        url: '/documents/project-001/venue.pdf',
        type: 'application/pdf',
      },
      {
        name: '财务预测表.xlsx',
        url: '/documents/project-001/financial.xlsx',
        type: 'application/vnd.ms-excel',
      },
    ],
    createdAt: '2026-01-15T14:20:00.000Z',
    updatedAt: '2026-01-20T10:30:00.000Z',
  },

  // 项目2：草稿状态，可以编辑和提交
  {
    id: 'project-submit-002',
    ownerId: 'project-owner-001',
    ownerName: '华娱文化传媒集团',
    title: '五月天"人生无限公司"巡回演唱会收益权',
    description: `五月天2026年"人生无限公司"世界巡回演唱会中国站收益权融资项目。

【项目概况】
五月天作为华语乐坛常青树乐团，本次巡演计划覆盖上海、广州、成都、武汉、南京6座城市，共计15场演唱会。每场场馆容量3-5万人，预计总观众人数超55万。

【收益来源】
1. 门票收入：约占总收入的70%
   - VIP座位：2580-6880元/张
   - 看台座位：480-1580元/张
   - 预计总票房收入：2.8亿元

2. 赞助与广告：约占总收入的20%
   - 主赞助商合作
   - 品牌联名推广
   - 共计5000万

3. 周边商品与直播版权：约占总收入的10%
   - 应援物品、纪念品销售
   - 线上直播版权收入
   - 预计收入4000万元

【财务预测】
- 项目总投资需求：1200万元
- 预计总收入：3.7亿元
- 预计净利润：2000万元
- 投资者收益：15-25%（10个月）

【风险控制】
- 已签订场馆租赁意向书
- 与相信音乐签订演出合作协议
- 票务系统由大麦网独家代理
- 购买演出取消保险

【投资亮点】
✓ 乐团成熟稳定，粉丝忠诚度极高
✓ 多场演唱会分散风险
✓ 丰富的大型演唱会运营经验
✓ 短周期投资，回报稳健`,
    type: 'CO_INVESTMENT',
    originalCategory: 'CONCERT_TICKET',
    targetAmount: 12000000,
    minInvestment: 500000,
    maxInvestment: 3000000,
    expectedReturn: {
      min: 15,
      max: 25,
      type: '项目收益',
    },
    revenueStructure: {
      '门票收入': 70,
      '赞助广告': 20,
      '周边与直播': 10,
    },
    riskLevel: 'MEDIUM',
    region: '全国',
    city: '上海',
    investmentPeriod: 10,
    fundingDeadline: '2026-04-30',
    status: 'PENDING', // 已提交，等待审核
    submittedAt: '2026-01-23T14:30:00.000Z',
    createdAt: '2026-01-22T09:15:00.000Z',
    updatedAt: '2026-01-23T14:30:00.000Z',
  },
]

// 将项目提交数据转换为资产列表格式（审核通过后）
export function projectToAsset(project: ProjectSubmission) {
  return {
    id: `asset-from-${project.id}`,
    projectId: project.id, // 保存原项目ID，方便反向查找
    title: project.title,
    description: project.description,
    type: project.type,
    originalCategory: project.originalCategory,
    targetAmount: project.targetAmount,
    raisedAmount: 0, // 刚上架时为0
    minInvestment: project.minInvestment,
    maxInvestment: project.maxInvestment,
    expectedReturn: project.expectedReturn,
    revenueStructure: project.revenueStructure,
    riskLevel: project.riskLevel,
    riskScore: project.riskLevel === 'LOW' ? 30 : project.riskLevel === 'MEDIUM' ? 50 : 70,
    region: project.region,
    city: project.city,
    status: 'FUNDING', // 批准后立即进入募资状态
    fundingDeadline: project.fundingDeadline,
    investmentPeriod: project.investmentPeriod,
    dueDiligence: {
      '财务审计': true,
      '法律合规': true,
      '运营评估': true,
      '市场分析': true,
    },
    createdAt: project.createdAt,
    updatedAt: new Date().toISOString(),
  }
}
