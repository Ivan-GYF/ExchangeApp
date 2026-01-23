import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Card,
  Row,
  Col,
  Tag,
  Button,
  Descriptions,
  Progress,
  Modal,
  InputNumber,
  Form,
  message,
  Spin,
  Divider,
  Timeline,
  Table,
} from 'antd'
import {
  ArrowLeftOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons'
import { apiClient } from '@/services/api'
import { Asset, Milestone } from '@/types'
import './AssetDetail.css'

const assetTypeLabels: Record<string, { label: string; color: string; icon: string }> = {
  RACING_TRACK: { label: '轻资产赛道', color: '#91d5ff', icon: '🏁' },
  DOUYIN_STREAMING: { label: '抖音投流', color: '#95de64', icon: '📱' },
  CAMPUS_FACILITY: { label: '天猫校园', color: '#ffd591', icon: '🏫' },
  CONCERT_TICKET: { label: '演唱会门票', color: '#ffa39e', icon: '🎤' },
}

const riskLevelLabels: Record<string, { label: string; color: string }> = {
  LOW: { label: '低风险', color: '#52c41a' },
  MEDIUM: { label: '中风险', color: '#faad14' },
  HIGH: { label: '高风险', color: '#ff4d4f' },
}

const AssetDetail = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [asset, setAsset] = useState<Asset | null>(null)
  const [loading, setLoading] = useState(true)
  const [investModalVisible, setInvestModalVisible] = useState(false)
  const [investing, setInvesting] = useState(false)
  const [form] = Form.useForm()

  useEffect(() => {
    if (id) {
      fetchAssetDetail()
    }
  }, [id])

  const fetchAssetDetail = async () => {
    try {
      const data = await apiClient.get<Asset>(`/assets/${id}`)
      setAsset(data)
    } catch (error) {
      message.error('获取资产详情失败')
      navigate('/marketplace')
    } finally {
      setLoading(false)
    }
  }

  const handleInvest = async (values: any) => {
    setInvesting(true)
    try {
      await apiClient.post('/investments', {
        assetId: id,
        amount: values.amount,
      })
      message.success('投资成功！')
      setInvestModalVisible(false)
      form.resetFields()
      fetchAssetDetail() // 刷新资产信息
    } catch (error: any) {
      message.error(error.response?.data?.error?.message || '投资失败，请重试')
    } finally {
      setInvesting(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return `¥${(amount / 10000).toFixed(2)}万`
  }

  if (loading) {
    return (
      <div className="loading-container">
        <Spin size="large" />
      </div>
    )
  }

  if (!asset) {
    return null
  }

  const typeInfo = assetTypeLabels[asset.type]
  const riskInfo = riskLevelLabels[asset.riskLevel]
  const progress = (asset.raisedAmount / asset.targetAmount) * 100
  const remainingAmount = asset.targetAmount - asset.raisedAmount

  // 解析收益结构
  const revenueStructure = typeof asset.revenueStructure === 'string'
    ? JSON.parse(asset.revenueStructure)
    : asset.revenueStructure

  const revenueData = Object.entries(revenueStructure).map(([key, value]) => ({
    name: key,
    value: value as number,
  }))

  return (
    <div className="asset-detail-container">
      <Button
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate('/marketplace')}
        style={{ marginBottom: 16 }}
      >
        返回市场
      </Button>

      <Row gutter={24}>
        <Col xs={24} lg={16}>
          <Card>
            <div className="asset-header">
              <div>
                <Tag color={typeInfo.color} style={{ marginBottom: 8 }}>
                  {typeInfo.icon} {typeInfo.label}
                </Tag>
                <Tag color={riskInfo.color}>{riskInfo.label}</Tag>
                <Tag>风险评分: {asset.riskScore}/10</Tag>
              </div>
            </div>

            <h1 className="asset-title">{asset.title}</h1>

            <Descriptions column={2} style={{ marginTop: 24 }}>
              <Descriptions.Item label="预期年化回报">
                <span style={{ color: '#ff4d4f', fontWeight: 600, fontSize: 16 }}>
                  {asset.expectedReturnMin}-{asset.expectedReturnMax}%
                </span>
              </Descriptions.Item>
              <Descriptions.Item label="投资期限">
                {asset.investmentPeriod} 个月
              </Descriptions.Item>
              <Descriptions.Item label="最小投资额">
                {formatCurrency(asset.minInvestment)}
              </Descriptions.Item>
              <Descriptions.Item label="最大投资额">
                {formatCurrency(asset.maxInvestment)}
              </Descriptions.Item>
              <Descriptions.Item label="地区">
                {asset.region} {asset.city}
              </Descriptions.Item>
              <Descriptions.Item label="状态">
                <Tag color="blue">{asset.status === 'LISTED' ? '募资中' : '已上线'}</Tag>
              </Descriptions.Item>
            </Descriptions>

            <Divider />

            <h3>项目描述</h3>
            <p style={{ lineHeight: 1.8, color: 'rgba(0,0,0,0.65)' }}>
              {asset.description}
            </p>

            <Divider />

            <h3>收益结构</h3>
            <div className="revenue-structure">
              {revenueData.map((item) => (
                <div key={item.name} className="revenue-item">
                  <div className="revenue-label">{item.name}</div>
                  <Progress
                    percent={item.value}
                    strokeColor={typeInfo.color}
                    format={(percent) => `${percent}%`}
                  />
                </div>
              ))}
            </div>

            {asset.milestones && asset.milestones.length > 0 && (
              <>
                <Divider />
                <h3>项目里程碑</h3>
                <Timeline
                  items={asset.milestones.map((milestone: Milestone) => ({
                    color: milestone.status === 'COMPLETED' ? 'green' : 'blue',
                    dot: milestone.status === 'COMPLETED' ? <CheckCircleOutlined /> : <ClockCircleOutlined />,
                    children: (
                      <div>
                        <div style={{ fontWeight: 600 }}>{milestone.title}</div>
                        <div style={{ fontSize: 12, color: 'rgba(0,0,0,0.45)' }}>
                          {new Date(milestone.dueDate).toLocaleDateString()}
                        </div>
                        {milestone.description && (
                          <div style={{ marginTop: 4, color: 'rgba(0,0,0,0.65)' }}>
                            {milestone.description}
                          </div>
                        )}
                      </div>
                    ),
                  }))}
                />
              </>
            )}
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card className="investment-card">
            <h3>投资摘要</h3>

            <div className="funding-progress">
              <div className="progress-header">
                <span className="raised-amount">{formatCurrency(asset.raisedAmount)}</span>
                <span className="progress-percent">{progress.toFixed(1)}%</span>
              </div>
              <Progress
                percent={progress}
                showInfo={false}
                strokeColor={typeInfo.color}
                strokeWidth={12}
              />
              <div className="progress-footer">
                <span>目标 {formatCurrency(asset.targetAmount)}</span>
                {asset.fundingDeadline && (
                  <span>
                    剩余 {Math.ceil((new Date(asset.fundingDeadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24))} 天
                  </span>
                )}
              </div>
            </div>

            <Divider />

            <div className="investment-info">
              <div className="info-item">
                <span className="info-label">剩余可投</span>
                <span className="info-value">{formatCurrency(remainingAmount)}</span>
              </div>
              <div className="info-item">
                <span className="info-label">管理费</span>
                <span className="info-value">2%</span>
              </div>
              <div className="info-item">
                <span className="info-label">手续费</span>
                <span className="info-value">1%</span>
              </div>
            </div>

            <Button
              type="primary"
              size="large"
              block
              onClick={() => setInvestModalVisible(true)}
              disabled={progress >= 100}
              style={{ marginTop: 24 }}
            >
              {progress >= 100 ? '已满额' : '立即投资'}
            </Button>
          </Card>
        </Col>
      </Row>

      <Modal
        title="投资确认"
        open={investModalVisible}
        onCancel={() => setInvestModalVisible(false)}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleInvest}
        >
          <Form.Item
            label="投资金额（元）"
            name="amount"
            rules={[
              { required: true, message: '请输入投资金额' },
              {
                validator: (_, value) => {
                  if (value < asset.minInvestment) {
                    return Promise.reject(`最小投资额为 ${formatCurrency(asset.minInvestment)}`)
                  }
                  if (value > asset.maxInvestment) {
                    return Promise.reject(`最大投资额为 ${formatCurrency(asset.maxInvestment)}`)
                  }
                  if (value > remainingAmount) {
                    return Promise.reject(`超过剩余可投金额 ${formatCurrency(remainingAmount)}`)
                  }
                  return Promise.resolve()
                },
              },
            ]}
          >
            <InputNumber
              style={{ width: '100%' }}
              min={asset.minInvestment}
              max={Math.min(asset.maxInvestment, remainingAmount)}
              step={10000}
              formatter={(value) => `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={(value) => value!.replace(/¥\s?|(,*)/g, '') as any}
            />
          </Form.Item>

          <Form.Item>
            <div style={{ background: '#f5f5f5', padding: 16, borderRadius: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span>投资金额</span>
                <span>{formatCurrency(form.getFieldValue('amount') || 0)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span>管理费 (2%)</span>
                <span>-{formatCurrency((form.getFieldValue('amount') || 0) * 0.02)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span>手续费 (1%)</span>
                <span>-{formatCurrency((form.getFieldValue('amount') || 0) * 0.01)}</span>
              </div>
              <Divider style={{ margin: '12px 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600 }}>
                <span>实际投入</span>
                <span>{formatCurrency((form.getFieldValue('amount') || 0) * 0.97)}</span>
              </div>
            </div>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={investing} block size="large">
              确认投资
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default AssetDetail
