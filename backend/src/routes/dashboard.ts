import { Router } from 'express'
import { dashboardStats, trendData, seedAssets, recentActivities } from '../data/seed-data'

const router = Router()

// 获取仪表板 KPI 数据（根路径和/kpi都支持）
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

// 获取趋势数据
router.get('/trends', (req, res) => {
  res.json({
    success: true,
    data: trendData
  })
})

// 获取热门项目
router.get('/featured', (req, res) => {
  // 返回融资进度最高的4个项目
  const featured = [...seedAssets]
    .sort((a, b) => (b.raisedAmount / b.targetAmount) - (a.raisedAmount / a.targetAmount))
    .slice(0, 4)
  
  res.json({
    success: true,
    data: featured
  })
})

// 获取最近活动
router.get('/activities', (req, res) => {
  res.json({
    success: true,
    data: recentActivities
  })
})

export default router
