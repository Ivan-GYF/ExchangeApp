import { useEffect, useState } from 'react'
import { Row, Col, Card, Statistic, Spin } from 'antd'
import {
  DollarOutlined,
  ShoppingOutlined,
  TransactionOutlined,
  RiseOutlined,
} from '@ant-design/icons'
import ReactECharts from 'echarts-for-react'
import { apiClient } from '@/services/api'
import './Dashboard.css'

interface KPIData {
  totalInvestment: number
  activeOpportunities: number
  matchedTransactions: number
  portfolioReturn: number
}

const Dashboard = () => {
  const [kpiData, setKpiData] = useState<KPIData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchKPIData()
  }, [])

  const fetchKPIData = async () => {
    try {
      const data = await apiClient.get<KPIData>('/dashboard/kpi')
      setKpiData(data)
    } catch (error) {
      console.error('Failed to fetch KPI data:', error)
    } finally {
      setLoading(false)
    }
  }

  // 模拟趋势数据（实际应该从后端获取）
  const getTrendChartOption = () => {
    const months = ['1月', '2月', '3月', '4月', '5月', '6月']

    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
        },
      },
      legend: {
        data: ['轻资产赛道', '抖音投流', '天猫校园', '演唱会门票'],
        bottom: 0,
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '15%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: months,
      },
      yAxis: {
        type: 'value',
        name: '回报率 (%)',
      },
      series: [
        {
          name: '轻资产赛道',
          type: 'line',
          smooth: true,
          data: [8, 9, 10, 11, 11.5, 12],
          itemStyle: { color: '#91d5ff' },
          areaStyle: { opacity: 0.3 },
        },
        {
          name: '抖音投流',
          type: 'line',
          smooth: true,
          data: [12, 14, 16, 17, 18, 19],
          itemStyle: { color: '#95de64' },
          areaStyle: { opacity: 0.3 },
        },
        {
          name: '天猫校园',
          type: 'line',
          smooth: true,
          data: [7, 7.5, 8, 9, 10, 11],
          itemStyle: { color: '#ffd591' },
          areaStyle: { opacity: 0.3 },
        },
        {
          name: '演唱会门票',
          type: 'line',
          smooth: true,
          data: [10, 11, 13, 14, 15, 16],
          itemStyle: { color: '#ffa39e' },
          areaStyle: { opacity: 0.3 },
        },
      ],
    }
  }

  // 资产类型分布柱状图
  const getAssetDistributionOption = () => {
    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        data: ['轻资产赛道', '抖音投流', '天猫校园', '演唱会门票'],
      },
      yAxis: {
        type: 'value',
        name: '项目数量',
      },
      series: [
        {
          name: '项目数量',
          type: 'bar',
          data: [
            { value: 2, itemStyle: { color: '#91d5ff' } },
            { value: 2, itemStyle: { color: '#95de64' } },
            { value: 2, itemStyle: { color: '#ffd591' } },
            { value: 2, itemStyle: { color: '#ffa39e' } },
          ],
          barWidth: '60%',
        },
      ],
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
              title="总投资额"
              value={kpiData?.totalInvestment || 0}
              precision={2}
              prefix={<DollarOutlined />}
              suffix="元"
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="活跃机会"
              value={kpiData?.activeOpportunities || 0}
              prefix={<ShoppingOutlined />}
              suffix="个"
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="匹配交易"
              value={kpiData?.matchedTransactions || 0}
              prefix={<TransactionOutlined />}
              suffix="笔"
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="投资组合回报"
              value={kpiData?.portfolioReturn || 0}
              precision={2}
              prefix={<RiseOutlined />}
              suffix="%"
              valueStyle={{
                color: (kpiData?.portfolioReturn || 0) >= 0 ? '#cf1322' : '#3f8600',
              }}
            />
          </Card>
        </Col>
      </Row>

      {/* 趋势图表 */}
      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col xs={24} lg={16}>
          <Card title="各类资产回报率趋势">
            <ReactECharts option={getTrendChartOption()} style={{ height: 350 }} />
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card title="市场资产分布">
            <ReactECharts option={getAssetDistributionOption()} style={{ height: 350 }} />
          </Card>
        </Col>
      </Row>

      {/* 欢迎信息 */}
      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col span={24}>
          <Card title="欢迎使用 Marketplace Exchange Platform">
            <p>这是一个基于"中央厨房"模式的投资资产交易平台。</p>
            <h3>四大投资类型：</h3>
            <ul>
              <li>🏁 <strong>轻资产赛道收入分成</strong> - 赛车场馆运营收益权，稳定现金流</li>
              <li>📱 <strong>抖音投流收入分成</strong> - KOL/品牌广告收益，高回报高波动</li>
              <li>🏫 <strong>天猫校园设施收入分成</strong> - 高校便利店/服务设施，低风险稳定</li>
              <li>🎤 <strong>演唱会门票收入分成</strong> - 巡演票务收益权，依赖艺人影响力</li>
            </ul>
            <p style={{ marginTop: 16 }}>
              您可以通过左侧菜单访问<strong>市场浏览器</strong>查看可投资资产，
              在<strong>投资组合</strong>中管理您的投资，
              或使用<strong>匹配工作台</strong>获取AI智能推荐。
            </p>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default Dashboard
