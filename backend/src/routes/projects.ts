import { Router } from 'express'
import { demoProjects, ProjectSubmission, projectToAsset } from '../data/demo-projects'
import { addAssetFromProject, removeAssetFromMarket } from './assets'

const router = Router()

// 模拟项目数据存储（启动时加载预设数据）
let projects: ProjectSubmission[] = [...demoProjects]

// 获取当前用户的项目列表
router.get('/my', (req, res) => {
  // 从请求中获取用户ID（实际应该从JWT token中获取）
  // 这里模拟使用 query 参数
  const userId = req.query.userId as string

  if (!userId) {
    return res.status(401).json({ 
      success: false,
      error: 'Unauthorized' 
    })
  }

  // 筛选属于该用户的项目
  const userProjects = projects.filter(p => p.ownerId === userId)

  res.json({
    success: true,
    data: {
      projects: userProjects,
      total: userProjects.length,
    }
  })
})

// 获取单个项目详情
router.get('/:id', (req, res) => {
  const project = projects.find(p => p.id === req.params.id)

  if (!project) {
    return res.status(404).json({ 
      success: false,
      error: 'Project not found' 
    })
  }

  res.json({
    success: true,
    data: project
  })
})

// 创建新项目
router.post('/', (req, res) => {
  const newProject: ProjectSubmission = {
    id: `project-submit-${Date.now()}`,
    ownerId: req.body.ownerId,
    ownerName: req.body.ownerName,
    status: 'DRAFT',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...req.body,
  }

  projects.push(newProject)

  res.status(201).json({
    success: true,
    data: newProject
  })
})

// 更新项目
router.put('/:id', (req, res) => {
  const index = projects.findIndex(p => p.id === req.params.id)

  if (index === -1) {
    return res.status(404).json({ 
      success: false,
      error: 'Project not found' 
    })
  }

  // 检查权限：只有项目所有者可以更新
  const project = projects[index]
  if (project.ownerId !== req.body.userId) {
    return res.status(403).json({ 
      success: false,
      error: 'Forbidden' 
    })
  }

  projects[index] = {
    ...project,
    ...req.body,
    updatedAt: new Date().toISOString(),
  }

  res.json({
    success: true,
    data: projects[index]
  })
})

