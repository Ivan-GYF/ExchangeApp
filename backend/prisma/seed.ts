import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('开始创建示例数据...')

  // 清空现有数据
  await prisma.activity.deleteMany()
  await prisma.dividend.deleteMany()
  await prisma.document.deleteMany()
  await prisma.milestone.deleteMany()
  await prisma.investment.deleteMany()
  await prisma.asset.deleteMany()
  await prisma.investorProfile.deleteMany()
  await prisma.user.deleteMany()

  // 创建测试用户
  const passwordHash = await bcrypt.hash('123456', 10)

  const investor = await prisma.user.create({
    data: {
      email: 'investor@example.com',
      passwordHash,
      name: '张投资',
      phone: '13800138000',
      role: 'INVESTOR',
    },
  })

  const admin = await prisma.user.create({
    data: {
      email: 'admin@example.com',
      passwordHash,
      name: '李管理',
      phone: '13800138001',
      role: 'ADMIN',
    },
  })

  const investor2 = await prisma.user.create({
    data: {
      email: 'investor2@example.com',
      passwordHash,
      name: '王富贵',
      phone: '13900139000',
      role: 'INVESTOR',
    },
  })

  const investor3 = await prisma.user.create({
    data: {
      email: 'investor3@example.com',
      passwordHash,
      name: '赵保守',
      phone: '13700137000',
      role: 'INVESTOR',
    },
  })

  const assetManager = await prisma.user.create({
    data: {
      email: 'manager@example.com',
      passwordHash,
      name: '刘经理',
      phone: '13600136000',
      role: 'ASSET_MANAGER',
    },
  })

  console.log('✓ 创建了测试用户')

  // 创建投资者画像
  await prisma.investorProfile.create({
    data: {
      userId: investor.id,
      investmentRangeMin: 500000,
      investmentRangeMax: 3000000,
      riskTolerance: 'BALANCED',
      preferredTypes: 'RACING_TRACK,CAMPUS_FACILITY',
      preferredRegions: '北京,上海,深圳',
      returnExpectationMin: 8,
      returnExpectationMax: 15,
      aiMatchingEnabled: true,
    },
  })

  // 激进型投资者画像
  await prisma.investorProfile.create({
    data: {
      userId: investor2.id,
      investmentRangeMin: 1000000,
      investmentRangeMax: 5000000,
      riskTolerance: 'AGGRESSIVE',
      preferredTypes: 'DOUYIN_STREAMING,CONCERT_TICKET',
      preferredRegions: '全国',
      returnExpectationMin: 15,
      returnExpectationMax: 25,
      aiMatchingEnabled: true,
    },
  })

  // 保守型投资者画像
  await prisma.investorProfile.create({
    data: {
      userId: investor3.id,
      investmentRangeMin: 200000,
      investmentRangeMax: 1000000,
      riskTolerance: 'CONSERVATIVE',
      preferredTypes: 'CAMPUS_FACILITY',
      preferredRegions: '北京,上海',
      returnExpectationMin: 5,
      returnExpectationMax: 10,
      aiMatchingEnabled: true,
    },
  })

  console.log('✓ 创建了投资者画像')

  // 创建资产 - 轻资产赛道收入分成
  const racingTrack1 = await prisma.asset.create({
    data: {
      title: '某一线城市赛道场馆收益权',
      description: '位于一线城市核心区域的专业赛车场馆，拥有完善的赛道设施和配套商业。场馆定期举办各类赛事活动，包括商业赛事、培训活动等。收益来源稳定多元，包括门票收入、赛事承办费用和商业租赁收入。',
      type: 'RACING_TRACK',
      targetAmount: 3000000,
      raisedAmount: 1850000,
      minInvestment: 100000,
      maxInvestment: 2000000,
      expectedReturnMin: 10,
      expectedReturnMax: 12,
      expectedReturnType: 'annual',
      revenueStructure: JSON.stringify({
        ticketSales: 40,
        eventHosting: 35,
        commercialRental: 25,
      }),
      riskLevel: 'MEDIUM',
      riskScore: 7.8,
      region: '北京',
      city: '北京市',
      status: 'FUNDING',
      fundingDeadline: new Date('2026-02-15'),
      investmentPeriod: 36,
      dueDiligence: JSON.stringify({
        operatingLicense: true,
        revenueContract: true,
        historicalAudit: true,
      }),
    },
  })

  const racingTrack2 = await prisma.asset.create({
    data: {
      title: '华东地区赛道运营收益权',
      description: '华东地区知名赛车场，年均举办赛事超过50场，拥有稳定的会员基础和商业合作伙伴。',
      type: 'RACING_TRACK',
      targetAmount: 2500000,
      raisedAmount: 800000,
      minInvestment: 100000,
      maxInvestment: 1500000,
      expectedReturnMin: 9,
      expectedReturnMax: 11,
      expectedReturnType: 'annual',
      revenueStructure: JSON.stringify({
        ticketSales: 45,
        eventHosting: 30,
        commercialRental: 25,
      }),
      riskLevel: 'MEDIUM',
      riskScore: 7.5,
      region: '上海',
      city: '上海市',
      status: 'LISTED',
      fundingDeadline: new Date('2026-03-20'),
      investmentPeriod: 36,
      dueDiligence: JSON.stringify({
        operatingLicense: true,
        revenueContract: true,
        historicalAudit: true,
      }),
    },
  })

  // 创建资产 - 抖音投流收入分成
  const douyinStreaming1 = await prisma.asset.create({
    data: {
      title: '头部美妆主播抖音投流项目',
      description: '与知名美妆主播合作的投流项目，主播拥有500万+粉丝，历史ROI稳定在15-20%之间。投放品类包括美妆、护肤、个护等高转化品类。',
      type: 'DOUYIN_STREAMING',
      targetAmount: 1000000,
      raisedAmount: 650000,
      minInvestment: 50000,
      maxInvestment: 1000000,
      expectedReturnMin: 15,
      expectedReturnMax: 20,
      expectedReturnType: 'annual',
      revenueStructure: JSON.stringify({
        adROI: 100,
      }),
      riskLevel: 'HIGH',
      riskScore: 6.5,
      region: '全国',
      city: '杭州市',
      status: 'LISTED',
      fundingDeadline: new Date('2026-02-28'),
      investmentPeriod: 12,
      dueDiligence: JSON.stringify({
        mcnContract: true,
        historicalData: true,
        platformVerification: true,
      }),
    },
  })

  const douyinStreaming2 = await prisma.asset.create({
    data: {
      title: '知名服饰品牌投流合作项目',
      description: '与国内知名服饰品牌合作，通过多个中腰部达人进行矩阵式投放，覆盖年轻女性群体。',
      type: 'DOUYIN_STREAMING',
      targetAmount: 800000,
      raisedAmount: 300000,
      minInvestment: 50000,
      maxInvestment: 500000,
      expectedReturnMin: 12,
      expectedReturnMax: 18,
      expectedReturnType: 'annual',
      revenueStructure: JSON.stringify({
        adROI: 100,
      }),
      riskLevel: 'HIGH',
      riskScore: 6.8,
      region: '全国',
      city: '广州市',
      status: 'LISTED',
      fundingDeadline: new Date('2026-03-10'),
      investmentPeriod: 12,
      dueDiligence: JSON.stringify({
        brandContract: true,
        historicalData: true,
        platformVerification: true,
      }),
    },
  })

  // 创建资产 - 天猫校园设施收入分成
  const campusFacility1 = await prisma.asset.create({
    data: {
      title: '985高校天猫便利店收益权',
      description: '位于国内顶尖985高校校园内的天猫便利店，学生群体稳定，消费需求旺盛。店铺经营品类齐全，包括零食饮料、日用品、文具等。寒暑假期间营业额略有波动，但整体收益稳定。',
      type: 'CAMPUS_FACILITY',
      targetAmount: 1500000,
      raisedAmount: 900000,
      minInvestment: 80000,
      maxInvestment: 1500000,
      expectedReturnMin: 8,
      expectedReturnMax: 10,
      expectedReturnType: 'annual',
      revenueStructure: JSON.stringify({
        salesCommission: 70,
        rentalIncome: 30,
      }),
      riskLevel: 'LOW',
      riskScore: 8.5,
      region: '北京',
      city: '北京市',
      status: 'LISTED',
      fundingDeadline: new Date('2026-03-31'),
      investmentPeriod: 48,
      dueDiligence: JSON.stringify({
        schoolContract: true,
        operatingLicense: true,
        historicalRevenue: true,
      }),
    },
  })

  const campusFacility2 = await prisma.asset.create({
    data: {
      title: '211高校校园服务设施收益权',
      description: '包含便利店、打印店、快递站等多个服务设施的综合收益权，位于华东地区211高校。',
      type: 'CAMPUS_FACILITY',
      targetAmount: 2000000,
      raisedAmount: 500000,
      minInvestment: 100000,
      maxInvestment: 1000000,
      expectedReturnMin: 7,
      expectedReturnMax: 9,
      expectedReturnType: 'annual',
      revenueStructure: JSON.stringify({
        salesCommission: 60,
        rentalIncome: 40,
      }),
      riskLevel: 'LOW',
      riskScore: 8.2,
      region: '上海',
      city: '上海市',
      status: 'LISTED',
      fundingDeadline: new Date('2026-04-15'),
      investmentPeriod: 48,
      dueDiligence: JSON.stringify({
        schoolContract: true,
        operatingLicense: true,
        historicalRevenue: true,
      }),
    },
  })

  // 创建资产 - 演唱会门票收入分成
  const concertTicket1 = await prisma.asset.create({
    data: {
      title: '知名歌手全国巡演票务收益权',
      description: '国内一线歌手全国巡演项目，计划在10个城市举办演唱会，预计总票房超过5000万。艺人粉丝基础稳固，历史演唱会上座率均在95%以上。',
      type: 'CONCERT_TICKET',
      targetAmount: 3000000,
      raisedAmount: 1200000,
      minInvestment: 150000,
      maxInvestment: 3000000,
      expectedReturnMin: 12,
      expectedReturnMax: 18,
      expectedReturnType: 'annual',
      revenueStructure: JSON.stringify({
        ticketSales: 80,
        merchandise: 20,
      }),
      riskLevel: 'MEDIUM',
      riskScore: 7.2,
      region: '全国',
      city: '北京市',
      status: 'LISTED',
      fundingDeadline: new Date('2026-02-20'),
      investmentPeriod: 18,
      dueDiligence: JSON.stringify({
        artistContract: true,
        venueBooking: true,
        insurancePolicy: true,
      }),
    },
  })

  const concertTicket2 = await prisma.asset.create({
    data: {
      title: '流行乐队巡回演出票务项目',
      description: '新生代流行乐队巡演项目，主要面向年轻群体，社交媒体热度高。',
      type: 'CONCERT_TICKET',
      targetAmount: 1500000,
      raisedAmount: 400000,
      minInvestment: 100000,
      maxInvestment: 1000000,
      expectedReturnMin: 10,
      expectedReturnMax: 15,
      expectedReturnType: 'annual',
      revenueStructure: JSON.stringify({
        ticketSales: 75,
        merchandise: 25,
      }),
      riskLevel: 'HIGH',
      riskScore: 6.8,
      region: '全国',
      city: '上海市',
      status: 'LISTED',
      fundingDeadline: new Date('2026-03-05'),
      investmentPeriod: 12,
      dueDiligence: JSON.stringify({
        artistContract: true,
        venueBooking: true,
        insurancePolicy: true,
      }),
    },
  })

  // 创建更多待审批资产（用于中央厨房管理）
  const pendingAsset1 = await prisma.asset.create({
    data: {
      title: '深圳南山区卡丁车场收益权',
      description: '位于深圳南山区的室内卡丁车场，面积3000平米，配备20辆专业卡丁车。周末及节假日客流量大，年营业额约800万元。',
      type: 'RACING_TRACK',
      targetAmount: 2000000,
      raisedAmount: 0,
      minInvestment: 100000,
      maxInvestment: 1000000,
      expectedReturnMin: 11,
      expectedReturnMax: 14,
      expectedReturnType: 'annual',
      revenueStructure: JSON.stringify({
        ticketSales: 60,
        membershipFees: 25,
        eventHosting: 15,
      }),
      riskLevel: 'MEDIUM',
      riskScore: 7.0,
      region: '深圳',
      city: '深圳市',
      status: 'PENDING',
      fundingDeadline: new Date('2026-04-30'),
      investmentPeriod: 36,
      dueDiligence: JSON.stringify({
        operatingLicense: true,
        revenueContract: true,
        historicalAudit: false,
      }),
    },
  })

  const pendingAsset2 = await prisma.asset.create({
    data: {
      title: '新兴美食博主抖音投流项目',
      description: '与快速成长的美食博主合作，粉丝量200万+，月均增长15%。主要推广地方特色美食和餐饮品牌。',
      type: 'DOUYIN_STREAMING',
      targetAmount: 600000,
      raisedAmount: 0,
      minInvestment: 50000,
      maxInvestment: 300000,
      expectedReturnMin: 18,
      expectedReturnMax: 25,
      expectedReturnType: 'annual',
      revenueStructure: JSON.stringify({
        adROI: 100,
      }),
      riskLevel: 'HIGH',
      riskScore: 6.0,
      region: '全国',
      city: '成都市',
      status: 'UNDER_REVIEW',
      fundingDeadline: new Date('2026-03-15'),
      investmentPeriod: 12,
      dueDiligence: JSON.stringify({
        mcnContract: true,
        historicalData: true,
        platformVerification: false,
      }),
    },
  })

  const pendingAsset3 = await prisma.asset.create({
    data: {
      title: '双一流大学校园快递站收益权',
      description: '位于华南地区双一流大学的校园快递站，日均包裹量3000+，覆盖3万名师生。',
      type: 'CAMPUS_FACILITY',
      targetAmount: 1200000,
      raisedAmount: 0,
      minInvestment: 80000,
      maxInvestment: 800000,
      expectedReturnMin: 9,
      expectedReturnMax: 11,
      expectedReturnType: 'annual',
      revenueStructure: JSON.stringify({
        serviceCommission: 80,
        advertisingIncome: 20,
      }),
      riskLevel: 'LOW',
      riskScore: 8.8,
      region: '广州',
      city: '广州市',
      status: 'PENDING',
      fundingDeadline: new Date('2026-05-01'),
      investmentPeriod: 48,
      dueDiligence: JSON.stringify({
        schoolContract: true,
        operatingLicense: true,
        historicalRevenue: true,
      }),
    },
  })

  const pendingAsset4 = await prisma.asset.create({
    data: {
      title: '音乐节票务及周边收益权',
      description: '大型户外音乐节项目，预计3天活动吸引5万人次，包含门票、餐饮、周边商品等多元收益。',
      type: 'CONCERT_TICKET',
      targetAmount: 4000000,
      raisedAmount: 0,
      minInvestment: 200000,
      maxInvestment: 2000000,
      expectedReturnMin: 15,
      expectedReturnMax: 22,
      expectedReturnType: 'annual',
      revenueStructure: JSON.stringify({
        ticketSales: 60,
        foodBeverage: 25,
        merchandise: 15,
      }),
      riskLevel: 'HIGH',
      riskScore: 6.5,
      region: '全国',
      city: '杭州市',
      status: 'UNDER_REVIEW',
      fundingDeadline: new Date('2026-03-25'),
      investmentPeriod: 6,
      dueDiligence: JSON.stringify({
        venueBooking: true,
        artistContract: false,
        insurancePolicy: true,
      }),
    },
  })

  // 额外的已上架资产
  const additionalAsset1 = await prisma.asset.create({
    data: {
      title: '珠海横琴赛道体验中心收益权',
      description: '位于珠海横琴新区的综合性赛车体验中心，包含室内外赛道、VR体验区和培训教室。',
      type: 'RACING_TRACK',
      targetAmount: 3500000,
      raisedAmount: 1200000,
      minInvestment: 150000,
      maxInvestment: 2000000,
      expectedReturnMin: 10,
      expectedReturnMax: 13,
      expectedReturnType: 'annual',
      revenueStructure: JSON.stringify({
        ticketSales: 50,
        trainingFees: 30,
        eventHosting: 20,
      }),
      riskLevel: 'MEDIUM',
      riskScore: 7.3,
      region: '珠海',
      city: '珠海市',
      status: 'LISTED',
      fundingDeadline: new Date('2026-04-10'),
      investmentPeriod: 36,
      dueDiligence: JSON.stringify({
        operatingLicense: true,
        revenueContract: true,
        historicalAudit: true,
      }),
    },
  })

  const additionalAsset2 = await prisma.asset.create({
    data: {
      title: '母婴品牌抖音矩阵投流项目',
      description: '与多个母婴KOL合作的矩阵投放项目，覆盖孕期、育儿等全场景，目标用户精准。',
      type: 'DOUYIN_STREAMING',
      targetAmount: 1200000,
      raisedAmount: 600000,
      minInvestment: 80000,
      maxInvestment: 800000,
      expectedReturnMin: 14,
      expectedReturnMax: 19,
      expectedReturnType: 'annual',
      revenueStructure: JSON.stringify({
        adROI: 100,
      }),
      riskLevel: 'MEDIUM',
      riskScore: 7.0,
      region: '全国',
      city: '北京市',
      status: 'LISTED',
      fundingDeadline: new Date('2026-03-20'),
      investmentPeriod: 18,
      dueDiligence: JSON.stringify({
        brandContract: true,
        historicalData: true,
        platformVerification: true,
      }),
    },
  })

  console.log('✓ 创建了14个示例资产（包含4个待审批资产）')

  // 为资产添加里程碑
  await prisma.milestone.createMany({
    data: [
      {
        assetId: racingTrack1.id,
        title: '完成募资',
        description: '达到目标募资金额',
        dueDate: new Date('2026-02-15'),
        status: 'PENDING',
      },
      {
        assetId: racingTrack1.id,
        title: 'Q1分红',
        description: '第一季度收益分配',
        dueDate: new Date('2026-04-30'),
        status: 'PENDING',
      },
      {
        assetId: douyinStreaming1.id,
        title: '首次投放结算',
        description: '第一轮投放活动结算',
        dueDate: new Date('2026-03-31'),
        status: 'PENDING',
      },
      {
        assetId: campusFacility1.id,
        title: '春季学期结算',
        description: '春季学期收益结算',
        dueDate: new Date('2026-07-15'),
        status: 'PENDING',
      },
      {
        assetId: concertTicket1.id,
        title: '首场演出',
        description: '全国巡演首场演出',
        dueDate: new Date('2026-05-01'),
        status: 'PENDING',
      },
    ],
  })

  console.log('✓ 创建了里程碑')

  // 创建一些投资记录（为测试用户）
  const investment1 = await prisma.investment.create({
    data: {
      userId: investor.id,
      assetId: racingTrack1.id,
      amount: 500000,
      managementFee: 10000,
      transactionFee: 5000,
      netAmount: 485000,
      currentValue: 562000,
      returnRate: 12.4,
      status: 'ACTIVE',
      pNoteNumber: 'PN-2026-001',
    },
  })

  const investment2 = await prisma.investment.create({
    data: {
      userId: investor.id,
      assetId: douyinStreaming1.id,
      amount: 300000,
      managementFee: 6000,
      transactionFee: 3000,
      netAmount: 291000,
      currentValue: 358000,
      returnRate: 19.3,
      status: 'ACTIVE',
      pNoteNumber: 'PN-2026-002',
    },
  })

  const investment3 = await prisma.investment.create({
    data: {
      userId: investor.id,
      assetId: campusFacility1.id,
      amount: 400000,
      managementFee: 8000,
      transactionFee: 4000,
      netAmount: 388000,
      currentValue: 445000,
      returnRate: 11.3,
      status: 'ACTIVE',
      pNoteNumber: 'PN-2026-003',
    },
  })

  // 激进型投资者的投资记录
  const investment4 = await prisma.investment.create({
    data: {
      userId: investor2.id,
      assetId: concertTicket1.id,
      amount: 2000000,
      managementFee: 40000,
      transactionFee: 20000,
      netAmount: 1940000,
      currentValue: 2280000,
      returnRate: 14.0,
      status: 'ACTIVE',
      pNoteNumber: 'PN-2026-004',
    },
  })

  const investment5 = await prisma.investment.create({
    data: {
      userId: investor2.id,
      assetId: douyinStreaming2.id,
      amount: 500000,
      managementFee: 10000,
      transactionFee: 5000,
      netAmount: 485000,
      currentValue: 595000,
      returnRate: 19.0,
      status: 'ACTIVE',
      pNoteNumber: 'PN-2026-005',
    },
  })

  // 保守型投资者的投资记录
  const investment6 = await prisma.investment.create({
    data: {
      userId: investor3.id,
      assetId: campusFacility2.id,
      amount: 300000,
      managementFee: 6000,
      transactionFee: 3000,
      netAmount: 291000,
      currentValue: 318000,
      returnRate: 6.0,
      status: 'ACTIVE',
      pNoteNumber: 'PN-2026-006',
    },
  })

  const investment7 = await prisma.investment.create({
    data: {
      userId: investor3.id,
      assetId: campusFacility1.id,
      amount: 200000,
      managementFee: 4000,
      transactionFee: 2000,
      netAmount: 194000,
      currentValue: 212000,
      returnRate: 6.0,
      status: 'ACTIVE',
      pNoteNumber: 'PN-2026-007',
    },
  })

  console.log('✓ 创建了7个投资记录')

  // 创建分红记录
  await prisma.dividend.createMany({
    data: [
      {
        investmentId: investment1.id,
        amount: 15000,
        type: 'QUARTERLY',
        period: 'Q4-2025',
        status: 'PAID',
        paidAt: new Date('2025-12-31'),
      },
      {
        investmentId: investment1.id,
        amount: 16000,
        type: 'QUARTERLY',
        period: 'Q1-2026',
        status: 'PENDING',
      },
      {
        investmentId: investment2.id,
        amount: 12000,
        type: 'CAMPAIGN',
        period: '2025-12',
        status: 'PAID',
        paidAt: new Date('2025-12-15'),
      },
      {
        investmentId: investment3.id,
        amount: 11000,
        type: 'QUARTERLY',
        period: 'Q4-2025',
        status: 'PAID',
        paidAt: new Date('2025-12-31'),
      },
      {
        investmentId: investment4.id,
        amount: 70000,
        type: 'QUARTERLY',
        period: 'Q4-2025',
        status: 'PAID',
        paidAt: new Date('2025-12-31'),
      },
      {
        investmentId: investment4.id,
        amount: 75000,
        type: 'QUARTERLY',
        period: 'Q1-2026',
        status: 'PENDING',
      },
      {
        investmentId: investment5.id,
        amount: 24000,
        type: 'CAMPAIGN',
        period: '2026-01',
        status: 'PAID',
        paidAt: new Date('2026-01-15'),
      },
      {
        investmentId: investment6.id,
        amount: 5500,
        type: 'QUARTERLY',
        period: 'Q4-2025',
        status: 'PAID',
        paidAt: new Date('2025-12-31'),
      },
      {
        investmentId: investment7.id,
        amount: 3000,
        type: 'QUARTERLY',
        period: 'Q4-2025',
        status: 'PAID',
        paidAt: new Date('2025-12-31'),
      },
    ],
  })

  console.log('✓ 创建了分红记录')

  // 创建活动日志
  await prisma.activity.createMany({
    data: [
      {
        userId: admin.id,
        type: 'ASSET_SUBMITTED',
        description: '提交了新资产: 某一线城市赛道场馆收益权',
        metadata: JSON.stringify({ assetId: racingTrack1.id }),
      },
      {
        userId: admin.id,
        type: 'ASSET_APPROVED',
        description: '批准了资产: 某一线城市赛道场馆收益权',
        metadata: JSON.stringify({ assetId: racingTrack1.id }),
      },
      {
        userId: investor.id,
        type: 'INVESTMENT_MADE',
        description: '完成了投资: 某一线城市赛道场馆收益权',
        metadata: JSON.stringify({ investmentId: investment1.id, amount: 500000 }),
      },
      {
        userId: admin.id,
        type: 'DIVIDEND_PAID',
        description: '完成了收益分配: ¥15,000',
        metadata: JSON.stringify({ dividendId: 'div-001', amount: 15000 }),
      },
      {
        userId: investor.id,
        type: 'INVESTMENT_MADE',
        description: '完成了投资: 头部美妆主播抖音投流项目',
        metadata: JSON.stringify({ investmentId: investment2.id, amount: 300000 }),
      },
      {
        userId: assetManager.id,
        type: 'ASSET_SUBMITTED',
        description: '提交了新资产: 深圳南山区卡丁车场收益权',
        metadata: JSON.stringify({ assetId: pendingAsset1.id }),
      },
      {
        userId: assetManager.id,
        type: 'ASSET_SUBMITTED',
        description: '提交了新资产: 新兴美食博主抖音投流项目',
        metadata: JSON.stringify({ assetId: pendingAsset2.id }),
      },
      {
        userId: admin.id,
        type: 'ASSET_APPROVED',
        description: '批准了资产: 华东地区赛道运营收益权',
        metadata: JSON.stringify({ assetId: racingTrack2.id }),
      },
      {
        userId: investor2.id,
        type: 'INVESTMENT_MADE',
        description: '完成了投资: 知名歌手全国巡演票务收益权',
        metadata: JSON.stringify({ investmentId: investment4.id, amount: 2000000 }),
      },
      {
        userId: investor3.id,
        type: 'INVESTMENT_MADE',
        description: '完成了投资: 211高校校园服务设施收益权',
        metadata: JSON.stringify({ investmentId: investment6.id, amount: 300000 }),
      },
      {
        userId: admin.id,
        type: 'DIVIDEND_PAID',
        description: '完成了收益分配: ¥70,000',
        metadata: JSON.stringify({ dividendId: 'div-005', amount: 70000 }),
      },
      {
        userId: assetManager.id,
        type: 'ASSET_SUBMITTED',
        description: '提交了新资产: 双一流大学校园快递站收益权',
        metadata: JSON.stringify({ assetId: pendingAsset3.id }),
      },
      {
        userId: investor2.id,
        type: 'INVESTMENT_MADE',
        description: '完成了投资: 知名服饰品牌投流合作项目',
        metadata: JSON.stringify({ investmentId: investment5.id, amount: 500000 }),
      },
      {
        userId: admin.id,
        type: 'ASSET_APPROVED',
        description: '批准了资产: 985高校天猫便利店收益权',
        metadata: JSON.stringify({ assetId: campusFacility1.id }),
      },
      {
        userId: assetManager.id,
        type: 'ASSET_SUBMITTED',
        description: '提交了新资产: 音乐节票务及周边收益权',
        metadata: JSON.stringify({ assetId: pendingAsset4.id }),
      },
    ],
  })

  console.log('✓ 创建了活动日志')

  console.log('\n✅ 示例数据创建完成！')
  console.log('\n测试账号信息：')
  console.log('投资者账号 (平衡型): investor@example.com / 123456')
  console.log('投资者账号 (激进型): investor2@example.com / 123456')
  console.log('投资者账号 (保守型): investor3@example.com / 123456')
  console.log('资产管理员账号: manager@example.com / 123456')
  console.log('系统管理员账号: admin@example.com / 123456')
  console.log('\n数据统计：')
  console.log('- 5个测试用户（3个投资者 + 1个资产管理员 + 1个系统管理员）')
  console.log('- 14个资产（8个已上架 + 2个募资中 + 4个待审批）')
  console.log('- 7个投资记录')
  console.log('- 9个分红记录')
  console.log('- 15条活动日志')
}

main()
  .catch((e) => {
    console.error('❌ 创建示例数据失败:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
