import { Router } from 'express'
import { allAssets, seedInvestments } from '../data/seed-data'

const router = Router()

// ???????????????????
const investments: any[] = [...seedInvestments]

// ??????
router.get('/', (req, res) => {
  res.json({
    success: true,
    data: investments
  })
})

// ??????
router.get('/my', (req, res) => {
  // ?????????????
  const myInvestments = investments.map(inv => {
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
      investments: myInvestments
    }
  })
})

// ????????
router.get('/portfolio/stats', (req, res) => {
  // ????????
  const totalValue = investments.reduce((sum, inv) => sum + inv.amount, 0)
  const totalReturn = investments.length > 0 ? 12.5 : 0 // ?????
  
  // ???????
  const distribution: Record<string, number> = {}
  investments.forEach(inv => {
    const asset = allAssets.find(a => a.id === inv.assetId)
    if (asset) {
      distribution[asset.type] = (distribution[asset.type] || 0) + inv.amount
    }
  })
  
  // ???????????
  const upcomingMilestones = investments.map((inv, index) => {
    const asset = allAssets.find(a => a.id === inv.assetId)
    return {
      id: `milestone-${inv.id}`,
      assetId: inv.assetId,
      title: `Q1 ????`,
      description: asset?.title || '????',
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
      upcomingMilestones
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
      error: { code: 'AMOUNT_TOO_LOW', message: `??????? ¥${asset.minInvestment / 10000}?` }
    })
  }
  
  if (amount > asset.maxInvestment) {
    return res.status(400).json({
      success: false,
      error: { code: 'AMOUNT_TOO_HIGH', message: `??????? ¥${asset.maxInvestment / 10000}?` }
    })
  }
  
  // ????
  const managementFee = amount * 0.02  // 2% ???
  const transactionFee = amount * 0.01 // 1% ???
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
