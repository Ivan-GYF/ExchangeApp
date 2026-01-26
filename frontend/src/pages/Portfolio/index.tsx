import { useEffect, useState } from 'react'
import { Card, Row, Col, Table, Tag, Statistic, Spin, Empty } from 'antd'
import { RiseOutlined, FallOutlined } from '@ant-design/icons'
import ReactECharts from 'echarts-for-react'
import { apiClient } from '@/services/api'
import { Investment, Milestone } from '@/types'
import './Portfolio.css'

const assetTypeLabels: Record<string, { label: string; color: string; icon: string }> = {
  MIFC_FUND_LP: { label: 'MIFC主基金LP', color: '#597ef7', icon: '💎' },
  MIFC_ABS: { label: 'MIFC ABS', color: '#13c2c2', icon: '🛡️' },
  CO_INVESTMENT: { label: '跟投项目', color: '#ff7a45', icon: '🤝' },
}

interface PortfolioStats {
  totalValue: number
  totalReturn: number
  distribution: Record<string, number>
  upcomingMilestones: Milestone[]
}

const Portfolio = () => {
  const [stats, setStats] = useState<PortfolioStats | null>(null)
  const [investments, setInvestments] = useState<Investment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPortfolioData()
  }, [])

  const fetchPortfolioData = async () => {
    try {
      const [statsData, investmentsData] = await Promise.all([
        apiClient.get<PortfolioStats>('/investments/portfolio/stats'),
        apiClient.get<{ investments: Investment[] }>('/investments/my'),
      ])

      setStats(statsData)
      setInvestments(investmentsData?.investments || [])
    } catch (error) {
      console.error('Failed to fetch portfolio data:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return `¥${(amount / 10000).toFixed(2)}万`
  }

  // 准备饼图数据
  const getPieChartOption = () => {
    if (!stats || !stats.distribution) return {}

    const data = Object.entries(stats.distribution).map(([type, percent]) => ({
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
            show: false,
            position: 'center',
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 20,
              fontWeight: 'bold',
            },
          },
          labelLine: {
            show: false,
          },
          data,
        },
      ],
    }
  }

  // 表格列定义
  const columns = [
    {
      title: '投资名称',
      dataIndex: ['asset', 'title'],
      key: 'title',
      render: (text: string, record: Investment) => (
        <div>
          <div style={{ fontWeight: 600 }}>{text}</div>
          {record.asset && (
            <Tag color={assetTypeLabels[record.asset.type]?.color} style={{ marginTop: 4 }}>
              {assetTypeLabels[record.asset.type]?.icon} {assetTypeLabels[record.asset.type]?.label}
            </Tag>
          )}
        </div>
      ),
    },
    {
      title: '投资金额',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number) => formatCurrency(amount),
    },
    {
      title: '当前价值',
      dataIndex: 'currentValue',
      key: 'currentValue',
      render: (value: number) => formatCurrency(value),
    },
    {
      title: '回报率',
      dataIndex: 'returnRate',
      key: 'returnRate',
      render: (rate: number) => (
        <span style={{ color: rate >= 0 ? '#52c41a' : '#ff4d4f', fontWeight: 600 }}>
          {rate >= 0 ? <RiseOutlined /> : <FallOutlined />} {rate.toFixed(2)}%
        </span>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const statusMap: Record<string, { label: string; color: string }> = {
          PENDING: { label: '待确认', color: 'default' },
          CONFIRMED: { label: '已确认', color: 'blue' },
          ACTIVE: { label: '收益中', color: 'green' },
          DISTRIBUTING: { label: '待分配', color: 'orange' },
          COMPLETED: { label: '已完成', color: 'default' },
          CANCELLED: { label: '已取消', color: 'red' },
        }
        const info = statusMap[status] || { label: status, color: 'default' }
        return <Tag color={info.color}>{info.label}</Tag>
      },
    },
    {
      title: 'P-Note编号',
      dataIndex: 'pNoteNumber',
      key: 'pNoteNumber',
    },
  ]

  if (loading) {
    return (
      <div className="loading-container">
        <Spin size="large" />
      </div>
    )
  }

  if (!stats || !investments || investments.length === 0) {
    return (
      <div className="portfolio-container">
        <h1 className="page-title">投资组合管理</h1>
        <Empty description="您还没有任何投资记录" />
      </div>
    )
  }

  return (
    <div className="portfolio-container">
      <h1 className="page-title">投资组合管理</h1>

      {/* KPI 统计 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12}>
          <Card>
            <Statistic
              title="组合总值"
              value={stats.totalValue}
              precision={2}
              prefix="¥"
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12}>
          <Card>
            <Statistic
              title="总回报率"
              value={stats.totalReturn}
              precision={2}
              suffix="%"
              prefix={stats.totalReturn >= 0 ? <RiseOutlined /> : <FallOutlined />}
              valueStyle={{ color: stats.totalReturn >= 0 ? '#cf1322' : '#3f8600' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        {/* 资产分布图 */}
        <Col xs={24} lg={12}>
          <Card title="资产类型分布">
            <ReactECharts option={getPieChartOption()} style={{ height: 300 }} />
          </Card>
        </Col>

        {/* 即将到来的里程碑 */}
        <Col xs={24} lg={12}>
          <Card title="即将到来的里程碑">
            {stats.upcomingMilestones && stats.upcomingMilestones.length > 0 ? (
              <div className="milestones-list">
                {stats.upcomingMilestones.map((milestone: any) => (
                  <div key={milestone.id} className="milestone-item">
                    <div className="milestone-date">
                      {new Date(milestone.dueDate).toLocaleDateString()}
                    </div>
                    <div className="milestone-content">
                      <div className="milestone-title">{milestone.title}</div>
                      <div className="milestone-asset">{milestone.asset?.title || milestone.description || ''}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <Empty description="暂无即将到来的里程碑" image={Empty.PRESENTED_IMAGE_SIMPLE} />
            )}
          </Card>
        </Col>
      </Row>

      {/* 持仓明细表 */}
      <Card title="持仓明细" style={{ marginTop: 24 }}>
        <Table
          columns={columns}
          dataSource={investments}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </Card>
    </div>
  )
}

export default Portfolio
