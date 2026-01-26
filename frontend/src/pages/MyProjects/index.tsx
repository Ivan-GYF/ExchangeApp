import { useState, useEffect } from 'react'
import { Card, Table, Tag, Button, Empty, Space, Descriptions, Modal, message } from 'antd'
import { PlusOutlined, EditOutlined, EyeOutlined, FileTextOutlined, SendOutlined } from '@ant-design/icons'
import { useAuthStore } from '@/stores/authStore'
import { apiClient } from '@/services/api'
import ProjectForm from '@/components/ProjectForm'
import type { ColumnsType } from 'antd/es/table'

interface Project {
  id: string
  ownerId: string
  ownerName: string
  title: string
  description: string
  type: string
  originalCategory?: string
  targetAmount: number
  minInvestment: number
  maxInvestment: number
  expectedReturn: {
    min: number
    max: number
    type: string
  }
  revenueStructure: Record<string, number>
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH'
  region: string
  city: string
  investmentPeriod: number
  fundingDeadline: string
  status: string
  submittedAt?: string
  reviewedAt?: string
  reviewNotes?: string
  documents?: {
    name: string
    url: string
    type: string
  }[]
  createdAt: string
  updatedAt: string
}

const statusLabels: Record<string, { label: string; color: string }> = {
  DRAFT: { label: '草稿', color: 'default' },
  PENDING: { label: '待审核', color: 'processing' },
  UNDER_REVIEW: { label: '审核中', color: 'processing' },
  APPROVED: { label: '已批准', color: 'success' },
  REJECTED: { label: '已拒绝', color: 'error' },
  LISTED: { label: '已上架', color: 'cyan' },
  FUNDING: { label: '募资中', color: 'blue' },
  FUNDED: { label: '已完成', color: 'green' },
}

const riskLevelLabels: Record<string, { label: string; color: string }> = {
  LOW: { label: '低风险', color: 'success' },
  MEDIUM: { label: '中风险', color: 'warning' },
  HIGH: { label: '高风险', color: 'error' },
}

