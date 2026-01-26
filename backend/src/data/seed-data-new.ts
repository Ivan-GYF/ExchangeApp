// 预设案例数据

// ========== MIFC 主基金（2个：LP份额 + ABS份额）==========
export const mifcFundAssets = [
  {
    id: 'mifc-fund-lp-001',
    title: 'MIFC主基金LP份额 2024-Q1期',
    description: `MIFC主基金劣后级LP份额，总规模5亿元人民币，本份额为劣后级4亿元。主基金投资于各类优质收入分成项目，包括文化娱乐、体育赛事、校园设施等多元化资产。
    
【基金结构】
• 总规模：5亿元人民币
• 劣后级（LP份额）：4亿元，目标年化收益15%
• 优先级（ABS份额）：1亿元，固定年化收益8%
• 风险缓冲：优先级享有优先受偿权，劣后级承担首亏风险

【投资策略】
主基金采用分散投资策略，单一项目投资限额1000万元，确保风险可控。投资标的包括但不限于：
• 大型演唱会门票收入分成
• 体育场馆赛事收益权
• 校园智慧设施运营收入
• 新媒体流量变现收益

【收益分配】
基础收益：年化15%
超额收益：主基金整体收益超过8%部分，优先级获得固定8%后，剩余收益的80%归劣后级投资人

【风险提示】
劣后级份额承担优先级保本保息义务，存在本金损失风险。适合风险承受能力较强的机构投资者。`,
    type: 'MIFC_FUND_LP',
    targetAmount: 400000000,  // 4亿
    raisedAmount: 280000000,  // 已募2.8亿
    minInvestment: 5000000,   // 500万起投
    maxInvestment: 100000000, // 单笔上限1亿
    expectedReturn: { min: 15, max: 20, type: '年化收益+超额分成' },
    revenueStructure: {
      '基础收益（15%）': 75,
      '超额收益分成': 25,
    },
    riskLevel: 'HIGH',
    riskScore: 68,
    region: '全国',
    city: '上海',
    status: 'FUNDING',
    fundingDeadline: '2026-03-31',
    investmentPeriod: 60, // 5年期
    dueDiligence: {
      '财务审计': true,
      '法律合规': true,
      '风险评估': true,
      '投资策略审查': true,
    },
    fundStructure: {
      totalScale: 500000000,
      priority: 'JUNIOR',
      seniorScale: 100000000,
      juniorScale: 400000000,
    },
    createdAt: '2024-01-15T00:00:00.000Z',
    updatedAt: '2026-01-26T00:00:00.000Z',
  },
  {
    id: 'mifc-abs-001',
    title: 'MIFC主基金ABS优先级份额 2024-A1',
    description: `MIFC主基金资产支持证券优先级份额，享有5亿元资产组合的优先受偿权，4亿元劣后级份额提供80%的安全垫。
    
【产品特点】
• 优先受偿：在资产收益分配和本金偿付中享有优先权
• 固定收益：年化8%固定收益，按季度付息
• 安全保障：80%劣后级份额作为风险缓冲
• 流动性安排：持有满18个月后可申请转让

【基金结构】
• 总规模：5亿元人民币
• 优先级（ABS份额）：1亿元，固定年化8%
• 劣后级（LP份额）：4亿元，剩余收益
• 安全垫比例：80%

【底层资产】
主基金投资于经过严格筛选的收入分成项目：
• 现金流稳定的文娱体育项目
• 头部IP演唱会收益权
• 成熟运营的体育场馆
• 校园场景智慧设施

【增信措施】
1. 劣后级4亿元承担首亏风险
2. 主基金分散投资，单一项目限额1000万
3. 专业资产管理团队运营
4. 定期信息披露与风险监控

【适合人群】
追求稳健收益的机构投资者、信托计划、资管产品等。`,
    type: 'MIFC_ABS',
    targetAmount: 100000000,  // 1亿
    raisedAmount: 65000000,   // 已募6500万
    minInvestment: 3000000,   // 300万起投
    maxInvestment: 30000000,  // 单笔上限3000万
    expectedReturn: { min: 8, max: 8, type: '固定年化收益' },
    revenueStructure: {
      '固定利息收入': 100,
    },
    riskLevel: 'LOW',
    riskScore: 25,
    region: '全国',
    city: '上海',
    status: 'FUNDING',
    fundingDeadline: '2026-02-28',
    investmentPeriod: 36, // 3年期
    dueDiligence: {
      '财务审计': true,
      '法律合规': true,
      '风险评估': true,
      '信用评级': true,
    },
    fundStructure: {
      totalScale: 500000000,
      priority: 'SENIOR',
      seniorScale: 100000000,
      juniorScale: 400000000,
    },
    createdAt: '2024-01-15T00:00:00.000Z',
    updatedAt: '2026-01-26T00:00:00.000Z',
  },
]

