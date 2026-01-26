import { Router } from 'express'
import { allAssets } from '../data/seed-data'

const router = Router()

// ?? AI ????
router.get('/recommendations', (req, res) => {
  // ?? AI ???????????????
  const recommendations = allAssets
    .filter(a => a.status === 'FUNDING')
    .map(asset => {
      // ????????
      const baseScore = 70
      const progressBonus = (asset.raisedAmount / asset.targetAmount) * 15
      const riskAdjustment = asset.riskLevel === 'LOW' ? 10 : asset.riskLevel === 'MEDIUM' ? 5 : 0
      const matchScore = Math.min(98, Math.round(baseScore + progressBonus + riskAdjustment + Math.random() * 5))
      
      // ??????
      const matchReasons = []
      if (asset.riskLevel === 'LOW') matchReasons.push('??????????')
      if (asset.expectedReturn.min >= 10) matchReasons.push('???????????')
      if (asset.raisedAmount / asset.targetAmount > 0.5) matchReasons.push('????????')
      if (asset.dueDiligence && Object.values(asset.dueDiligence).filter(Boolean).length >= 3) {
        matchReasons.push('??????')
      }
      matchReasons.push('????????')
      
      return {
        asset,
        matchScore,
        matchReasons,
        recommendation: matchScore >= 80 ? '????' : matchScore >= 70 ? '??' : '???'
      }
    })
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 10)
  
  res.json({
    success: true,
    data: {
      recommendations
    }
  })
})

// ????
router.post('/compare', (req, res) => {
  const { assetIds } = req.body
  
  if (!assetIds || !Array.isArray(assetIds)) {
    return res.status(400).json({
      success: false,
      error: { code: 'INVALID_REQUEST', message: '?????????ID??' }
    })
  }
  
  const comparedAssets = assetIds.map(id => allAssets.find(a => a.id === id)).filter(Boolean)
  
  res.json({
    success: true,
    data: { assets: comparedAssets }
  })
})

// ?????
router.post('/calculate', (req, res) => {
  const { amount, expectedReturn, period } = req.body
  
  const estimatedReturn = amount * (expectedReturn / 100) * (period / 12)
  const totalValue = amount + estimatedReturn
  
  res.json({
    success: true,
    data: {
      principal: amount,
      estimatedReturn,
      totalValue,
      roi: (estimatedReturn / amount) * 100
    }
  })
})

export default router
