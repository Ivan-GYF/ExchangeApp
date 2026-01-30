import { Router } from 'express'
import { recentActivities } from '../data/seed-data'
import { getRuntimeAssets } from './assets'

const router = Router()

// 转换资产数据格式
const transformAsset = (asset: any) => ({
  ...asset,
  expectedReturnMin: asset.expectedReturn.min,
  expectedReturnMax: asset.expectedReturn.max,
  expectedReturnType: asset.expectedReturn.type,
})

// 获取概览数据
router.get('/overview', (req, res) => {
  // 使用运行时动态资产数组（包含预设 + 审批通过的项目）
  const runtimeAssets = getRuntimeAssets()
  
  // 统一为"目标金额总和"（方案A）
  const totalAssets = runtimeAssets.reduce((sum, a) => sum + a.targetAmount, 0) / 10000
  
  // 新增：已募集金额总和
  const raisedAssets = runtimeAssets.reduce((sum, a) => sum + a.raisedAmount, 0) / 10000
  
  // 新增：募资进度百分比
  const fundingProgress = totalAssets > 0 ? Math.round((raisedAssets / totalAssets) * 100 * 100) / 100 : 0
  
  // 资产管道状态
  const pipeline = {
    pending: runtimeAssets.filter(a => a.status === 'PENDING').length,
    underReview: runtimeAssets.filter(a => a.status === 'UNDER_REVIEW').length,
    listed: runtimeAssets.filter(a => a.status === 'LISTED' || a.status === 'FUNDING').length,
    funding: runtimeAssets.filter(a => a.status === 'FUNDING').length,
    completed: runtimeAssets.filter(a => a.status === 'FUNDED').length,
  }
  
  // 资产类型分布（百分比）
  const typeCounts = runtimeAssets.reduce((acc, asset) => {
    acc[asset.type] = (acc[asset.type] || 0) + 1
    return acc
  }, {} as Record<string, number>)
  
  const total = Object.values(typeCounts).reduce((a, b) => a + b, 0)
  const distribution = Object.entries(typeCounts).reduce((acc, [key, val]) => {
    acc[key] = Math.round((val / total) * 100)
    return acc
  }, {} as Record<string, number>)
  
  res.json({
    success: true,
    data: {
      totalAssets,           // 目标金额总和（万）
      raisedAssets,          // 已募集金额总和（万）
      fundingProgress,       // 募资进度百分比
      assetPipeline: runtimeAssets.length,
      pendingApproval: pipeline.pending,
      systemHealth: 98.5,
      pipeline,
      distribution
    }
  })
})

  // ?????????? /pending?
router.get('/pending', (req, res) => {
  // 使用运行时动态资产数组
  const runtimeAssets = getRuntimeAssets()
  const assets = runtimeAssets.map(transformAsset)
  
  res.json({
    success: true,
    data: {
      assets
    }
  })
})

// ??????
router.get('/activities', (req, res) => {
  // ?? user ????????????
  const activitiesWithUser = recentActivities.map(activity => ({
    ...activity,
    user: {
      id: 'user-001',
      name: '?????',
      email: 'admin@example.com',
    }
  }))
  
  res.json({
    success: true,
    data: activitiesWithUser
  })
})

// ????
router.post('/approve/:id', (req, res) => {
  const { action, comment } = req.body
  
  res.json({
    success: true,
    data: {
      message: `?? ${req.params.id} ?${action === 'APPROVE' ? '??' : action === 'REJECT' ? '??' : '??????'}`,
      comment
    }
  })
})

// ????
router.post('/assets', (req, res) => {
  res.json({
    success: true,
    data: {
      id: 'asset-new-' + Date.now(),
      ...req.body,
      status: 'PENDING',
      createdAt: new Date().toISOString()
    }
  })
})

export default router