// ========== 跟投项目（8个）==========
export const seedAssets = [
  // 演唱会类
  {
    id: 'asset-001',
    title: '周杰伦2026巡回演唱会收益权（跟投）',
    description: `【跟投机会】本项目为MIFC主基金投资溢出份额。项目总需求1500万，主基金投资1000万（单项目限额），溢出500万开放跟投。

周杰伦"嘉年华"世界巡回演唱会中国站门票销售及周边商品收益权，预计观众超40万人次。跟投投资人与主基金享有同等权益。`,
    type: 'CO_INVESTMENT',
    originalCategory: 'CONCERT_TICKET',
    targetAmount: 5000000,
    raisedAmount: 3500000,
    minInvestment: 500000,
    maxInvestment: 5000000,
    expectedReturn: { min: 18, max: 28, type: '项目收益' },
    revenueStructure: { '门票销售': 75, '周边商品': 15, '赞助收入': 10 },
    riskLevel: 'MEDIUM',
    riskScore: 55,
    region: '全国',
    city: '北京',
    status: 'FUNDING',
    fundingDeadline: '2026-02-01',
    investmentPeriod: 8,
    dueDiligence: { '财务审计': true, '法律合规': true, '运营评估': true, '市场分析': true },
    overflowFrom: {
      fundId: 'mifc-fund-lp-001',
      fundName: 'MIFC主基金LP份额 2024-Q1期',
      projectInvestLimit: 10000000,
      projectTotalNeed: 15000000,
      overflowAmount: 5000000,
    },
    createdAt: '2025-12-20T00:00:00.000Z',
    updatedAt: '2026-01-26T00:00:00.000Z',
  },
  {
    id: 'asset-002',
    title: 'TFBOYS十周年演唱会收益权（跟投）',
    description: `【跟投机会】项目总需求2150万，主基金投资1000万，溢出1150万开放跟投。

TFBOYS成团十周年纪念演唱会全国巡演收益权，覆盖10城15场，粉丝基础庞大。`,
    type: 'CO_INVESTMENT',
    originalCategory: 'CONCERT_TICKET',
    targetAmount: 11500000,
    raisedAmount: 8000000,
    minInvestment: 500000,
    maxInvestment: 5000000,
    expectedReturn: { min: 15, max: 25, type: '项目收益' },
    revenueStructure: { '门票销售': 70, '周边商品': 20, '直播版权': 10 },
    riskLevel: 'MEDIUM',
    riskScore: 52,
    region: '全国',
    city: '深圳',
    status: 'FUNDING',
    fundingDeadline: '2026-03-15',
    investmentPeriod: 10,
    dueDiligence: { '财务审计': true, '法律合规': true, '运营评估': true, '市场分析': true },
    overflowFrom: {
      fundId: 'mifc-fund-lp-001',
      fundName: 'MIFC主基金LP份额 2024-Q1期',
      projectInvestLimit: 10000000,
      projectTotalNeed: 21500000,
      overflowAmount: 11500000,
    },
    createdAt: '2026-01-02T00:00:00.000Z',
    updatedAt: '2026-01-26T00:00:00.000Z',
  },

  // 赛车场类
  {
    id: 'asset-003',
    title: '上海F1赛车场赛事收益权（跟投）',
    description: `【跟投机会】项目总需求3250万，主基金投资1000万，溢出2250万开放跟投。

上海国际赛车场F1大奖赛及全年赛事运营收益权，年均50+场赛事，现金流稳定。`,
    type: 'CO_INVESTMENT',
    originalCategory: 'RACING_TRACK',
    targetAmount: 22500000,
    raisedAmount: 16000000,
    minInvestment: 1000000,
    maxInvestment: 10000000,
    expectedReturn: { min: 12, max: 18, type: '年化收益' },
    revenueStructure: { '门票收入': 40, '赛事承办': 35, '商业租赁': 25 },
    riskLevel: 'MEDIUM',
    riskScore: 45,
    region: '华东',
    city: '上海',
    status: 'FUNDING',
    fundingDeadline: '2026-03-31',
    investmentPeriod: 36,
    dueDiligence: { '财务审计': true, '法律合规': true, '运营评估': true, '市场分析': true },
    overflowFrom: {
      fundId: 'mifc-fund-lp-001',
      fundName: 'MIFC主基金LP份额 2024-Q1期',
      projectInvestLimit: 10000000,
      projectTotalNeed: 32500000,
      overflowAmount: 22500000,
    },
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-26T00:00:00.000Z',
  },
  {
    id: 'asset-004',
    title: '珠海赛车场GT赛事运营权（跟投）',
    description: `【跟投机会】项目总需求1800万，主基金投资1000万，溢出800万开放跟投。

珠海国际赛车场GT系列赛及改装车文化节收益权，多元收入来源。`,
    type: 'CO_INVESTMENT',
    originalCategory: 'RACING_TRACK',
    targetAmount: 8000000,
    raisedAmount: 5000000,
    minInvestment: 500000,
    maxInvestment: 3000000,
    expectedReturn: { min: 10, max: 15, type: '年化收益' },
    revenueStructure: { '门票收入': 35, '赛事承办': 30, '品牌赞助': 20, '周边销售': 15 },
    riskLevel: 'MEDIUM',
    riskScore: 50,
    region: '华南',
    city: '珠海',
    status: 'FUNDING',
    fundingDeadline: '2026-04-15',
    investmentPeriod: 24,
    dueDiligence: { '财务审计': true, '法律合规': true, '运营评估': true, '市场分析': false },
    overflowFrom: {
      fundId: 'mifc-fund-lp-001',
      fundName: 'MIFC主基金LP份额 2024-Q1期',
      projectInvestLimit: 10000000,
      projectTotalNeed: 18000000,
      overflowAmount: 8000000,
    },
    createdAt: '2026-01-05T00:00:00.000Z',
    updatedAt: '2026-01-26T00:00:00.000Z',
  },

  // 新媒体流量类
  {
    id: 'asset-005',
    title: '头部美妆KOL矩阵投流收益权（跟投）',
    description: `【跟投机会】项目总需求2000万，主基金投资1000万，溢出1000万开放跟投。

投资TOP50美妆类抖音达人矩阵广告投放收益权，覆盖粉丝5亿+，月均GMV超2亿元。`,
    type: 'CO_INVESTMENT',
    originalCategory: 'STREAMING',
    targetAmount: 10000000,
    raisedAmount: 10000000,
    minInvestment: 500000,
    maxInvestment: 2000000,
    expectedReturn: { min: 25, max: 40, type: '年化收益' },
    revenueStructure: { '广告投放ROI分成': 70, '直播带货佣金': 20, '品牌合作': 10 },
    riskLevel: 'HIGH',
    riskScore: 72,
    region: '全国',
    city: '杭州',
    status: 'FUNDED',
    fundingDeadline: '2026-01-15',
    investmentPeriod: 12,
    dueDiligence: { '财务审计': true, '法律合规': true, '运营评估': true, '市场分析': true },
    overflowFrom: {
      fundId: 'mifc-fund-lp-001',
      fundName: 'MIFC主基金LP份额 2024-Q1期',
      projectInvestLimit: 10000000,
      projectTotalNeed: 20000000,
      overflowAmount: 10000000,
    },
    createdAt: '2025-12-01T00:00:00.000Z',
    updatedAt: '2026-01-26T00:00:00.000Z',
  },
  {
    id: 'asset-006',
    title: '3C数码垂类达人投流项目（跟投）',
    description: `【跟投机会】项目总需求1500万，主基金投资1000万，溢出500万开放跟投。

聚焦3C数码领域抖音达人投流，合作达人包括科技测评、数码开箱等垂类头部账号。`,
    type: 'CO_INVESTMENT',
    originalCategory: 'STREAMING',
    targetAmount: 5000000,
    raisedAmount: 3000000,
    minInvestment: 300000,
    maxInvestment: 1500000,
    expectedReturn: { min: 20, max: 35, type: '年化收益' },
    revenueStructure: { '广告投放ROI分成': 65, '品牌定制内容': 25, '电商佣金': 10 },
    riskLevel: 'HIGH',
    riskScore: 68,
    region: '全国',
    city: '深圳',
    status: 'FUNDING',
    fundingDeadline: '2026-02-28',
    investmentPeriod: 12,
    dueDiligence: { '财务审计': true, '法律合规': true, '运营评估': false, '市场分析': true },
    overflowFrom: {
      fundId: 'mifc-fund-lp-001',
      fundName: 'MIFC主基金LP份额 2024-Q1期',
      projectInvestLimit: 10000000,
      projectTotalNeed: 15000000,
      overflowAmount: 5000000,
    },
    createdAt: '2026-01-10T00:00:00.000Z',
    updatedAt: '2026-01-26T00:00:00.000Z',
  },

  // 校园设施类
  {
    id: 'asset-007',
    title: '华东高校智慧零售项目（跟投）',
    description: `【跟投机会】项目总需求2500万，主基金投资1000万，溢出1500万开放跟投。

覆盖上海、杭州、南京等地30所高校的天猫校园智慧便利店项目，服务学生50万+。`,
    type: 'CO_INVESTMENT',
    originalCategory: 'CAMPUS_FACILITY',
    targetAmount: 15000000,
    raisedAmount: 12000000,
    minInvestment: 200000,
    maxInvestment: 2500000,
    expectedReturn: { min: 8, max: 12, type: '年化收益' },
    revenueStructure: { '销售额分成': 60, '租金收益': 25, '广告位收入': 15 },
    riskLevel: 'LOW',
    riskScore: 28,
    region: '华东',
    city: '上海',
    status: 'FUNDING',
    fundingDeadline: '2026-02-15',
    investmentPeriod: 48,
    dueDiligence: { '财务审计': true, '法律合规': true, '运营评估': true, '市场分析': true },
    overflowFrom: {
      fundId: 'mifc-fund-lp-001',
      fundName: 'MIFC主基金LP份额 2024-Q1期',
      projectInvestLimit: 10000000,
      projectTotalNeed: 25000000,
      overflowAmount: 15000000,
    },
    createdAt: '2025-11-15T00:00:00.000Z',
    updatedAt: '2026-01-26T00:00:00.000Z',
  },
  {
    id: 'asset-008',
    title: '西南高校自助服务设施项目（跟投）',
    description: `【跟投机会】项目总需求1800万，主基金投资1000万，溢出800万开放跟投。

成都、重庆20所高校的自助洗衣、打印、智能快递柜等校园服务设施运营收益权。`,
    type: 'CO_INVESTMENT',
    originalCategory: 'CAMPUS_FACILITY',
    targetAmount: 8000000,
    raisedAmount: 3000000,
    minInvestment: 100000,
    maxInvestment: 1800000,
    expectedReturn: { min: 7, max: 11, type: '年化收益' },
    revenueStructure: { '服务收入': 55, '设备租赁': 30, '广告收入': 15 },
    riskLevel: 'LOW',
    riskScore: 25,
    region: '西南',
    city: '成都',
    status: 'FUNDING',
    fundingDeadline: '2026-05-01',
    investmentPeriod: 36,
    dueDiligence: { '财务审计': true, '法律合规': true, '运营评估': true, '市场分析': false },
    overflowFrom: {
      fundId: 'mifc-fund-lp-001',
      fundName: 'MIFC主基金LP份额 2024-Q1期',
      projectInvestLimit: 10000000,
      projectTotalNeed: 18000000,
      overflowAmount: 8000000,
    },
    createdAt: '2026-01-08T00:00:00.000Z',
    updatedAt: '2026-01-26T00:00:00.000Z',
  },
]

