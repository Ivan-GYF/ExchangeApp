import { Router } from 'express'
import { seedAssets } from '../data/seed-data'

const router = Router()

// 获取 AI 匹配推荐
router.get('/recommendations', (req, res) => {
  // 模拟 AI 推荐：根据不同维度计算匹配分数
  const recommendations = seedAssets
    .filter(a => a.status === 'FUNDING')
    .map(asset => {
      // 模拟匹配分数计算
      const baseScore = 70
      const progressBonus = (asset.raisedAmount / asset.targetAmount) * 15
      const riskAdjustment = asset.riskLevel === 'LOW' ? 10 : asset.riskLevel === 'MEDIUM' ? 5 : 0
      const matchScore = Math.min(98, Math.round(baseScore + progressBonus + riskAdjustment + Math.random() * 5))
      
      // 生成匹配理由
      const matchReasons = []
      if (asset.riskLevel === 'LOW') matchReasons.push('风险等级符合您的偏好')
      if (asset.expectedReturn.min >= 10) matchReasons.push('预期收益率符合您的期望')
      if (asset.raisedAmount / asset.targetAmount > 0.5) matchReasons.push('项目融资进度良好')
      if (asset.dueDiligence && Object.values(asset.dueDiligence).filter(Boolean).length >= 3) {
        matchReasons.push('尽职调查完备')
      }
      matchReasons.push('投资金额区间匹配')
      
      return {
        asset,
        matchScore,
        matchReasons: matchReasons.slice(0, 4),
      }
    })
    .sort((a, b) => b.matchScore - a.matchScore)
  
  res.json({
    success: true,
    data: {
      matchQuality: 85,
      totalMatches: recommendations.length,
      recommendations,
    }
  })
})

// 资产对比
router.post('/compare', (req, res) => {
  const { assetIds } = req.body
  
  if (!assetIds || !Array.isArray(assetIds)) {
    return res.status(400).json({
      success: false,
      error: { code: 'INVALID_REQUEST', message: '请提供要对比的资产ID列表' }
    })
  }
  
  const assets = seedAssets.filter(a => assetIds.includes(a.id))
  
  res.json({
    success: true,
    data: assets
  })
})

// 投资计算器
router.post('/calculate', (req, res) => {
  const { amount, expectedReturn, period } = req.body
  
  const yearlyReturn = expectedReturn / 100
  const yearlyBreakdown = []
  let currentValue = amount
  
  for (let i = 1; i <= period; i++) {
    currentValue = currentValue * (1 + yearlyReturn)
    yearlyBreakdown.push(Math.round(currentValue))
  }
  
  res.json({
    success: true,
    data: {
      totalReturn: Math.round(currentValue - amount),
      yearlyBreakdown,
      projectedValue: Math.round(currentValue),
    }
  })
})

export default router
