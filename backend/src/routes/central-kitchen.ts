import { Router } from 'express'
import { seedAssets, recentActivities } from '../data/seed-data'

const router = Router()

// 转换资产数据格式
const transformAsset = (asset: any) => ({
  ...asset,
  expectedReturnMin: asset.expectedReturn.min,
  expectedReturnMax: asset.expectedReturn.max,
  expectedReturnType: asset.expectedReturn.type,
})

// 中央厨房概览
router.get('/overview', (req, res) => {
  // 计算总资产价值（已募集金额）
  const totalAssets = seedAssets.reduce((sum, a) => sum + a.raisedAmount, 0) / 10000
  
  // 计算管道状态
  const pipeline = {
    pending: seedAssets.filter(a => a.status === 'PENDING').length,
    underReview: seedAssets.filter(a => a.status === 'UNDER_REVIEW').length,
    listed: seedAssets.filter(a => a.status === 'LISTED' || a.status === 'APPROVED').length,
    funding: seedAssets.filter(a => a.status === 'FUNDING').length,
    completed: seedAssets.filter(a => a.status === 'FUNDED' || a.status === 'COMPLETED' || a.status === 'ACTIVE').length,
  }
  
  // 按类型分布（百分比）
  const typeCounts = seedAssets.reduce((acc, asset) => {
    acc[asset.type] = (acc[asset.type] || 0) + 1
    return acc
  }, {} as Record<string, number>)
  
  const total = seedAssets.length
  const distribution = Object.entries(typeCounts).reduce((acc, [type, count]) => {
    acc[type] = Math.round((count / total) * 100)
    return acc
  }, {} as Record<string, number>)
  
  res.json({
    success: true,
    data: {
      totalAssets: Math.round(totalAssets),
      assetPipeline: seedAssets.length,
      pendingApproval: pipeline.pending + pipeline.underReview,
      systemHealth: 98.5,
      pipeline,
      distribution,
    }
  })
})

// 待审批资产（前端调用 /pending）
router.get('/pending', (req, res) => {
  // 返回所有资产作为"待审批"（开发模式）
  const assets = seedAssets.map(transformAsset)
  
  res.json({
    success: true,
    data: {
      assets
    }
  })
})

// 系统活动日志
router.get('/activities', (req, res) => {
  // 添加 user 对象以匹配前端期望的格式
  const activitiesWithUser = recentActivities.map(activity => ({
    ...activity,
    user: {
      id: 'user-001',
      name: '系统管理员',
      email: 'admin@example.com',
    }
  }))
  
  res.json({
    success: true,
    data: {
      activities: activitiesWithUser
    }
  })
})

// 审批操作
router.post('/approve/:id', (req, res) => {
  const { action, comment } = req.body
  
  res.json({
    success: true,
    data: {
      message: `资产 ${req.params.id} 已${action === 'APPROVE' ? '批准' : action === 'REJECT' ? '拒绝' : '标记为审核中'}`,
      comment
    }
  })
})

// 创建资产
router.post('/assets', (req, res) => {
  res.json({
    success: true,
    data: {
      id: 'new-asset-' + Date.now(),
      ...req.body,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
    }
  })
})

export default router