// 合并所有资产（用于统一导出）
export const allAssets = [...mifcFundAssets, ...seedAssets]

// Dashboard 统计数据
export const dashboardStats = {
  totalInvestment: 283000000,
  activeOpportunities: 10,  // 2个母基金 + 8个跟投
  matchedTransactions: 156,
  portfolioReturn: 15.8,
}

// 趋势数据
export const trendData = {
  MIFC_FUND_LP: [
    { date: '2024-01', value: 0 },
    { date: '2024-03', value: 50000000 },
    { date: '2024-06', value: 120000000 },
    { date: '2024-09', value: 200000000 },
    { date: '2024-12', value: 250000000 },
    { date: '2026-01', value: 280000000 },
  ],
  MIFC_ABS: [
    { date: '2024-01', value: 0 },
    { date: '2024-03', value: 20000000 },
    { date: '2024-06', value: 40000000 },
    { date: '2024-09', value: 50000000 },
    { date: '2024-12', value: 60000000 },
    { date: '2026-01', value: 65000000 },
  ],
  CO_INVESTMENT: [
    { date: '2024-01', value: 8000000 },
    { date: '2024-03', value: 25000000 },
    { date: '2024-06', value: 42000000 },
    { date: '2024-09', value: 58000000 },
    { date: '2024-12', value: 75000000 },
    { date: '2026-01', value: 89000000 },
  ],
}

