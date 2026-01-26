import { useEffect, useState } from 'react'
import { Row, Col, Card, Form, Input, InputNumber, Select, Button, Tag, Progress, Modal, Empty, Badge } from 'antd'
import { PlusOutlined, UserOutlined, BankOutlined, SearchOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { apiClient } from '@/services/api'
import { Asset } from '@/types'
import './MatchingWorkbench.css'

const { Option } = Select
const { TextArea } = Input

// 资产类型标签
const assetTypeLabels: Record<string, { label: string; color: string; icon: string }> = {
  MIFC_FUND_LP: { label: 'MIFC主基金LP', color: '#597ef7', icon: '💎' },
  MIFC_ABS: { label: 'MIFC ABS', color: '#13c2c2', icon: '🛡️' },
  CO_INVESTMENT: { label: '跟投项目', color: '#ff7a45', icon: '🤝' },
  RACING_TRACK: { label: '赛车场', color: '#91d5ff', icon: '🏁' },
  STREAMING: { label: '新媒体', color: '#95de64', icon: '📱' },
  CAMPUS_FACILITY: { label: '校园设施', color: '#ffd591', icon: '🏫' },
  CONCERT_TICKET: { label: '演唱会', color: '#ffa39e', icon: '🎤' },
}

// 风险等级标签
const riskLevelLabels: Record<string, { label: string; color: string }> = {
  LOW: { label: '低风险', color: '#52c41a' },
  MEDIUM: { label: '中风险', color: '#faad14' },
  HIGH: { label: '高风险', color: '#ff4d4f' },
  ANY: { label: '不限', color: '#d9d9d9' },
}

// 投资方需求卡接口
interface InvestorDemand {
  id: string
  investorName: string
  investmentAmount: number  // 投资金额（万元）
  targetReturn: number      // 目标收益（%）
  preferredType?: string    // 赛道（选填）
  riskLevel?: string        // 风险类别（选填）
  notes?: string            // 备注
  createdAt: string
}

// 预设的需求卡 Demo 数据（对应4个真实投资人账户）
const demoInvestorDemands: InvestorDemand[] = [
  {
    id: 'demand-001',
    investorName: '水珠资本管理有限公司',
    investmentAmount: 2000, // 2000万
    targetReturn: 15,
    preferredType: 'MIFC_FUND_LP',
    riskLevel: 'HIGH',
    notes: '追求高收益，可承受劣后级风险，偏好主基金LP份额',
    createdAt: '2024-01-15T10:00:00.000Z',
  },
  {
    id: 'demand-002',
    investorName: '水流资产管理有限公司',
    investmentAmount: 1500, // 1500万
    targetReturn: 8,
    preferredType: 'MIFC_ABS',
    riskLevel: 'LOW',
    notes: '追求稳健收益，优先级份额优先，固定收益产品',
    createdAt: '2024-02-10T14:30:00.000Z',
  },
  {
    id: 'demand-003',
    investorName: '水滴信托有限责任公司',
    investmentAmount: 300, // 300万
    targetReturn: 20,
    preferredType: 'CO_INVESTMENT',
    riskLevel: 'HIGH',
    notes: '关注高成长跟投项目，可承受高风险，偏好新媒体和文娱类',
    createdAt: '2025-11-20T09:15:00.000Z',
  },
  {
    id: 'demand-004',
    investorName: '张明远（高净值个人）',
    investmentAmount: 100, // 100万
    targetReturn: 12,
    preferredType: 'CO_INVESTMENT',
    riskLevel: 'MEDIUM',
    notes: '个人投资者，偏好演唱会和体育赛事类项目，中等风险',
    createdAt: '2026-01-05T16:45:00.000Z',
  },
]

const MatchingWorkbench = () => {
  const navigate = useNavigate()
  const [form] = Form.useForm()
  
  // 状态
  const [demands, setDemands] = useState<InvestorDemand[]>(demoInvestorDemands)
  const [assets, setAssets] = useState<Asset[]>([])
  const [selectedDemand, setSelectedDemand] = useState<InvestorDemand | null>(null)
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null)
  const [matchedAssets, setMatchedAssets] = useState<Asset[]>([])
  const [matchedDemands, setMatchedDemands] = useState<InvestorDemand[]>([])
  const [modalVisible, setModalVisible] = useState(false)
  const [loading, setLoading] = useState(true)
  const [searchKeyword, setSearchKeyword] = useState('')

  useEffect(() => {
    fetchAssets()
  }, [])

  // 获取所有资产
  const fetchAssets = async () => {
    try {
      const response = await apiClient.get<{ assets: Asset[] }>('/assets')
      setAssets(response.assets || [])
    } catch (error) {
      console.error('Failed to fetch assets:', error)
    } finally {
      setLoading(false)
    }
  }

  // 根据需求卡匹配项目
  const matchAssetsForDemand = (demand: InvestorDemand): Asset[] => {
    return assets.filter(asset => {
      // 投资金额匹配（需求金额在项目允许范围内）
      const demandAmountYuan = demand.investmentAmount * 10000
      if (demandAmountYuan < asset.minInvestment || demandAmountYuan > asset.maxInvestment) {
        return false
      }
      
      // 目标收益匹配（项目收益 >= 需求目标）
      if ((asset.expectedReturnMin || asset.expectedReturn?.min || 0) < demand.targetReturn) {
        return false
      }
      
      // 赛道匹配（如果指定了）
      if (demand.preferredType && asset.type !== demand.preferredType) {
        return false
      }
      
      // 风险等级匹配（如果指定了且不是"不限"）
      if (demand.riskLevel && demand.riskLevel !== 'ANY' && asset.riskLevel !== demand.riskLevel) {
        return false
      }
      
      return true
    })
  }

  // 根据项目匹配需求卡
  const matchDemandsForAsset = (asset: Asset): InvestorDemand[] => {
    return demands.filter(demand => {
      // 投资金额匹配
      const demandAmountYuan = demand.investmentAmount * 10000
      if (demandAmountYuan < asset.minInvestment || demandAmountYuan > asset.maxInvestment) {
        return false
      }
      
      // 目标收益匹配
      if ((asset.expectedReturnMin || asset.expectedReturn?.min || 0) < demand.targetReturn) {
        return false
      }
      
      // 赛道匹配
      if (demand.preferredType && asset.type !== demand.preferredType) {
        return false
      }
      
      // 风险等级匹配
      if (demand.riskLevel && demand.riskLevel !== 'ANY' && asset.riskLevel !== demand.riskLevel) {
        return false
      }
      
      return true
    })
  }

  // 点击需求卡
  const handleDemandClick = (demand: InvestorDemand) => {
    setSelectedDemand(demand)
    setSelectedAsset(null)
    setMatchedAssets(matchAssetsForDemand(demand))
    setMatchedDemands([])
  }

  // 点击项目
  const handleAssetClick = (asset: Asset) => {
    setSelectedAsset(asset)
    setSelectedDemand(null)
    setMatchedDemands(matchDemandsForAsset(asset))
    setMatchedAssets([])
  }

  // 提交新的投资意向
  const handleSubmitDemand = (values: any) => {
    const newDemand: InvestorDemand = {
      id: 'demand-' + Date.now(),
      investorName: values.investorName,
      investmentAmount: values.investmentAmount,
      targetReturn: values.targetReturn,
      preferredType: values.preferredType,
      riskLevel: values.riskLevel || 'ANY',
      notes: values.notes,
      createdAt: new Date().toISOString(),
    }
    
    setDemands([newDemand, ...demands])
    setModalVisible(false)
    form.resetFields()
  }

  // 格式化金额
  const formatCurrency = (amount: number) => {
    return `¥${amount.toFixed(0)}万`
  }

  // 过滤后的资产列表
  const filteredAssets = assets.filter(asset => {
    if (!searchKeyword) return true
    return asset.title.toLowerCase().includes(searchKeyword.toLowerCase())
  })

  // 显示的资产列表（如果选中了需求卡则显示匹配的，否则显示全部）
  const displayAssets = selectedDemand ? matchedAssets : filteredAssets

  // 显示的需求卡列表（如果选中了项目则显示匹配的，否则显示全部）
  const displayDemands = selectedAsset ? matchedDemands : demands

  return (
    <div className="matching-workbench-container">
      <div className="page-header">
        <h1 className="page-title">匹配工作台</h1>
        <Button 
          type="primary" 
          icon={<PlusOutlined />}
          onClick={() => setModalVisible(true)}
        >
          提交投资意向
        </Button>
      </div>

      <Row gutter={24}>
        {/* 左侧：投资方需求卡 */}
        <Col xs={24} lg={10}>
          <Card 
            title={
              <div className="card-title-wrapper">
                <UserOutlined /> 投资方需求
                {selectedAsset && (
                  <Tag color="blue" style={{ marginLeft: 8 }}>
                    匹配 "{selectedAsset.title.substring(0, 10)}..."
                  </Tag>
                )}
              </div>
            }
            extra={
              selectedAsset && (
                <Button size="small" onClick={() => {
                  setSelectedAsset(null)
                  setMatchedDemands([])
                }}>
                  显示全部
                </Button>
              )
            }
            className="demand-card-container"
          >
            {displayDemands.length === 0 ? (
              <Empty description={selectedAsset ? "没有匹配的投资方" : "暂无投资意向"} />
            ) : (
              <div className="demand-list">
                {displayDemands.map(demand => (
                  <div
                    key={demand.id}
                    className={`demand-card ${selectedDemand?.id === demand.id ? 'selected' : ''}`}
                    onClick={() => handleDemandClick(demand)}
                  >
                    <div className="demand-header">
                      <span className="demand-name">{demand.investorName}</span>
                      <Badge 
                        count={matchAssetsForDemand(demand).length} 
                        style={{ backgroundColor: '#52c41a' }}
                        title="匹配项目数"
                      />
                    </div>
                    
                    <div className="demand-info">
                      <div className="info-item">
                        <span className="info-label">投资金额</span>
                        <span className="info-value">{formatCurrency(demand.investmentAmount)}</span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">目标收益</span>
                        <span className="info-value highlight">{demand.targetReturn}%+</span>
                      </div>
                    </div>
                    
                    <div className="demand-tags">
                      {demand.preferredType && (
                        <Tag color={assetTypeLabels[demand.preferredType]?.color}>
                          {assetTypeLabels[demand.preferredType]?.icon} {assetTypeLabels[demand.preferredType]?.label}
                        </Tag>
                      )}
                      {demand.riskLevel && (
                        <Tag color={riskLevelLabels[demand.riskLevel]?.color}>
                          {riskLevelLabels[demand.riskLevel]?.label}
                        </Tag>
                      )}
                    </div>
                    
                    {demand.notes && (
                      <div className="demand-notes">{demand.notes}</div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </Card>
        </Col>

        {/* 右侧：投资机会 */}
        <Col xs={24} lg={14}>
          <Card 
            title={
              <div className="card-title-wrapper">
                <BankOutlined /> 投资机会
                {selectedDemand && (
                  <Tag color="green" style={{ marginLeft: 8 }}>
                    匹配 "{selectedDemand.investorName}"
                  </Tag>
                )}
              </div>
            }
            extra={
              <div style={{ display: 'flex', gap: 8 }}>
                {selectedDemand && (
                  <Button size="small" onClick={() => {
                    setSelectedDemand(null)
                    setMatchedAssets([])
                  }}>
                    显示全部
                  </Button>
                )}
                <Input
                  placeholder="搜索项目..."
                  prefix={<SearchOutlined />}
                  style={{ width: 180 }}
                  value={searchKeyword}
                  onChange={e => setSearchKeyword(e.target.value)}
                  allowClear
                />
              </div>
            }
            className="asset-card-container"
          >
            {loading ? (
              <div className="loading-container">加载中...</div>
            ) : displayAssets.length === 0 ? (
              <Empty description={selectedDemand ? "没有匹配的投资机会" : "暂无投资机会"} />
            ) : (
              <div className="asset-list">
                {displayAssets.map(asset => {
                  const typeInfo = assetTypeLabels[asset.type]
                  const riskInfo = riskLevelLabels[asset.riskLevel]
                  const progress = (asset.raisedAmount / asset.targetAmount) * 100

                  return (
                    <div
                      key={asset.id}
                      className={`asset-card ${selectedAsset?.id === asset.id ? 'selected' : ''}`}
                      onClick={() => handleAssetClick(asset)}
                    >
                      <div className="asset-header">
                        <div className="asset-tags">
                          <Tag color={typeInfo?.color}>
                            {typeInfo?.icon} {typeInfo?.label}
                          </Tag>
                          <Tag color={riskInfo?.color}>{riskInfo?.label}</Tag>
                        </div>
                        <Badge 
                          count={matchDemandsForAsset(asset).length} 
                          style={{ backgroundColor: '#1890ff' }}
                          title="匹配投资方数"
                        />
                      </div>

                      <h3 className="asset-title">{asset.title}</h3>

                      <div className="asset-stats">
                        <div className="stat-item">
                          <span className="stat-label">预期年化</span>
                          <span className="stat-value highlight">
                            {asset.expectedReturnMin}-{asset.expectedReturnMax}%
                          </span>
                        </div>
                        <div className="stat-item">
                          <span className="stat-label">投资范围</span>
                          <span className="stat-value">
                            {(asset.minInvestment / 10000).toFixed(0)}-{(asset.maxInvestment / 10000).toFixed(0)}万
                          </span>
                        </div>
                        <div className="stat-item">
                          <span className="stat-label">目标金额</span>
                          <span className="stat-value">
                            {(asset.targetAmount / 10000).toFixed(0)}万
                          </span>
                        </div>
                      </div>

                      <div className="asset-progress">
                        <Progress
                          percent={progress}
                          strokeColor={typeInfo?.color}
                          size="small"
                          format={(percent) => `${percent?.toFixed(1)}%`}
                        />
                      </div>

                      <Button 
                        type="link" 
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation()
                          navigate(`/assets/${asset.id}`)
                        }}
                      >
                        查看详情 →
                      </Button>
                    </div>
                  )
                })}
              </div>
            )}
          </Card>
        </Col>
      </Row>

      {/* 提交投资意向弹窗 */}
      <Modal
        title="提交投资意向"
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false)
          form.resetFields()
        }}
        onOk={() => form.submit()}
        okText="提交"
        cancelText="取消"
        width={500}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmitDemand}
        >
          <Form.Item
            label="投资人名称"
            name="investorName"
            rules={[{ required: true, message: '请输入投资人名称' }]}
          >
            <Input placeholder="例如：张先生、某某基金" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="投资金额（万元）"
                name="investmentAmount"
                rules={[{ required: true, message: '请输入投资金额' }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  min={1}
                  max={100000}
                  placeholder="例如：100"
                  addonAfter="万"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="目标收益（年化%）"
                name="targetReturn"
                rules={[{ required: true, message: '请输入目标收益' }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  min={1}
                  max={100}
                  placeholder="例如：12"
                  addonAfter="%"
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="偏好赛道（选填）"
                name="preferredType"
              >
                <Select placeholder="不限" allowClear>
                  {Object.entries(assetTypeLabels).map(([key, { label, icon }]) => (
                    <Option key={key} value={key}>
                      {icon} {label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="风险偏好（选填）"
                name="riskLevel"
              >
                <Select placeholder="不限" allowClear>
                  <Option value="LOW">低风险</Option>
                  <Option value="MEDIUM">中风险</Option>
                  <Option value="HIGH">高风险</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label="备注说明（选填）"
            name="notes"
          >
            <TextArea
              rows={3}
              placeholder="其他投资偏好或要求..."
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default MatchingWorkbench
