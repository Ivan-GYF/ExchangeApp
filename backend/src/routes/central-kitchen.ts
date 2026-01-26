import { Router } from 'express'
import { allAssets, recentActivities } from '../data/seed-data'

const router = Router()

// ????????
const transformAsset = (asset: any) => ({
  ...asset,
  expectedReturnMin: asset.expectedReturn.min,
  expectedReturnMax: asset.expectedReturn.max,
  expectedReturnType: asset.expectedReturn.type,
})

// ??????
router.get('/overview', (req, res) => {
  // ??????????????
  const totalAssets = allAssets.reduce((sum, a) => sum + a.raisedAmount, 0) / 10000
  
  // ??????
  const pipeline = {
    pending: allAssets.filter(a => a.status === 'PENDING').length,
    underReview: allAssets.filter(a => a.status === 'UNDER_REVIEW').length,
    listed: allAssets.filter(a => a.status === 'LISTED' || a.status === 'FUNDING').length,
    funding: allAssets.filter(a => a.status === 'FUNDING').length,
    completed: allAssets.filter(a => a.status === 'FUNDED').length,
  }
  
  // ??????????
  const typeCounts = allAssets.reduce((acc, asset) => {
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
      totalAssets,
      assetPipeline: allAssets.length,
      pendingApproval: pipeline.pending,
      systemHealth: 98.5,
      pipeline,
      distribution
    }
  })
})

// ?????????? /pending?
router.get('/pending', (req, res) => {
  // ????????"???"??????
  const assets = allAssets.map(transformAsset)
  
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