// 中央厨房概览数据
export const centralKitchenData = {
  totalAssets: 10,
  assetPipeline: 12,
  pendingApproval: 2,
  systemHealth: 98,
  pipeline: {
    acquisition: 3,
    dueDiligence: 2,
    pricing: 1,
    listed: 10,
    matched: 8,
  },
  distribution: {
    MIFC_FUND_LP: 1,
    MIFC_ABS: 1,
    CO_INVESTMENT: 8,
  },
}

// 活动日志
export const recentActivities = [
  {
    id: 'act-001',
    type: 'INVESTMENT_MADE',
    description: '鼎盛资本投资了"MIFC主基金LP份额 2024-Q1期" ¥20,000,000',
    createdAt: '2026-01-25T06:30:00.000Z',
  },
  {
    id: 'act-002',
    type: 'ASSET_APPROVED',
    description: '"周杰伦2026巡回演唱会收益权（跟投）"通过尽职调查审核',
    createdAt: '2026-01-24T14:20:00.000Z',
  },
  {
    id: 'act-003',
    type: 'DIVIDEND_PAID',
    description: '"头部美妆KOL矩阵投流收益权"项目完成Q4分红派发',
    createdAt: '2026-01-23T10:00:00.000Z',
  },
  {
    id: 'act-004',
    type: 'MILESTONE_REACHED',
    description: '"MIFC主基金ABS优先级份额"达成65%融资目标',
    createdAt: '2026-01-22T16:45:00.000Z',
  },
  {
    id: 'act-005',
    type: 'ASSET_SUBMITTED',
    description: '新跟投项目"草莓音乐节2026巡演收益权"已提交审核',
    createdAt: '2026-01-21T09:15:00.000Z',
  },
]

