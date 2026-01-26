import { useEffect, useState } from 'react'
import { Row, Col, Card, Statistic, Table, Tag, Button, Modal, Form, Input, Select, message, Tabs, Timeline, Progress, Space } from 'antd'
import { CheckCircleOutlined, CloseCircleOutlined, SyncOutlined, PlusOutlined, RollbackOutlined, DownOutlined } from '@ant-design/icons'
import { apiClient } from '@/services/api'
import { Asset } from '@/types'
import ReactECharts from 'echarts-for-react'
import './CentralKitchen.css'

const { TextArea } = Input
const { Option } = Select
const { TabPane } = Tabs

const assetTypeLabels: Record<string, { label: string; color: string; icon: string }> = {
  MIFC_FUND_LP: { label: 'MIFC主基金LP', color: '#597ef7', icon: '💎' },
  MIFC_ABS: { label: 'MIFC ABS', color: '#13c2c2', icon: '🛡️' },
  CO_INVESTMENT: { label: '跟投项目', color: '#ff7a45', icon: '🤝' },
}

const statusLabels: Record<string, { label: string; color: string }> = {
  PENDING: { label: '待审核', color: 'default' },
  UNDER_REVIEW: { label: '审核中', color: 'processing' },
  LISTED: { label: '已上架', color: 'success' },
  FUNDING: { label: '募资中', color: 'warning' },
  COMPLETED: { label: '已完成', color: 'success' },
  REJECTED: { label: '已拒绝', color: 'error' },
}

interface OverviewData {
  totalAssets: number
  assetPipeline: number
  pendingApproval: number
  systemHealth: number
  pipeline: {
    pending: number
    underReview: number
    listed: number
    funding: number
    completed: number
  }
  distribution: Record<string, number>
}

interface Activity {
  id: string
  type: string
  description: string
  createdAt: string
  user: {
    id: string
    name: string
    email: string
  }
}

interface ProjectSubmission {
  id: string
  ownerId: string
  ownerName: string
  title: string
  description: string
  type: string
  targetAmount: number
  expectedReturn: {
    min: number
    max: number
    type: string
  }
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH'
  status: string
  submittedAt?: string
  reviewedAt?: string
  reviewNotes?: string
  createdAt: string
  updatedAt: string
}

