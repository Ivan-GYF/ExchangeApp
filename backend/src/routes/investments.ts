import { Router } from 'express'
import { allAssets, seedInvestments } from '../data/seed-data'

const router = Router()

// ????????
const investments: any[] = [...seedInvestments]

// ??????
router.get('/', (req, res) => {
  res.json({
    success: true,
    data: investments
  })
})

// 获取我的投资（支持按userId查询）
router.get('/my', (req, res) => {
  // 从查询参数获取userId，如果没有则使用当前登录用户
  const userId = req.query.userId as string || req.headers['x-user-id'] as string
  
  // 根据userId过滤投资记录
  const userInvestments = userId 
    ? investments.filter(inv => inv.userId === userId)
    : investments
  
  const myInvestments = userInvestments.map(inv => {
    const asset = allAssets.find(a => a.id === inv.assetId)
    return {
      ...inv,
      asset: asset ? {
        id: asset.id,
        title: asset.title,
        type: asset.type,
        status: asset.status,
        expectedReturnMin: asset.expectedReturn.min,
        expectedReturnMax: asset.expectedReturn.max,
      } : null
    }
  })
  
  res.json({
    success: true,
    data: {
      investments: myInvestments,
      userId: userId
    }
  })
})

// 获取投资组合统计（支持按userId查询）
router.get('/portfolio/stats', (req, res) => {
  // 从查询参数获取userId，如果没有则使用当前登录用户
  const userId = req.query.userId as string || req.headers['x-user-id'] as string
  
  // 根据userId过滤投资记录
  const userInvestments = userId 
    ? investments.filter(inv => inv.userId === userId)
    : investments
  
  // 计算总值
  const totalValue = userInvestments.reduce((sum, inv) => sum + inv.currentValue, 0)
  const totalInvested = userInvestments.reduce((sum, inv) => sum + inv.amount, 0)
  const totalReturn = totalInvested > 0 ? ((totalValue - totalInvested) / totalInvested * 100) : 0
  
  // 计算资产分布
  const distribution: Record<string, number> = {}
  let totalDistribution = 0
  userInvestments.forEach(inv => {
    const asset = allAssets.find(a => a.id === inv.assetId)
    if (asset) {
      distribution[asset.type] = (distribution[asset.type] || 0) + inv.currentValue
      totalDistribution += inv.currentValue
    }
  })
  
  // 转换为百分比
  const distributionPercent: Record<string, number> = {}
  Object.keys(distribution).forEach(type => {
    distributionPercent[type] = totalDistribution > 0 
      ? Math.round((distribution[type] / totalDistribution) * 100 * 100) / 100
      : 0
  })
  
  // 生成即将到来的里程碑
  const upcomingMilestones = userInvestments.flatMap((inv, index) => {
    const asset = allAssets.find(a => a.id === inv.assetId)
    if (!asset) return []
    
    // 根据投资期限计算季度数
    const investmentMonths = asset.investmentPeriod || 12
    const quarters = Math.ceil(investmentMonths / 3)
    
    const milestones = []
    const now = new Date()
    
    for (let q = 1; q <= Math.min(quarters, 4); q++) {
      const dueDate = new Date(now)
      dueDate.setMonth(now.getMonth() + q * 3)
      
      milestones.push({
        id: `milestone-${inv.id}-Q${q}`,
        assetId: inv.assetId,
        title: `Q${q} 分红`,
        description: asset.title,
        dueDate: dueDate.toISOString().split('T')[0],
        status: 'PENDING',
        expectedAmount: Math.round(inv.amount * (asset.expectedReturn.min + asset.expectedReturn.max) / 2 / 100 / quarters),
        asset: {
          id: asset.id,
          title: asset.title,
          type: asset.type,
        }
      })
    }
    
    return milestones
  }).sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
  
  res.json({
    success: true,
    data: {
      totalValue,
      totalReturn,
      distribution: distributionPercent,
      upcomingMilestones: upcomingMilestones.slice(0, 10),
      userId: userId
    }
  })
})

// ????
router.post('/', (req, res) => {
  const { assetId, amount } = req.body
  
  // ????
  const asset = allAssets.find(a => a.id === assetId)
  if (!asset) {
    return res.status(404).json({
      success: false,
      error: { code: 'ASSET_NOT_FOUND', message: '?????' }
    })
  }
  
  // ??????
  if (amount < asset.minInvestment) {
    return res.status(400).json({
      success: false,
      error: { code: 'AMOUNT_TOO_LOW', message: `?????? �${asset.minInvestment / 10000}?` }
    })
  }
  
  if (amount > asset.maxInvestment) {
    return res.status(400).json({
      success: false,
      error: { code: 'AMOUNT_TOO_HIGH', message: `?????? �${asset.maxInvestment / 10000}?` }
    })
  }
  
  // ????
  const managementFee = amount * 0.02
  const transactionFee = amount * 0.01
  const netAmount = amount - managementFee - transactionFee
  
  // ??????
  const investment = {
    id: 'inv-' + Date.now(),
    userId: 'dev-admin-001',
    assetId,
    amount,
    managementFee,
    transactionFee,
    netAmount,
    currentValue: amount,
    returnRate: 0,
    status: 'CONFIRMED',
    pNoteNumber: 'PN-' + Date.now(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  
  investments.push(investment)
  
  res.json({
    success: true,
    data: investment
  })
})

// ????????
router.get('/:id', (req, res) => {
  const investment = investments.find(inv => inv.id === req.params.id)
  
  if (!investment) {
    return res.status(404).json({
      success: false,
      error: { code: 'NOT_FOUND', message: '???????' }
    })
  }
  
  res.json({
    success: true,
    data: investment
  })
})

export default router
