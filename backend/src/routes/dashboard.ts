import { Router } from 'express'
import { dashboardStats, trendData, allAssets, recentActivities } from '../data/seed-data'

const router = Router()

// ????? KPI ??????? kpi ????
router.get('/', (req, res) => {
  res.json({
    success: true,
    data: dashboardStats
  })
})

router.get('/kpi', (req, res) => {
  res.json({
    success: true,
    data: dashboardStats
  })
})

// ??????
router.get('/trends', (req, res) => {
  res.json({
    success: true,
    data: trendData
  })
})

// ??????
router.get('/featured', (req, res) => {
  // ?????????4???
  const featured = [...allAssets]
    .sort((a, b) => (b.raisedAmount / b.targetAmount) - (a.raisedAmount / a.targetAmount))
    .slice(0, 4)
  
  res.json({
    success: true,
    data: featured
  })
})

// ??????
router.get('/activities', (req, res) => {
  res.json({
    success: true,
    data: recentActivities
  })
})

export default router