const CentralKitchen = () => {
  const [form] = Form.useForm()
  const [overview, setOverview] = useState<OverviewData | null>(null)
  const [pendingAssets, setPendingAssets] = useState<Asset[]>([])
  const [pendingProjects, setPendingProjects] = useState<ProjectSubmission[]>([])
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)
  const [approvalModalVisible, setApprovalModalVisible] = useState(false)
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null)
  const [approvalAction, setApprovalAction] = useState<'APPROVE' | 'REJECT' | 'REQUEST_REVIEW'>('APPROVE')
  const [createModalVisible, setCreateModalVisible] = useState(false)
  const [createForm] = Form.useForm()
  const [projectReviewModalVisible, setProjectReviewModalVisible] = useState(false)
  const [selectedProject, setSelectedProject] = useState<ProjectSubmission | null>(null)
  const [projectReviewForm] = Form.useForm()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      await Promise.all([
        fetchOverview(),
        fetchPendingAssets(),
        fetchPendingProjects(),
        fetchActivities(),
      ])
    } catch (error) {
      console.error('Failed to fetch data:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchOverview = async () => {
    try {
      const data = await apiClient.get<OverviewData>('/central-kitchen/overview')
      setOverview(data)
    } catch (error) {
      console.error('Failed to fetch overview:', error)
    }
  }

  const fetchPendingAssets = async () => {
    try {
      // 改为从 /api/assets 获取已上架的资产（包括批准后自动上架的项目）
      const data = await apiClient.get<{ assets: Asset[] }>('/assets', {
        params: { status: 'FUNDING' } // 获取募资中的项目（即已上架的项目）
      })
      setPendingAssets(data.assets || [])
    } catch (error) {
      console.error('Failed to fetch listed assets:', error)
    }
  }

  const fetchActivities = async () => {
    try {
      const data = await apiClient.get<{ activities: Activity[] }>('/central-kitchen/activities', {
        params: { limit: 20 },
      })
      setActivities(data.activities)
    } catch (error) {
      console.error('Failed to fetch activities:', error)
    }
  }

  const fetchPendingProjects = async () => {
    try {
      const data = await apiClient.get<{ projects: ProjectSubmission[]; total: number }>('/projects/admin/pending')
      setPendingProjects(data.projects || [])
    } catch (error) {
      console.error('Failed to fetch pending projects:', error)
    }
  }

  const handleProjectReviewClick = (project: ProjectSubmission, action: 'APPROVE' | 'REJECT') => {
    setSelectedProject(project)
    setApprovalAction(action)
    setProjectReviewModalVisible(true)
  }

  const handleProjectReviewSubmit = async (values: any) => {
    if (!selectedProject) return

    try {
      await apiClient.post(`/projects/${selectedProject.id}/review`, {
        action: approvalAction,
        notes: values.notes,
      })

      message.success(
        approvalAction === 'APPROVE' 
          ? '项目已批准并自动上架到市场浏览器！投资人现在可以看到这个项目了。' 
          : '项目已拒绝'
      )

      setProjectReviewModalVisible(false)
      projectReviewForm.resetFields()
      fetchData()
    } catch (error: any) {
      message.error(error.response?.data?.error || '操作失败')
    }
  }

  const handleRevokeReview = async (project: ProjectSubmission) => {
    Modal.confirm({
      title: '撤销审核',
      content: `确认撤销项目"${project.title}"的审核决定吗？项目状态将恢复为"待审核"。`,
      okText: '确认撤销',
      cancelText: '取消',
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          await apiClient.post(`/projects/${project.id}/revoke`)
          message.success('审核已撤销，项目状态已恢复为待审核')
          fetchData()
        } catch (error: any) {
          message.error(error.response?.data?.error || '撤销失败')
        }
      },
    })
  }

  const handleUnlistAsset = async (asset: Asset) => {
    Modal.confirm({
      title: '下架项目',
      content: `确认将项目"${asset.title}"从市场下架吗？下架后项目将回到"项目提交"栏，状态恢复为"待审核"。`,
      okText: '确认下架',
      cancelText: '取消',
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          // 调用后端下架接口（需要从 asset.id 提取项目ID）
          // asset.id 格式通常是 'asset-{projectId}'，需要映射回项目
          await apiClient.post(`/assets/${asset.id}/unlist`)
          message.success('项目已下架，已恢复为待审核状态')
          fetchData()
        } catch (error: any) {
          message.error(error.response?.data?.error || '下架失败')
        }
      },
    })
  }

  const handleApprovalClick = (asset: Asset, action: 'APPROVE' | 'REJECT' | 'REQUEST_REVIEW') => {
    setSelectedAsset(asset)
    setApprovalAction(action)
    setApprovalModalVisible(true)
  }

  const handleApprovalSubmit = async (values: any) => {
    if (!selectedAsset) return

    try {
      await apiClient.post(`/central-kitchen/approve/${selectedAsset.id}`, {
        action: approvalAction,
        comment: values.comment,
      })

      message.success(
        approvalAction === 'APPROVE' ? '资产已批准' :
        approvalAction === 'REJECT' ? '资产已拒绝' :
        '资产已标记为审核中'
      )

      setApprovalModalVisible(false)
      form.resetFields()
      fetchData()
    } catch (error: any) {
      message.error(error.response?.data?.error?.message || '操作失败')
    }
  }

  const handleCreateAsset = async (values: any) => {
    try {
      await apiClient.post('/central-kitchen/assets', {
        ...values,
        revenueStructure: {
          type: values.revenueType,
          description: values.revenueDescription,
        },
      })

      message.success('资产创建成功')
      setCreateModalVisible(false)
      createForm.resetFields()
      fetchData()
    } catch (error: any) {
      message.error(error.response?.data?.error?.message || '创建失败')
    }
  }

  const getDistributionChartOption = () => {
    if (!overview) return {}

    const data = Object.entries(overview.distribution).map(([type, percent]) => ({
      name: assetTypeLabels[type]?.label || type,
      value: percent,
      itemStyle: { color: assetTypeLabels[type]?.color },
    }))

    return {
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c}%',
      },
      legend: {
        orient: 'vertical',
        right: 10,
        top: 'center',
      },
      series: [
        {
          name: '资产分布',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2,
          },
          label: {
            show: true,
            formatter: '{b}: {c}%',
          },
          data,
        },
      ],
    }
  }

  const getPipelineChartOption = () => {
    if (!overview) return {}

    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
      },
      xAxis: {
        type: 'category',
        data: ['待审核', '审核中', '已上架', '募资中', '已完成'],
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          name: '资产数量',
          type: 'bar',
          data: [
            overview.pipeline.pending,
            overview.pipeline.underReview,
            overview.pipeline.listed,
            overview.pipeline.funding,
            overview.pipeline.completed,
          ],
          itemStyle: {
            color: '#1890ff',
          },
        },
      ],
    }
  }

  const columns = [
    {
      title: '资产名称',
      dataIndex: 'title',
      key: 'title',
      render: (text: string, record: Asset) => (
        <div>
          <div style={{ fontWeight: 600 }}>{text}</div>
          <div style={{ fontSize: 12, color: 'rgba(0,0,0,0.45)' }}>
            {record.description.substring(0, 50)}...
          </div>
        </div>
      ),
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => {
        const typeInfo = assetTypeLabels[type]
        return (
          <Tag color={typeInfo?.color}>
            {typeInfo?.icon} {typeInfo?.label}
          </Tag>
        )
      },
    },
    {
      title: '目标金额',
      dataIndex: 'targetAmount',
      key: 'targetAmount',
      render: (amount: number) => `¥${(amount / 10000).toFixed(0)}万`,
    },
    {
      title: '风险评分',
      dataIndex: 'riskScore',
      key: 'riskScore',
      render: (score: number) => (
        <Progress
          percent={(score / 10) * 100}
          steps={10}
          size="small"
          strokeColor={score > 7 ? '#ff4d4f' : score > 4 ? '#faad14' : '#52c41a'}
          format={() => `${score}/10`}
        />
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const statusInfo = statusLabels[status]
        return <Tag color={statusInfo?.color}>{statusInfo?.label}</Tag>
      },
    },
    {
      title: '提交时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleDateString('zh-CN'),
    },
    {
      title: '操作',
      key: 'actions',
      render: (_: any, record: Asset) => (
        <Space>
          <Button
            danger
            size="small"
            icon={<DownOutlined />}
            onClick={() => handleUnlistAsset(record)}
          >
            下架
          </Button>
        </Space>
      ),
    },
  ]

  const projectColumns = [
    {
      title: '项目名称',
      dataIndex: 'title',
      key: 'title',
      width: 300,
      ellipsis: true,
    },
    {
      title: '提交方',
      dataIndex: 'ownerName',
      key: 'ownerName',
      width: 180,
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      width: 120,
      render: (type: string) => {
        const labels: Record<string, string> = {
          CO_INVESTMENT: '跟投项目',
          MIFC_FUND_LP: 'MIFC主基金LP',
          MIFC_ABS: 'MIFC ABS',
        }
        return <Tag color="blue">{labels[type] || type}</Tag>
      },
    },
    {
      title: '目标金额',
      dataIndex: 'targetAmount',
      key: 'targetAmount',
      width: 120,
      render: (amount: number) => `¥${(amount / 10000).toFixed(0)}万`,
    },
    {
      title: '预期收益',
      key: 'expectedReturn',
      width: 120,
      render: (_: any, record: ProjectSubmission) => 
        `${record.expectedReturn.min}-${record.expectedReturn.max}%`,
    },
    {
      title: '风险等级',
      dataIndex: 'riskLevel',
      key: 'riskLevel',
      width: 100,
      render: (level: string) => {
        const colors: Record<string, string> = {
          LOW: 'success',
          MEDIUM: 'warning',
          HIGH: 'error',
        }
        const labels: Record<string, string> = {
          LOW: '低风险',
          MEDIUM: '中风险',
          HIGH: '高风险',
        }
        return <Tag color={colors[level]}>{labels[level]}</Tag>
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => {
        const colors: Record<string, string> = {
          PENDING: 'processing',
          UNDER_REVIEW: 'processing',
          APPROVED: 'success',
          REJECTED: 'error',
        }
        const labels: Record<string, string> = {
          PENDING: '待审核',
          UNDER_REVIEW: '审核中',
          APPROVED: '已批准',
          REJECTED: '已拒绝',
        }
        return <Tag color={colors[status]}>{labels[status]}</Tag>
      },
    },
    {
      title: '提交时间',
      dataIndex: 'submittedAt',
      key: 'submittedAt',
      width: 150,
      render: (date: string) => date ? new Date(date).toLocaleString('zh-CN') : '-',
    },
    {
      title: '操作',
      key: 'actions',
      width: 250,
      fixed: 'right' as const,
      render: (_: any, record: ProjectSubmission) => (
        <Space>
          {/* 批准和拒绝按钮 - 仅待审核时显示 */}
          {(record.status === 'PENDING' || record.status === 'UNDER_REVIEW') && (
            <>
              <Button
                type="primary"
                size="small"
                icon={<CheckCircleOutlined />}
                onClick={() => handleProjectReviewClick(record, 'APPROVE')}
              >
                批准
              </Button>
              <Button
                danger
                size="small"
                icon={<CloseCircleOutlined />}
                onClick={() => handleProjectReviewClick(record, 'REJECT')}
              >
                拒绝
              </Button>
            </>
          )}
          
          {/* 撤销按钮 - 仅已批准或已拒绝时显示 */}
          {(record.status === 'APPROVED' || record.status === 'REJECTED') && (
            <Button
              size="small"
              icon={<RollbackOutlined />}
              onClick={() => handleRevokeReview(record)}
            >
              撤销审核
            </Button>
          )}
        </Space>
      ),
    },
  ]

  return (
    <div className="central-kitchen-container">
      <div className="page-header">
        <h1 className="page-title">中央厨房控制中心</h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setCreateModalVisible(true)}
        >
          创建新资产
        </Button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '100px 0' }}>
          <Space direction="vertical" size="large">
            <div>加载中...</div>
          </Space>
        </div>
      ) : (
        <>
          {/* 总览指标 */}
          <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="总管理资产"
              value={overview?.totalAssets || 0}
              precision={0}
              valueStyle={{ color: '#3f8600' }}
              prefix="¥"
              suffix="万"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="资产管道"
              value={overview?.assetPipeline || 0}
              valueStyle={{ color: '#1890ff' }}
              suffix="个"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="待审批"
              value={overview?.pendingApproval || 0}
              valueStyle={{ color: '#faad14' }}
              suffix="个"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="系统健康度"
              value={overview?.systemHealth || 0}
              precision={1}
              valueStyle={{ color: '#52c41a' }}
              suffix="%"
            />
          </Card>
        </Col>
      </Row>

      {/* 图表 */}
      {!loading && overview && (
        <Row gutter={16} style={{ marginBottom: 24 }}>
          <Col xs={24} lg={12}>
            <Card title="资产管道状态">
              <ReactECharts option={getPipelineChartOption()} style={{ height: 300 }} />
            </Card>
          </Col>
          <Col xs={24} lg={12}>
            <Card title="资产类型分布">
              <ReactECharts option={getDistributionChartOption()} style={{ height: 300 }} />
            </Card>
          </Col>
        </Row>
      )}

      {/* 主要内容 */}
      <Tabs defaultActiveKey="projects">
        {/* 项目提交 Tab - 改为第一个 */}
        <TabPane tab={`项目提交 (${pendingProjects.length})`} key="projects">
          <Card>
            <Table
              columns={projectColumns}
              dataSource={pendingProjects}
              rowKey="id"
              loading={loading}
              pagination={{ pageSize: 10 }}
              scroll={{ x: 1400 }}
            />
          </Card>
        </TabPane>

        {/* 已上架项目 Tab - 原"待审批资产" */}
        <TabPane tab={`已上架项目 (${pendingAssets.length})`} key="listed">
          <Card>
            <Table
              columns={columns}
              dataSource={pendingAssets}
              rowKey="id"
              loading={loading}
              pagination={{ pageSize: 10 }}
            />
          </Card>
        </TabPane>

        <TabPane tab="实时活动" key="activities">
          <Card>
            <Timeline mode="left">
              {activities && activities.length > 0 ? (
                activities.map((activity) => (
                  <Timeline.Item
                    key={activity.id}
                    color={
                      activity.type.includes('APPROVED') ? 'green' :
                      activity.type.includes('REJECTED') ? 'red' :
                      'blue'
                    }
                  >
                    <div className="activity-item">
                      <div className="activity-header">
                        <span className="activity-user">{activity.user.name}</span>
                        <span className="activity-time">
                          {new Date(activity.createdAt).toLocaleString('zh-CN')}
                        </span>
                      </div>
                      <div className="activity-description">{activity.description}</div>
                    </div>
                  </Timeline.Item>
                ))
              ) : (
                <Timeline.Item color="gray">
                  <div>暂无活动记录</div>
                </Timeline.Item>
              )}
            </Timeline>
          </Card>
        </TabPane>
      </Tabs>

      {/* 审批模态框 */}
      <Modal
        title={
          approvalAction === 'APPROVE' ? '批准资产' :
          approvalAction === 'REJECT' ? '拒绝资产' :
          '标记为审核中'
        }
        open={approvalModalVisible}
        onCancel={() => {
          setApprovalModalVisible(false)
          form.resetFields()
        }}
        onOk={() => form.submit()}
        okText="确认"
        cancelText="取消"
      >
        <Form form={form} layout="vertical" onFinish={handleApprovalSubmit}>
          <div style={{ marginBottom: 16 }}>
            <strong>资产名称：</strong>{selectedAsset?.title}
          </div>
          <Form.Item
            label="备注"
            name="comment"
            rules={[{ required: true, message: '请输入备注' }]}
          >
            <TextArea rows={4} placeholder="请输入审批意见或备注" />
          </Form.Item>
        </Form>
      </Modal>

      {/* 创建资产模态框 */}
      <Modal
        title="创建新资产"
        open={createModalVisible}
        onCancel={() => {
          setCreateModalVisible(false)
          createForm.resetFields()
        }}
        onOk={() => createForm.submit()}
        okText="创建"
        cancelText="取消"
        width={800}
      >
        <Form form={createForm} layout="vertical" onFinish={handleCreateAsset}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="资产名称"
                name="title"
                rules={[{ required: true, message: '请输入资产名称' }]}
              >
                <Input placeholder="例如：北京朝阳区赛道项目" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="资产类型"
                name="type"
                rules={[{ required: true, message: '请选择资产类型' }]}
              >
                <Select placeholder="选择类型">
                  {Object.entries(assetTypeLabels).map(([key, { label, icon }]) => (
                    <Option key={key} value={key}>
                      {icon} {label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label="资产描述"
            name="description"
            rules={[{ required: true, message: '请输入资产描述' }]}
          >
            <TextArea rows={3} placeholder="详细描述资产情况" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                label="目标金额（元）"
                name="targetAmount"
                rules={[{ required: true, message: '请输入目标金额' }]}
              >
                <Input type="number" placeholder="例如：5000000" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="最小投资（元）"
                name="minInvestment"
                rules={[{ required: true, message: '请输入最小投资额' }]}
              >
                <Input type="number" placeholder="例如：100000" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="最大投资（元）"
                name="maxInvestment"
                rules={[{ required: true, message: '请输入最大投资额' }]}
              >
                <Input type="number" placeholder="例如：1000000" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                label="预期年化回报率（最小%）"
                name="expectedReturnMin"
                rules={[{ required: true, message: '请输入最小回报率' }]}
              >
                <Input type="number" placeholder="例如：8" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="预期年化回报率（最大%）"
                name="expectedReturnMax"
                rules={[{ required: true, message: '请输入最大回报率' }]}
              >
                <Input type="number" placeholder="例如：15" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="投资期限（月）"
                name="investmentPeriod"
                rules={[{ required: true, message: '请输入投资期限' }]}
              >
                <Input type="number" placeholder="例如：24" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                label="风险等级"
                name="riskLevel"
                rules={[{ required: true, message: '请选择风险等级' }]}
              >
                <Select placeholder="选择风险等级">
                  <Option value="LOW">低风险</Option>
                  <Option value="MEDIUM">中风险</Option>
                  <Option value="HIGH">高风险</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="风险评分（1-10）"
                name="riskScore"
                rules={[{ required: true, message: '请输入风险评分' }]}
              >
                <Input type="number" min={1} max={10} placeholder="例如：5" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="地区"
                name="region"
                rules={[{ required: true, message: '请输入地区' }]}
              >
                <Input placeholder="例如：北京" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label="城市"
            name="city"
          >
            <Input placeholder="例如：朝阳区" />
          </Form.Item>

          <Form.Item
            label="收益结构类型"
            name="revenueType"
            rules={[{ required: true, message: '请输入收益结构类型' }]}
          >
            <Input placeholder="例如：revenue_sharing" />
          </Form.Item>

          <Form.Item
            label="收益结构描述"
            name="revenueDescription"
            rules={[{ required: true, message: '请输入收益结构描述' }]}
          >
            <TextArea rows={2} placeholder="例如：按月分红，收益分成比例70%" />
          </Form.Item>

          <Form.Item
            label="募资截止日期"
            name="fundingDeadline"
          >
            <Input type="date" />
          </Form.Item>
        </Form>
      </Modal>

      {/* 项目审核Modal */}
      <Modal
        title={approvalAction === 'APPROVE' ? '批准项目' : '拒绝项目'}
        open={projectReviewModalVisible}
        onCancel={() => {
          setProjectReviewModalVisible(false)
          projectReviewForm.resetFields()
        }}
        onOk={() => projectReviewForm.submit()}
        width={600}
      >
        {selectedProject && (
          <div>
            <p><strong>项目名称：</strong>{selectedProject.title}</p>
            <p><strong>提交方：</strong>{selectedProject.ownerName}</p>
            <p><strong>目标金额：</strong>¥{(selectedProject.targetAmount / 10000).toFixed(0)}万</p>
            <p><strong>预期收益：</strong>{selectedProject.expectedReturn.min}-{selectedProject.expectedReturn.max}%</p>
            
            <Form
              form={projectReviewForm}
              layout="vertical"
              onFinish={handleProjectReviewSubmit}
            >
              <Form.Item
                label={approvalAction === 'APPROVE' ? '批准意见' : '拒绝原因'}
                name="notes"
                rules={[{ required: approvalAction === 'REJECT', message: '请输入备注' }]}
              >
                <TextArea
                  rows={4}
                  placeholder={
                    approvalAction === 'APPROVE' 
                      ? '项目符合上架要求，可以批准...' 
                      : '请说明拒绝原因...'
                  }
                />
              </Form.Item>
            </Form>
          </div>
        )}
      </Modal>
        </>
      )}
    </div>
  )
}

export default CentralKitchen
