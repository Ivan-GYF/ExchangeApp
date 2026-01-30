import { useState } from 'react'
import { Button, Radio, Slider, Tag, message, Progress, Card } from 'antd'
import { HeartOutlined, CheckCircleOutlined } from '@ant-design/icons'
import type { RadioChangeEvent } from 'antd'

const InvestmentPreference = () => {
  const [riskLevel, setRiskLevel] = useState<string>('balanced')
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>(['CONCERT_TICKET', 'CAMPUS_FACILITY'])
  const [investmentRange, setInvestmentRange] = useState<[number, number]>([50, 500])
  const [periodPreference, setPeriodPreference] = useState<string>('medium')
  const [expectedReturn, setExpectedReturn] = useState<number>(15)
  const [enableAI, setEnableAI] = useState(true)
  const [isAssessing, setIsAssessing] = useState(false)

  const industries = [
    { key: 'CONCERT_TICKET', label: '演唱会/娱乐', icon: '🎤' },
    { key: 'RACING_TRACK', label: '赛车场/体育', icon: '🏎️' },
    { key: 'CAMPUS_FACILITY', label: '校园设施', icon: '🏫' },
    { key: 'STREAMING', label: '新媒体流量', icon: '📱' },
    { key: 'SUPPLY_CHAIN_FINANCE', label: '供应链金融', icon: '💼' },
    { key: 'REAL_ESTATE', label: '房地产', icon: '🏢' },
    { key: 'TECHNOLOGY', label: '科技创新', icon: '💻' },
    { key: 'HEALTHCARE', label: '医疗健康', icon: '⚕️' },
  ]

  const riskLevelOptions = [
    { value: 'conservative', label: '保守型', description: '追求资金安全，接受较低收益', color: '#52c41a' },
    { value: 'stable', label: '稳健型', description: '平衡风险与收益，偏向稳定', color: '#1890ff' },
    { value: 'balanced', label: '平衡型', description: '风险收益适度平衡', color: '#722ed1' },
    { value: 'aggressive', label: '进取型', description: '追求较高收益，可承受较高风险', color: '#fa8c16' },
    { value: 'radical', label: '激进型', description: '追求高收益，愿意承担高风险', color: '#ff4d4f' },
  ]

  const handleIndustryToggle = (key: string) => {
    if (selectedIndustries.includes(key)) {
      setSelectedIndustries(selectedIndustries.filter(k => k !== key))
    } else {
      setSelectedIndustries([...selectedIndustries, key])
    }
  }

  const handleStartAssessment = () => {
    setIsAssessing(true)
    // TODO: 跳转到风险评估问卷
    message.info('风险评估功能开发中')
  }

  const handleSave = async () => {
    try {
      // TODO: 调用API保存投资偏好
      await new Promise(resolve => setTimeout(resolve, 500))
      message.success('投资偏好设置已保存')
    } catch (error) {
      message.error('保存失败，请重试')
    }
  }

  const currentRiskOption = riskLevelOptions.find(opt => opt.value === riskLevel)

  return (
    <div className="settings-content">
      <div className="settings-section">
        <h3 className="section-title">
          <HeartOutlined /> 风险承受能力
        </h3>
        <p className="section-description">
          了解您的风险承受能力，帮助我们为您推荐合适的投资项目
        </p>

        <Card className="risk-assessment-card">
          <div className="risk-level">
            <div className="risk-level-value" style={{ color: currentRiskOption?.color }}>
              {currentRiskOption?.label}
            </div>
            <div className="risk-level-label">
              {currentRiskOption?.description}
            </div>
            <Progress 
              percent={riskLevelOptions.findIndex(opt => opt.value === riskLevel) * 25} 
              strokeColor={currentRiskOption?.color}
              showInfo={false}
              style={{ marginTop: 16 }}
            />
          </div>

          <Radio.Group 
            value={riskLevel} 
            onChange={(e: RadioChangeEvent) => setRiskLevel(e.target.value)}
            style={{ width: '100%' }}
          >
            {riskLevelOptions.map(option => (
              <Radio.Button 
                key={option.value} 
                value={option.value}
                style={{ 
                  width: '20%', 
                  textAlign: 'center',
                  marginBottom: 8,
                }}
              >
                {option.label}
              </Radio.Button>
            ))}
          </Radio.Group>

          <Button 
            type="link" 
            icon={<CheckCircleOutlined />}
            onClick={handleStartAssessment}
            style={{ marginTop: 16 }}
          >
            重新进行风险评估
          </Button>
        </Card>
      </div>

      <div className="settings-section">
        <h3 className="section-title">关注的行业类别</h3>
        <p className="section-description">
          选择您感兴趣的投资领域，我们会优先为您推荐相关项目
        </p>

        <div className="preference-tags">
          {industries.map(industry => (
            <Tag.CheckableTag
              key={industry.key}
              checked={selectedIndustries.includes(industry.key)}
              onChange={() => handleIndustryToggle(industry.key)}
              style={{ 
                padding: '8px 16px',
                fontSize: 14,
                borderRadius: 6,
              }}
            >
              {industry.icon} {industry.label}
            </Tag.CheckableTag>
          ))}
        </div>
      </div>

      <div className="settings-section">
        <h3 className="section-title">投资金额区间（万元）</h3>
        <p className="section-description">
          设置单笔投资的金额范围
        </p>

        <Slider
          range
          min={10}
          max={1000}
          step={10}
          value={investmentRange}
          onChange={(value) => setInvestmentRange(value as [number, number])}
          marks={{
            10: '10万',
            250: '250万',
            500: '500万',
            750: '750万',
            1000: '1000万',
          }}
        />
        <div style={{ textAlign: 'center', marginTop: 16, fontSize: 16, fontWeight: 600 }}>
          {investmentRange[0]}万 - {investmentRange[1]}万
        </div>
      </div>

      <div className="settings-section">
        <h3 className="section-title">投资期限偏好</h3>
        <p className="section-description">
          选择您偏好的投资期限
        </p>

        <Radio.Group 
          value={periodPreference} 
          onChange={(e) => setPeriodPreference(e.target.value)}
          buttonStyle="solid"
        >
          <Radio.Button value="short">短期（6个月以内）</Radio.Button>
          <Radio.Button value="medium">中期（6-18个月）</Radio.Button>
          <Radio.Button value="long">长期（18个月以上）</Radio.Button>
          <Radio.Button value="any">不限</Radio.Button>
        </Radio.Group>
      </div>

      <div className="settings-section">
        <h3 className="section-title">预期年化收益率（%）</h3>
        <p className="section-description">
          设置您期望的最低年化收益率
        </p>

        <Slider
          min={0}
          max={40}
          step={1}
          value={expectedReturn}
          onChange={(value) => setExpectedReturn(value)}
          marks={{
            0: '0%',
            10: '10%',
            20: '20%',
            30: '30%',
            40: '40%',
          }}
        />
        <div style={{ textAlign: 'center', marginTop: 16, fontSize: 16, fontWeight: 600, color: '#ff4d4f' }}>
          {expectedReturn}%
        </div>
      </div>

      <div className="settings-section">
        <h3 className="section-title">智能推荐</h3>
        <p className="section-description">
          基于您的偏好和历史投资，AI智能为您推荐匹配的项目
        </p>

        <Radio.Group 
          value={enableAI} 
          onChange={(e) => setEnableAI(e.target.value)}
        >
          <Radio value={true}>开启智能推荐（推荐）</Radio>
          <Radio value={false}>关闭智能推荐</Radio>
        </Radio.Group>
      </div>

      <div className="form-actions">
        <Button type="primary" onClick={handleSave}>
          保存设置
        </Button>
      </div>
    </div>
  )
}

export default InvestmentPreference
