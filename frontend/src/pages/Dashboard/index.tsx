import { useEffect, useState } from 'react'
import { Row, Col, Card, Statistic, Spin, List, Tag, Progress } from 'antd'
import {
  DollarOutlined,
  ShoppingOutlined,
  TransactionOutlined,
  RiseOutlined,
  FireOutlined,
} from '@ant-design/icons'
import ReactECharts from 'echarts-for-react'
import { apiClient } from '@/services/api'
import { useNavigate } from 'react-router-dom'
import './Dashboard.css'

interface KPIData {
  totalAssets: number
  totalInvestors: number
  totalProjects: number
  avgReturn: number // 加权平均投资回报率
  assetGrowth?: number
  investorGrowth?: number
  projectGrowth?: number
}

interface Asset {
  id: string
  title: string
  type: string
  targetAmount: number
  raisedAmount: number
  status: string
  riskLevel: string
}

interface AssetDistribution {
  type: string
  label: string
  count: number
  color: string
}

const assetTypeLabels: Record<string, { label: string; color: string }> = {
  MIFC_FUND_LP: { label: 'MIFC主基金LP', color: '#722ed1' },
  MIFC_ABS: { label: 'MIFC ABS', color: '#13c2c2' },
  CO_INVESTMENT: { label: '跟投项目', color: '#1890ff' },
}

