import { Router } from 'express'
import { dashboardStats, trendData, recentActivities } from '../data/seed-data'
import { getRuntimeAssets } from './assets'
import { demoUsers } from '../data/demo-users'

const router = Router()

// ???? KPI ???????????
router.get('/', (req, res) => {
  const runtimeAssets = getRuntimeAssets()
  
  console.log(`?? ????? - ????: ${runtimeAssets.length}`)
  
  // ????????
  const totalAssets = runtimeAssets.reduce((sum, asset) => sum + asset.targetAmount, 0)
  const totalInvestors = demoUsers.filter(u => u.role === 'INVESTOR').length // ?????????
  const totalProjects = runtimeAssets.length
  const successRate = 92.5
  
  console.log(`?? ???? - ???: ${totalAssets}, ???: ${totalInvestors}, ???: ${totalProjects}`)
  
  const stats = {
    totalAssets,
    totalInvestors,
    totalProjects,
    successRate,
    // ???????
    assetGrowth: dashboardStats.assetGrowth,
    investorGrowth: dashboardStats.investorGrowth,
    projectGrowth: dashboardStats.projectGrowth,
    successRateChange: dashboardStats.successRateChange,
  }
  
  res.json({
    success: true,
    data: stats
  })
})

router.get('/kpi', (req, res) => {
  const runtimeAssets = getRuntimeAssets()
  
  console.log(`?? KPI?? - ????: ${runtimeAssets.length}`)
  
  // ????????
  const totalAssets = runtimeAssets.reduce((sum, asset) => sum + asset.targetAmount, 0)
  const totalInvestors = demoUsers.filter(u => u.role === 'INVESTOR').length // ?????????
  const totalProjects = runtimeAssets.length
  
  // ???????????
  // ??: ?(???? � ???????) / ?(????)
  let weightedReturnSum = 0
  let totalWeight = 0
  
  runtimeAssets.forEach(asset => {
    const weight = asset.targetAmount
    // ????????????
    const avgReturn = asset.expectedReturn 
      ? (asset.expectedReturn.min + asset.expectedReturn.max) / 2 
      : 0
    
    weightedReturnSum += weight * avgReturn
    totalWeight += weight
  })
  
  const avgReturn = totalWeight > 0 ? weightedReturnSum / totalWeight : 0
  
  console.log(`?? KPI???? - ???: ${totalAssets}, ???: ${totalInvestors}, ???: ${totalProjects}, ??????: ${avgReturn.toFixed(2)}%`)
  
  const stats = {
    totalAssets,
    totalInvestors,
    totalProjects,
    avgReturn: Number(avgReturn.toFixed(2)), // ??????
    assetGrowth: dashboardStats.assetGrowth,
    investorGrowth: dashboardStats.investorGrowth,
    projectGrowth: dashboardStats.projectGrowth,
  }
  
  res.json({
    success: true,
    data: stats
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
  const runtimeAssets = getRuntimeAssets()
  
  // ??????ID???????????????????Cardi B?
  const featuredIds = [
    'mifc-fund-lp-001',     // MIFC???LP??
    'asset-002',            // ????????????????
    'asset-003',            // ???????????????
    'asset-001',            // Cardi B??????????????
  ]
  
  // ????ID??????
  const featured = featuredIds
    .map(id => runtimeAssets.find(asset => asset.id === id))
    .filter(asset => asset !== undefined) // ?????????
  
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