// 提交项目审核
router.post('/:id/submit', (req, res) => {
  const index = projects.findIndex(p => p.id === req.params.id)

  if (index === -1) {
    return res.status(404).json({ 
      success: false,
      error: 'Project not found' 
    })
  }

  const project = projects[index]

  if (project.status !== 'DRAFT') {
    return res.status(400).json({ 
      success: false,
      error: 'Project already submitted' 
    })
  }

  projects[index] = {
    ...project,
    status: 'PENDING',
    submittedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  res.json({
    success: true,
    data: projects[index]
  })
})

// 撤回提交（项目方）
router.post('/:id/withdraw', (req, res) => {
  const index = projects.findIndex(p => p.id === req.params.id)

  if (index === -1) {
    return res.status(404).json({ 
      success: false,
      error: 'Project not found' 
    })
  }

  const project = projects[index]

  // 只能撤回待审核或审核中的项目
  if (project.status !== 'PENDING' && project.status !== 'UNDER_REVIEW') {
    return res.status(400).json({ 
      success: false,
      error: 'Only pending or under review projects can be withdrawn' 
    })
  }

  // 撤回后恢复为草稿状态
  projects[index] = {
    ...project,
    status: 'DRAFT',
    submittedAt: undefined,
    updatedAt: new Date().toISOString(),
  }

  console.log(`↩️ 项目 "${project.title}" 已被项目方撤回提交，恢复为草稿状态`)

  res.json({
    success: true,
    data: projects[index]
  })
})

// 审核项目（管理员）
router.post('/:id/review', (req, res) => {
  const { action, notes } = req.body // action: 'APPROVE' | 'REJECT'
  const index = projects.findIndex(p => p.id === req.params.id)

  if (index === -1) {
    return res.status(404).json({ 
      success: false,
      error: 'Project not found' 
    })
  }

  const project = projects[index]

  if (project.status !== 'PENDING' && project.status !== 'UNDER_REVIEW') {
    return res.status(400).json({ 
      success: false,
      error: 'Project is not under review' 
    })
  }

  const newStatus = action === 'APPROVE' ? 'APPROVED' : 'REJECTED'

  projects[index] = {
    ...project,
    status: newStatus,
    reviewedAt: new Date().toISOString(),
    reviewNotes: notes,
    updatedAt: new Date().toISOString(),
  }

  // 如果批准，则自动转换为资产并添加到市场
  if (action === 'APPROVE') {
    const asset = projectToAsset(projects[index])
    addAssetFromProject(asset)
    console.log(`✅ 项目 "${project.title}" 已批准并自动上架到市场，资产ID: ${asset.id}`)
  }

  res.json({
    success: true,
    data: projects[index]
  })
})

// 撤销审核（管理员）
router.post('/:id/revoke', (req, res) => {
  const index = projects.findIndex(p => p.id === req.params.id)

  if (index === -1) {
    return res.status(404).json({ 
      success: false,
      error: 'Project not found' 
    })
  }

  const project = projects[index]

  // 只能撤销已批准或已拒绝的项目
  if (project.status !== 'APPROVED' && project.status !== 'REJECTED') {
    return res.status(400).json({ 
      success: false,
      error: 'Only approved or rejected projects can be revoked' 
    })
  }

  // 保存原状态用于日志
  const originalStatus = project.status

  // 如果是已批准的项目，需要同步下架对应的资产
  if (originalStatus === 'APPROVED') {
    const assetId = `asset-from-${project.id}`
    const removed = removeAssetFromMarket(assetId)
    if (removed) {
      console.log(`📤 撤销审核：资产 ${assetId} 已从市场下架`)
    } else {
      console.log(`⚠️ 撤销审核：未找到对应资产 ${assetId}（可能已被下架）`)
    }
  }

  // 撤销审核，状态改回待审核
  projects[index] = {
    ...project,
    status: 'PENDING',
    reviewedAt: undefined,
    reviewNotes: undefined,
    updatedAt: new Date().toISOString(),
  }

  console.log(`↩️ 项目 "${project.title}" 的审核已撤销 (原状态: ${originalStatus} -> 新状态: PENDING)`)

  res.json({
    success: true,
    data: projects[index]
  })
})

// 删除项目
router.delete('/:id', (req, res) => {
  const index = projects.findIndex(p => p.id === req.params.id)

  if (index === -1) {
    return res.status(404).json({ 
      success: false,
      error: 'Project not found' 
    })
  }

  // 检查权限
  const project = projects[index]
  if (project.ownerId !== req.body.userId) {
    return res.status(403).json({ 
      success: false,
      error: 'Forbidden' 
    })
  }

  // 只能删除草稿状态的项目
  if (project.status !== 'DRAFT') {
    return res.status(400).json({ 
      success: false,
      error: 'Cannot delete submitted project' 
    })
  }

  projects.splice(index, 1)

  res.json({ 
    success: true,
    data: { message: 'Project deleted successfully' }
  })
})

// 获取所有待审核项目（管理员）
router.get('/admin/pending', (req, res) => {
  const pendingProjects = projects.filter(
    p => p.status === 'PENDING' || p.status === 'UNDER_REVIEW' || 
         p.status === 'APPROVED' || p.status === 'REJECTED' // 包括已审核的项目，方便撤销
  )

  res.json({
    success: true,
    data: {
      projects: pendingProjects,
      total: pendingProjects.length,
    }
  })
})

// 导出函数：将项目状态改回待审核（供资产下架时调用）
export function revertProjectToPending(projectId: string) {
  const index = projects.findIndex(p => p.id === projectId)
  
  if (index !== -1) {
    projects[index] = {
      ...projects[index],
      status: 'PENDING',
      reviewedAt: undefined,
      reviewNotes: undefined,
      updatedAt: new Date().toISOString(),
    }
    console.log(`↩️ 项目 "${projects[index].title}" 状态已恢复为待审核 (由资产下架触发)`)
    return true
  }
  
  return false
}

// 导出函数：从资产创建项目（供预设资产下架时调用）
export function createProjectFromAsset(asset: any) {
  // 为下架的资产创建一个项目记录
  const newProject: ProjectSubmission = {
    id: `project-from-${asset.id}`, // 使用 asset ID 生成项目ID
    ownerId: 'admin-001', // 默认归属于管理员
    ownerName: '湖畔通平台管理员',
    title: asset.title,
    description: asset.description,
    type: asset.type,
    originalCategory: asset.originalCategory,
    targetAmount: asset.targetAmount,
    minInvestment: asset.minInvestment,
    maxInvestment: asset.maxInvestment,
    expectedReturn: asset.expectedReturn || {
      min: asset.expectedReturnMin || 8,
      max: asset.expectedReturnMax || 15,
      type: asset.expectedReturnType || 'IRR'
    },
    revenueStructure: asset.revenueStructure || {},
    riskLevel: asset.riskLevel || 'MEDIUM',
    region: asset.region || '全国',
    city: asset.city || '上海',
    investmentPeriod: asset.investmentPeriod || 12,
    fundingDeadline: asset.fundingDeadline || new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'PENDING', // 下架后状态为待审核
    submittedAt: new Date().toISOString(),
    createdAt: asset.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  
  // 添加到项目列表
  projects.push(newProject)
  
  console.log(`📝 已从资产 "${asset.title}" (${asset.id}) 创建项目 ${newProject.id}，状态：待审核`)
  
  return newProject
}

export default router
