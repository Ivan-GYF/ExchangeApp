import { Router } from 'express'
import { seedAssets } from '../data/seed-data'

const router = Router()

// 转换资产数据格式以匹配前端期望
const transformAsset = (asset: any) => ({
  ...asset,
  // 前端期望的字段格式
  expectedReturnMin: asset.expectedReturn.min,
  expectedReturnMax: asset.expectedReturn.max,
  expectedReturnType: asset.expectedReturn.type,
})

// 获取资产列表
router.get('/', (req, res) => {
  const { type, riskLevel, status, region } = req.query
  
  let filteredAssets = [...seedAssets]
  
  // 按类型筛选
  if (type) {
    const types = Array.isArray(type) ? type : [type]
    filteredAssets = filteredAssets.filter(a => types.includes(a.type))
  }
  
  // 按风险等级筛选
  if (riskLevel) {
    const levels = Array.isArray(riskLevel) ? riskLevel : [riskLevel]
    filteredAssets = filteredAssets.filter(a => levels.includes(a.riskLevel))
  }
  
  // 按状态筛选 - 如果是 LISTED，也包括 FUNDING 状态（正在募集中的项目）
  if (status) {
    if (status === 'LISTED') {
      filteredAssets = filteredAssets.filter(a => 
        a.status === 'LISTED' || a.status === 'FUNDING' || a.status === 'FUNDED'
      )
    } else {
      filteredAssets = filteredAssets.filter(a => a.status === status)
    }
  }
  
  // 按地区筛选
  if (region) {
    filteredAssets = filteredAssets.filter(a => a.region === region)
  }
  
  // 转换数据格式
  const transformedAssets = filteredAssets.map(transformAsset)
  
  res.json({
    success: true,
    data: {
      assets: transformedAssets,
      items: transformedAssets,
      pagination: {
        total: transformedAssets.length,
        page: 1,
        limit: 20,
        totalPages: 1,
      }
    }
  })
})

// 获取单个资产
router.get('/:id', (req, res) => {
  const asset = seedAssets.find(a => a.id === req.params.id)
  
  if (!asset) {
    return res.status(404).json({
      success: false,
      error: { code: 'NOT_FOUND', message: '资产不存在' }
    })
  }
  
  res.json({
    success: true,
    data: transformAsset(asset)
  })
})

export default router
