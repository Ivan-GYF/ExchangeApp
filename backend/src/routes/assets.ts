import { Router } from 'express'
import { allAssets, mifcFundAssets, seedAssets } from '../data/seed-data'
import { revertProjectToPending, createProjectFromAsset } from './projects'

const router = Router()

// 运行时动态资产数组（包含预设资产 + 审批通过的项目转换的资产）
let runtimeAssets = [...allAssets]

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
  
  let filteredAssets = [...runtimeAssets]
  
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
  const asset = runtimeAssets.find(a => a.id === req.params.id)
  
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

// 添加新资产（内部使用，由项目审批调用）
export function addAssetFromProject(asset: any) {
  runtimeAssets.push(asset)
}

// 从市场移除资产（内部使用，由下架调用）
export function removeAssetFromMarket(assetId: string) {
  const index = runtimeAssets.findIndex(a => a.id === assetId)
  if (index !== -1) {
    runtimeAssets.splice(index, 1)
    return true
  }
  return false
}

// 下架资产接口
router.post('/:id/unlist', (req, res) => {
  const assetId = req.params.id
  
  // 从资产列表中查找资产
  const asset = runtimeAssets.find(a => a.id === assetId)
  
  if (!asset) {
    return res.status(404).json({
      success: false,
      error: '资产未找到'
    })
  }

  // 从市场移除资产
  const removed = removeAssetFromMarket(assetId)
  
  if (!removed) {
    return res.status(500).json({
      success: false,
      error: '下架失败'
    })
  }

  // 检查是否是从项目转换来的资产（有 projectId 字段或 id 格式为 asset-from-xxx）
  const projectId = (asset as any).projectId
  const isFromProject = projectId || assetId.startsWith('asset-from-')
  
  if (isFromProject) {
    // 提取项目ID
    const actualProjectId = projectId || assetId.replace('asset-from-', '')
    
    // 将关联的项目状态改回待审核
    const reverted = revertProjectToPending(actualProjectId)
    
    if (reverted) {
      console.log(`📤 资产 "${asset.title}" (${assetId}) 已从市场下架，项目 ${actualProjectId} 状态已恢复为待审核`)
      
      res.json({
        success: true,
        data: {
          assetId,
          projectId: actualProjectId,
          message: '资产已下架，项目已恢复为待审核状态',
          isFromProject: true
        }
      })
    } else {
      console.log(`⚠️ 资产 "${asset.title}" (${assetId}) 已下架，但未找到关联项目 ${actualProjectId}`)
      
      res.json({
        success: true,
        data: {
          assetId,
          message: '资产已下架，但未找到关联项目',
          isFromProject: false
        }
      })
    }
  } else {
    // 预设资产，没有关联项目 - 为它创建一个项目
    const newProject = createProjectFromAsset(asset)
    
    console.log(`📤 预设资产 "${asset.title}" (${assetId}) 已从市场下架，已创建项目 ${newProject.id}`)
    
    res.json({
      success: true,
      data: {
        assetId,
        projectId: newProject.id,
        message: '资产已下架，已创建对应项目记录',
        isFromProject: false,
        createdProject: true
      }
    })
  }
})

export default router
