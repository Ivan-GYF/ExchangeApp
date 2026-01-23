import { Router } from 'express'
import { seedAssets, seedInvestments } from '../data/seed-data'

const router = Router()

// 模拟投资数据存储（启动时加载预设数据）
const investments: any[] = [...seedInvestments]

// 获取投资列表
router.get('/', (req, res) => {
  res.json({
    success: true,
    data: investments
  })
})

// 获取我的投资
router.get('/my', (req, res) => {
  // 返回带有资产详情的投资列表
  const myInvestments = investments.map(inv => {
    const asset = seedAssets.find(a => a.id === inv.assetId)
    return {
      ...inv,
      asset: asset ? {
        ...asset,
        expectedReturnMin: asset.expectedReturn.min,
        expectedReturnMax: asset.expectedReturn.max,
      } : null
    }
  })
  
  res.json({
    success: true,
    data: {
      investments: myInvestments
    }
  })
})

// 获取投资组合统计
router.get('/portfolio/stats', (req, res) => {
  // 计算投资组合统计
  const totalValue = investments.reduce((sum, inv) => sum + inv.amount, 0)
  const totalReturn = investments.length > 0 ? 12.5 : 0 // 模拟收益率
  
  // 按类型统计分布
  const distribution: Record<string, number> = {}
  investments.forEach(inv => {
    const asset = seedAssets.find(a => a.id === inv.assetId)
    if (asset) {
      distribution[asset.type] = (distribution[asset.type] || 0) + inv.amount
    }
  })
  
  // 基于实际投资生成里程碑
  const upcomingMilestones = investments.map((inv, index) => {
    const asset = seedAssets.find(a => a.id === inv.assetId)
    return {
      id: `milestone-${inv.id}`,
      assetId: inv.assetId,
      title: `Q1 分红派发`,
      description: asset?.title || '收益分红',
      dueDate: '2026-03-31',
      status: 'PENDING',
      asset: asset ? {
        id: asset.id,
        title: asset.title,
        type: asset.type,
      } : null
    }
  })
  
  res.json({
    success: true,
    data: {
      totalValue,
      totalReturn,
      distribution,
      upcomingMilestones,
    }
  })
})

// 创建投资
router.post('/', (req, res) => {
  const { assetId, amount } = req.body
  
  // 查找资产
  const asset = seedAssets.find(a => a.id === assetId)
  if (!asset) {
    return res.status(404).json({
      success: false,
      error: { code: 'ASSET_NOT_FOUND', message: '资产不存在' }
    })
  }
  
  // 验证投资金额
  if (amount < asset.minInvestment) {
    return res.status(400).json({
      success: false,
      error: { code: 'AMOUNT_TOO_LOW', message: `最小投资金额为 ¥${asset.minInvestment / 10000}万` }
    })
  }
  
  if (amount > asset.maxInvestment) {
    return res.status(400).json({
      success: false,
      error: { code: 'AMOUNT_TOO_HIGH', message: `最大投资金额为 ¥${asset.maxInvestment / 10000}万` }
    })
  }
  
  // 计算费用
  const managementFee = amount * 0.02  // 2% 管理费
  const transactionFee = amount * 0.01 // 1% 手续费
  const netAmount = amount - managementFee - transactionFee
  
  // 创建投资记录
  const investment = {
    id: 'inv-' + Date.now(),
    userId: 'dev-admin-001',
    assetId,
    amount,
    managementFee,
    transactionFee,
    netAmount,
    currentValue: netAmount,
    returnRate: 0,
    status: 'CONFIRMED',
    pNoteNumber: 'PN-' + Date.now().toString(36).toUpperCase(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  
  investments.push(investment)
  
  res.json({
    success: true,
    data: investment
  })
})

// 获取单个投资详情
router.get('/:id', (req, res) => {
  const investment = investments.find(inv => inv.id === req.params.id)
  
  if (!investment) {
    return res.status(404).json({
      success: false,
      error: { code: 'NOT_FOUND', message: '投资记录不存在' }
    })
  }
  
  const asset = seedAssets.find(a => a.id === investment.assetId)
  
  res.json({
    success: true,
    data: {
      ...investment,
      asset: asset ? {
        ...asset,
        expectedReturnMin: asset.expectedReturn.min,
        expectedReturnMax: asset.expectedReturn.max,
      } : null
    }
  })
})

export default router