const Dashboard = () => {
  const [kpiData, setKpiData] = useState<KPIData | null>(null)
  const [featuredAssets, setFeaturedAssets] = useState<Asset[]>([])
  const [assetDistribution, setAssetDistribution] = useState<AssetDistribution[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    fetchAllData()
  }, [])

  const fetchAllData = async () => {
    try {
      await Promise.all([
        fetchKPIData(),
        fetchFeaturedAssets(),
        fetchAssetDistribution(),
      ])
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchKPIData = async () => {
    try {
      const data = await apiClient.get<KPIData>('/dashboard/kpi')
      setKpiData(data)
    } catch (error) {
      console.error('Failed to fetch KPI data:', error)
    }
  }

  const fetchFeaturedAssets = async () => {
    try {
      const data = await apiClient.get<Asset[]>('/dashboard/featured')
      setFeaturedAssets(data || [])
    } catch (error) {
      console.error('Failed to fetch featured assets:', error)
    }
  }

  const fetchAssetDistribution = async () => {
    try {
      const data = await apiClient.get<{ assets: Asset[] }>('/assets')
      const assets = data.assets || []
      
      // 统计各类型资产数量
      const distribution: Record<string, number> = {}
      assets.forEach(asset => {
        distribution[asset.type] = (distribution[asset.type] || 0) + 1
      })
      
      // 转换为图表数据
      const chartData: AssetDistribution[] = Object.entries(distribution).map(([type, count]) => ({
        type,
        label: assetTypeLabels[type]?.label || type,
        count,
        color: assetTypeLabels[type]?.color || '#1890ff',
      }))
      
      setAssetDistribution(chartData)
    } catch (error) {
      console.error('Failed to fetch asset distribution:', error)
    }
  }

  // 资产类型分布饼图（真实数据）
  const getAssetDistributionOption = () => {
    return {
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c}个 ({d}%)'
      },
      legend: {
        bottom: 0,
        left: 'center',
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
            borderWidth: 2
          },
          label: {
            show: true,
            formatter: '{c}个'
          },
          data: assetDistribution.map(item => ({
            value: item.count,
            name: item.label,
            itemStyle: { color: item.color }
          }))
        }
      ]
    }
  }

  // 募资进度条形图（真实数据）
  const getFundingProgressOption = () => {
    const topAssets = featuredAssets.slice(0, 5)
    
    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        formatter: (params: any) => {
          const data = params[0]
          return `${data.name}<br/>募资进度: ${data.value}%`
        }
      },
      grid: {
        left: '3%',
        right: '10%',
        bottom: '3%',
        containLabel: true,
      },
      xAxis: {
        type: 'value',
        max: 100,
        axisLabel: { formatter: '{value}%' }
      },
      yAxis: {
        type: 'category',
        data: topAssets.map(a => a.title.substring(0, 12) + (a.title.length > 12 ? '...' : '')),
        axisLabel: { 
          width: 100,
          overflow: 'truncate'
        }
      },
      series: [
        {
          name: '募资进度',
          type: 'bar',
          data: topAssets.map(a => ({
            value: Math.round((a.raisedAmount / a.targetAmount) * 100),
            itemStyle: {
              color: a.raisedAmount / a.targetAmount >= 0.8 ? '#52c41a' : 
                     a.raisedAmount / a.targetAmount >= 0.5 ? '#faad14' : '#1890ff'
            }
          })),
          barWidth: '60%',
          label: {
            show: true,
            position: 'right',
            formatter: '{c}%'
          }
        }
      ]
    }
  }

  if (loading) {
    return (
      <div className="loading-container">
        <Spin size="large" />
      </div>
    )
  }

  return (
    <div className="dashboard-container">
      <h1 className="page-title">首页仪表板</h1>

      {/* KPI 指标卡片 */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="总资产规模"
              value={kpiData?.totalAssets || 0}
              precision={0}
              prefix={<DollarOutlined />}
              suffix="元"
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="投资人数量"
              value={kpiData?.totalInvestors || 0}
              prefix={<ShoppingOutlined />}
              suffix="人"
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="在线项目"
              value={kpiData?.totalProjects || 0}
              prefix={<TransactionOutlined />}
              suffix="个"
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="平均投资回报率"
              value={kpiData?.avgReturn || 0}
              precision={2}
              prefix={<RiseOutlined />}
              suffix="%"
              valueStyle={{
                color: (kpiData?.avgReturn || 0) >= 15 ? '#3f8600' : 
                       (kpiData?.avgReturn || 0) >= 10 ? '#1890ff' : '#faad14',
              }}
            />
          </Card>
        </Col>
      </Row>

      {/* 动态图表 */}
      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col xs={24} lg={16}>
          <Card title="热门项目募资进度">
            {featuredAssets.length > 0 ? (
              <ReactECharts option={getFundingProgressOption()} style={{ height: 350 }} />
            ) : (
              <div style={{ textAlign: 'center', padding: '100px 0', color: '#999' }}>
                暂无募资中的项目
              </div>
            )}
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card title="市场资产分布">
            {assetDistribution.length > 0 ? (
              <ReactECharts option={getAssetDistributionOption()} style={{ height: 350 }} />
            ) : (
              <div style={{ textAlign: 'center', padding: '100px 0', color: '#999' }}>
                暂无资产数据
              </div>
            )}
          </Card>
        </Col>
      </Row>

      {/* 推荐资产列表 */}
      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col span={24}>
          <Card 
            title={<><FireOutlined style={{ color: '#ff4d4f' }} /> 热门投资机会</>}
            extra={<a onClick={() => navigate('/marketplace')}>查看更多</a>}
          >
            <List
              grid={{ gutter: 16, xs: 1, sm: 2, md: 2, lg: 4, xl: 4, xxl: 4 }}
              dataSource={featuredAssets.slice(0, 4)}
              renderItem={(asset) => (
                <List.Item>
                  <Card 
                    hoverable 
                    size="small"
                    onClick={() => navigate(`/asset/${asset.id}`)}
                  >
                    <div style={{ marginBottom: 8 }}>
                      <Tag color={assetTypeLabels[asset.type]?.color || 'blue'}>
                        {assetTypeLabels[asset.type]?.label || asset.type}
                      </Tag>
                    </div>
                    <div style={{ fontWeight: 600, marginBottom: 8, fontSize: 14 }}>
                      {asset.title.length > 18 ? asset.title.substring(0, 18) + '...' : asset.title}
                    </div>
                    <div style={{ marginBottom: 8 }}>
                      <span style={{ color: '#999', fontSize: 12 }}>目标金额：</span>
                      <span style={{ color: '#1890ff', fontWeight: 600 }}>
                        ¥{(asset.targetAmount / 10000).toFixed(0)}万
                      </span>
                    </div>
                    <Progress 
                      percent={Math.round((asset.raisedAmount / asset.targetAmount) * 100)} 
                      size="small"
                      status={asset.raisedAmount >= asset.targetAmount ? 'success' : 'active'}
                    />
                  </Card>
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default Dashboard
