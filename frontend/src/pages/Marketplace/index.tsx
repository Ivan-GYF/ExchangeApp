import { useEffect, useState } from 'react'
import { Row, Col, Card, Tag, Progress, Button, Select, Slider, Space, Spin, Empty } from 'antd'
import { useNavigate } from 'react-router-dom'
import { apiClient } from '@/services/api'
import { Asset } from '@/types'
import './Marketplace.css'

const { Option } = Select

const assetTypeLabels: Record<string, { label: string; color: string; icon: string }> = {
  MIFC_FUND_LP: { label: 'MIFC主基金LP', color: '#597ef7', icon: '💎' },
  MIFC_ABS: { label: 'MIFC ABS', color: '#13c2c2', icon: '🛡️' },
  CO_INVESTMENT: { label: '跟投项目', color: '#ff7a45', icon: '🤝' },
}

const riskLevelLabels: Record<string, { label: string; color: string }> = {
  LOW: { label: '低风险', color: '#52c41a' },
  MEDIUM: { label: '中风险', color: '#faad14' },
  HIGH: { label: '高风险', color: '#ff4d4f' },
}

const Marketplace = () => {
  const navigate = useNavigate()
  const [assets, setAssets] = useState<Asset[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    type: undefined as string | undefined,
    riskLevel: undefined as string | undefined,
    returnRange: [0, 40] as [number, number],
  })

  useEffect(() => {
    fetchAssets()
  }, [filters])

  const fetchAssets = async () => {
    setLoading(true)
    try {
      const params: any = { status: 'LISTED' }
      if (filters.type) params.type = filters.type
      if (filters.riskLevel) params.riskLevel = filters.riskLevel

      const response = await apiClient.get<{ assets: Asset[]; pagination: any }>('/assets', { params })

      // 前端过滤回报率范围
      let filteredAssets = response.assets
      if (filters.returnRange) {
        filteredAssets = filteredAssets.filter(asset => {
          const avgReturn = ((asset.expectedReturnMin || asset.expectedReturn?.min || 0) + (asset.expectedReturnMax || asset.expectedReturn?.max || 0)) / 2
          return avgReturn >= filters.returnRange[0] && avgReturn <= filters.returnRange[1]
        })
      }

      setAssets(filteredAssets)
    } catch (error) {
      console.error('Failed to fetch assets:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const resetFilters = () => {
    setFilters({
      type: undefined,
      riskLevel: undefined,
      returnRange: [0, 40],
    })
  }

  const formatCurrency = (amount: number) => {
    return `¥${(amount / 10000).toFixed(0)}万`
  }

  return (
    <div className="marketplace-container">
      <h1 className="page-title">市场浏览器</h1>

      <Row gutter={24}>
        {/* 左侧筛选面板 */}
        <Col xs={24} lg={6}>
          <Card title="筛选条件" className="filter-card">
            <div className="filter-section">
              <h4>收入分成类型</h4>
              <Select
                style={{ width: '100%' }}
                placeholder="选择类型"
                allowClear
                value={filters.type}
                onChange={(value) => handleFilterChange('type', value)}
              >
                {Object.entries(assetTypeLabels).map(([key, { label, icon }]) => (
                  <Option key={key} value={key}>
                    {icon} {label}
                  </Option>
                ))}
              </Select>
            </div>

            <div className="filter-section">
              <h4>风险等级</h4>
              <Select
                style={{ width: '100%' }}
                placeholder="选择风险等级"
                allowClear
                value={filters.riskLevel}
                onChange={(value) => handleFilterChange('riskLevel', value)}
              >
                {Object.entries(riskLevelLabels).map(([key, { label }]) => (
                  <Option key={key} value={key}>{label}</Option>
                ))}
              </Select>
            </div>

            <div className="filter-section">
              <h4>预期回报率 (%)</h4>
              <Slider
                range
                min={0}
                max={40}
                value={filters.returnRange}
                onChange={(value) => handleFilterChange('returnRange', value as [number, number])}
                marks={{
                  0: '0%',
                  10: '10%',
                  20: '20%',
                  30: '30%',
                  40: '40%',
                }}
              />
              <div style={{ textAlign: 'center', marginTop: 8, color: '#666' }}>
                {filters.returnRange[0]}% - {filters.returnRange[1]}%
              </div>
            </div>

            <Button block onClick={resetFilters} style={{ marginTop: 16 }}>
              重置筛选
            </Button>
          </Card>
        </Col>

        {/* 右侧资产列表 */}
        <Col xs={24} lg={18}>
          {loading ? (
            <div className="loading-container">
              <Spin size="large" />
            </div>
          ) : assets.length === 0 ? (
            <Empty description="暂无符合条件的资产" />
          ) : (
            <Row gutter={[16, 16]}>
              {assets.map((asset) => {
                const typeInfo = assetTypeLabels[asset.type]
                const riskInfo = riskLevelLabels[asset.riskLevel]
                const progress = (asset.raisedAmount / asset.targetAmount) * 100

                return (
                  <Col xs={24} sm={12} lg={8} key={asset.id}>
                    <Card
                      hoverable
                      className="asset-card"
                      onClick={() => navigate(`/assets/${asset.id}`)}
                    >
                      <div className="asset-header">
                        <Space size="small">
                          <Tag color={typeInfo.color}>
                            {typeInfo.icon} {typeInfo.label}
                          </Tag>
                          <Tag color={riskInfo.color}>{riskInfo.label}</Tag>
                        </Space>
                      </div>

                      <h3 className="asset-title">{asset.title}</h3>

                      <p className="asset-description">
                        {asset.description.substring(0, 60)}...
                      </p>

                      <div className="asset-stats">
                        <div className="stat-item">
                          <span className="stat-label">预期年化</span>
                          <span className="stat-value highlight">
                            {asset.expectedReturnMin}-{asset.expectedReturnMax}%
                          </span>
                        </div>
                        <div className="stat-item">
                          <span className="stat-label">投资金额</span>
                          <span className="stat-value">
                            {formatCurrency(asset.minInvestment)}-{formatCurrency(asset.maxInvestment)}
                          </span>
                        </div>
                      </div>

                      <div className="asset-progress">
                        <div className="progress-info">
                          <span>已募集 {formatCurrency(asset.raisedAmount)}</span>
                          <span>{progress.toFixed(1)}%</span>
                        </div>
                        <Progress
                          percent={progress}
                          showInfo={false}
                          strokeColor={typeInfo.color}
                        />
                        <div className="progress-footer">
                          <span>目标 {formatCurrency(asset.targetAmount)}</span>
                          {asset.fundingDeadline && (
                            <span className="deadline">
                              剩余 {Math.ceil((new Date(asset.fundingDeadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24))} 天
                            </span>
                          )}
                        </div>
                      </div>

                      <Button type="primary" block size="small" style={{ marginTop: 12 }}>
                        查看详情
                      </Button>
                    </Card>
                  </Col>
                )
              })}
            </Row>
          )}
        </Col>
      </Row>
    </div>
  )
}

export default Marketplace