// 预设投资记录
export const seedInvestments = [
  {
    id: 'inv-demo-001',
    userId: 'investor-inst-001', // 鼎盛资本
    assetId: 'mifc-fund-lp-001',
    amount: 20000000,  // 2000万投主基金LP
    managementFee: 400000,
    transactionFee: 200000,
    netAmount: 19400000,
    currentValue: 20500000,
    returnRate: 5.67,
    status: 'CONFIRMED',
    pNoteNumber: 'PN-MIFCLP001',
    createdAt: '2024-02-15T10:30:00.000Z',
    updatedAt: '2026-01-26T00:00:00.000Z',
  },
  {
    id: 'inv-demo-002',
    userId: 'investor-inst-002', // 海通证券
    assetId: 'mifc-abs-001',
    amount: 15000000,  // 1500万投ABS
    managementFee: 300000,
    transactionFee: 150000,
    netAmount: 14550000,
    currentValue: 15500000,
    returnRate: 6.53,
    status: 'CONFIRMED',
    pNoteNumber: 'PN-MIFCABS001',
    createdAt: '2024-03-10T14:20:00.000Z',
    updatedAt: '2026-01-26T00:00:00.000Z',
  },
  {
    id: 'inv-demo-003',
    userId: 'investor-inst-003', // 平安信托
    assetId: 'asset-005',  // 美妆KOL（已完成）
    amount: 2000000,
    managementFee: 40000,
    transactionFee: 20000,
    netAmount: 1940000,
    currentValue: 2450000,
    returnRate: 26.29,
    status: 'CONFIRMED',
    pNoteNumber: 'PN-COINV005',
    createdAt: '2025-12-05T09:00:00.000Z',
    updatedAt: '2026-01-26T00:00:00.000Z',
  },
  {
    id: 'inv-demo-004',
    userId: 'investor-individual-001', // 张明远
    assetId: 'asset-001',  // 周杰伦演唱会
    amount: 1000000,
    managementFee: 20000,
    transactionFee: 10000,
    netAmount: 970000,
    currentValue: 1050000,
    returnRate: 8.25,
    status: 'CONFIRMED',
    pNoteNumber: 'PN-COINV001',
    createdAt: '2026-01-05T16:45:00.000Z',
    updatedAt: '2026-01-26T00:00:00.000Z',
  },
]