const MyProjects = () => {
  const { user } = useAuthStore()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [detailModalVisible, setDetailModalVisible] = useState(false)
  const [formVisible, setFormVisible] = useState(false)
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create')
  const [editingProject, setEditingProject] = useState<Project | null>(null)

  useEffect(() => {
    if (user?.id) {
      fetchProjects()
    }
  }, [user])

  const fetchProjects = async () => {
    if (!user?.id) return

    setLoading(true)
    try {
      const response = await apiClient.get<{ projects: Project[]; total: number }>(
        `/projects/my?userId=${user.id}`
      )
      setProjects(response.projects || [])
    } catch (error) {
      console.error('Failed to fetch projects:', error)
      message.error('获取项目列表失败')
    } finally {
      setLoading(false)
    }
  }

  const handleViewDetail = (project: Project) => {
    setSelectedProject(project)
    setDetailModalVisible(true)
  }

  const handleCreateProject = () => {
    setFormMode('create')
    setEditingProject(null)
    setFormVisible(true)
  }

  const handleEditProject = (project: Project) => {
    setFormMode('edit')
    setEditingProject(project)
    setFormVisible(true)
  }

  const handleFormSubmit = async (values: any) => {
    try {
      if (formMode === 'create') {
        // 创建新项目
        await apiClient.post('/projects', {
          ...values,
          ownerId: user?.id,
          ownerName: user?.name,
        })
        message.success('项目创建成功')
      } else {
        // 更新项目
        await apiClient.put(`/projects/${editingProject?.id}`, {
          ...values,
          userId: user?.id,
        })
        message.success('项目更新成功')
      }
      setFormVisible(false)
      fetchProjects()
    } catch (error: any) {
      message.error(error.response?.data?.error || '操作失败')
    }
  }

  const handleFormCancel = () => {
    setFormVisible(false)
    setEditingProject(null)
  }

  const handleSubmitForReview = async (project: Project) => {
    Modal.confirm({
      title: '提交审核',
      content: `确认将项目"${project.title}"提交审核吗？提交后将无法修改。`,
      okText: '确认提交',
      cancelText: '取消',
      onOk: async () => {
        try {
          await apiClient.post(`/projects/${project.id}/submit`)
          message.success('项目已提交审核')
          fetchProjects()
        } catch (error: any) {
          message.error(error.response?.data?.error || '提交失败')
        }
      },
    })
  }

  const formatCurrency = (amount: number) => {
    return `¥${(amount / 10000).toFixed(0)}万`
  }

  const columns: ColumnsType<Project> = [
    {
      title: '项目名称',
      dataIndex: 'title',
      key: 'title',
      width: 300,
      ellipsis: true,
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      width: 120,
      render: (type) => {
        const labels: Record<string, string> = {
          CO_INVESTMENT: '跟投项目',
          MIFC_FUND_LP: 'MIFC主基金LP',
          MIFC_ABS: 'MIFC ABS',
        }
        return <Tag color="blue">{labels[type] || type}</Tag>
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => {
        const { label, color } = statusLabels[status] || { label: status, color: 'default' }
        return <Tag color={color}>{label}</Tag>
      },
    },
    {
      title: '风险等级',
      dataIndex: 'riskLevel',
      key: 'riskLevel',
      width: 100,
      render: (level) => {
        const { label, color } = riskLevelLabels[level] || { label: level, color: 'default' }
        return <Tag color={color}>{label}</Tag>
      },
    },
    {
      title: '目标金额',
      dataIndex: 'targetAmount',
      key: 'targetAmount',
      width: 120,
      render: (amount) => formatCurrency(amount),
    },
    {
      title: '预期收益',
      key: 'expectedReturn',
      width: 120,
      render: (_: any, record: Project) => 
        `${record.expectedReturn.min}-${record.expectedReturn.max}%`,
    },
    {
      title: '提交时间',
      dataIndex: 'submittedAt',
      key: 'submittedAt',
      width: 120,
      render: (date) => date ? new Date(date).toLocaleDateString() : '-',
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      fixed: 'right' as const,
      render: (_: any, record: Project) => (
        <Space>
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => handleViewDetail(record)}
          >
            查看
          </Button>
          {record.status === 'DRAFT' && (
            <>
              <Button 
                type="link" 
                icon={<EditOutlined />}
                onClick={() => handleEditProject(record)}
              >
                编辑
              </Button>
              <Button 
                type="link" 
                icon={<SendOutlined />}
                onClick={() => handleSubmitForReview(record)}
              >
                提交审核
              </Button>
            </>
          )}
        </Space>
      ),
    },
  ]

  return (
    <div style={{ padding: '24px' }}>
      <Card
        title="我的项目"
        extra={
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={handleCreateProject}
          >
            提交新项目
          </Button>
        }
      >
        <div style={{ marginBottom: '16px' }}>
          <p>欢迎，{user?.name}！</p>
          <p style={{ color: '#888' }}>
            在这里您可以提交新项目、管理现有项目，并查看融资进度。
          </p>
        </div>

        {projects.length > 0 ? (
          <Table
            columns={columns}
            dataSource={projects}
            rowKey="id"
            loading={loading}
            scroll={{ x: 1200 }}
          />
        ) : (
          <Empty
            description="暂无项目"
            style={{ margin: '60px 0' }}
          >
            <Button 
              type="primary" 
              icon={<PlusOutlined />}
              onClick={handleCreateProject}
            >
              提交第一个项目
            </Button>
          </Empty>
        )}
      </Card>

      {/* 项目详情Modal */}
      <Modal
        title="项目详情"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setDetailModalVisible(false)}>
            关闭
          </Button>,
          selectedProject?.status === 'DRAFT' && (
            <Button 
              key="edit" 
              type="primary" 
              icon={<EditOutlined />}
              onClick={() => {
                setDetailModalVisible(false)
                handleEditProject(selectedProject)
              }}
            >
              编辑项目
            </Button>
          ),
        ]}
        width={800}
      >
        {selectedProject && (
          <div>
            <Descriptions column={2} bordered size="small">
              <Descriptions.Item label="项目名称" span={2}>
                {selectedProject.title}
              </Descriptions.Item>
              <Descriptions.Item label="项目类型">
                {selectedProject.type === 'CO_INVESTMENT' ? '跟投项目' : selectedProject.type}
              </Descriptions.Item>
              <Descriptions.Item label="状态">
                <Tag color={statusLabels[selectedProject.status]?.color}>
                  {statusLabels[selectedProject.status]?.label}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="目标金额">
                {formatCurrency(selectedProject.targetAmount)}
              </Descriptions.Item>
              <Descriptions.Item label="预期收益">
                {selectedProject.expectedReturn.min}-{selectedProject.expectedReturn.max}% (
                {selectedProject.expectedReturn.type})
              </Descriptions.Item>
              <Descriptions.Item label="风险等级">
                <Tag color={riskLevelLabels[selectedProject.riskLevel]?.color}>
                  {riskLevelLabels[selectedProject.riskLevel]?.label}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="投资期限">
                {selectedProject.investmentPeriod}个月
              </Descriptions.Item>
              <Descriptions.Item label="地区">
                {selectedProject.region} - {selectedProject.city}
              </Descriptions.Item>
              <Descriptions.Item label="募资截止日期">
                {new Date(selectedProject.fundingDeadline).toLocaleDateString()}
              </Descriptions.Item>
              <Descriptions.Item label="最小投资额">
                {formatCurrency(selectedProject.minInvestment)}
              </Descriptions.Item>
              <Descriptions.Item label="最大投资额">
                {formatCurrency(selectedProject.maxInvestment)}
              </Descriptions.Item>
              <Descriptions.Item label="提交时间" span={2}>
                {selectedProject.submittedAt
                  ? new Date(selectedProject.submittedAt).toLocaleString()
                  : '-'}
              </Descriptions.Item>
              {selectedProject.reviewedAt && (
                <Descriptions.Item label="审核时间" span={2}>
                  {new Date(selectedProject.reviewedAt).toLocaleString()}
                </Descriptions.Item>
              )}
              {selectedProject.reviewNotes && (
                <Descriptions.Item label="审核备注" span={2}>
                  {selectedProject.reviewNotes}
                </Descriptions.Item>
              )}
            </Descriptions>

            <div style={{ marginTop: '24px' }}>
              <h4>项目描述</h4>
              <div
                style={{
                  padding: '16px',
                  background: '#f5f5f5',
                  borderRadius: '4px',
                  whiteSpace: 'pre-wrap',
                  maxHeight: '300px',
                  overflow: 'auto',
                }}
              >
                {selectedProject.description}
              </div>
            </div>

            <div style={{ marginTop: '24px' }}>
              <h4>收益结构</h4>
              <Descriptions column={2} bordered size="small">
                {Object.entries(selectedProject.revenueStructure).map(([key, value]) => (
                  <Descriptions.Item key={key} label={key}>
                    {value}%
                  </Descriptions.Item>
                ))}
              </Descriptions>
            </div>

            {selectedProject.documents && selectedProject.documents.length > 0 && (
              <div style={{ marginTop: '24px' }}>
                <h4>附件文档</h4>
                <Space direction="vertical">
                  {selectedProject.documents.map((doc, index) => (
                    <Button key={index} icon={<FileTextOutlined />} type="link">
                      {doc.name}
                    </Button>
                  ))}
                </Space>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* 项目表单Modal */}
      <ProjectForm
        visible={formVisible}
        mode={formMode}
        initialValues={editingProject}
        onSubmit={handleFormSubmit}
        onCancel={handleFormCancel}
      />
    </div>
  )
}

export default MyProjects
