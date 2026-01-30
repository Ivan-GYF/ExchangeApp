import { Switch, Button, message, TimePicker, Form } from 'antd'
import { BellOutlined, MailOutlined, MessageOutlined, MobileOutlined } from '@ant-design/icons'
import { useState } from 'react'
import dayjs from 'dayjs'

interface NotificationSettings {
  email: boolean
  sms: boolean
  inApp: boolean
  wechat: boolean
  investmentOpportunity: boolean
  positionChange: boolean
  dividendNotice: boolean
  projectUpdate: boolean
  riskWarning: boolean
  platformAnnouncement: boolean
}

const Notifications = () => {
  const [settings, setSettings] = useState<NotificationSettings>({
    email: true,
    sms: true,
    inApp: true,
    wechat: false,
    investmentOpportunity: true,
    positionChange: true,
    dividendNotice: true,
    projectUpdate: true,
    riskWarning: true,
    platformAnnouncement: false,
  })
  const [doNotDisturbStart, setDoNotDisturbStart] = useState(dayjs('22:00', 'HH:mm'))
  const [doNotDisturbEnd, setDoNotDisturbEnd] = useState(dayjs('08:00', 'HH:mm'))

  const handleToggle = (key: keyof NotificationSettings) => {
    setSettings({
      ...settings,
      [key]: !settings[key],
    })
  }

  const handleSave = async () => {
    try {
      // TODO: 调用API保存通知设置
      await new Promise(resolve => setTimeout(resolve, 500))
      message.success('通知偏好设置已保存')
    } catch (error) {
      message.error('保存失败，请重试')
    }
  }

  return (
    <div className="settings-content">
      <div className="settings-section">
        <h3 className="section-title">
          <BellOutlined /> 通知渠道
        </h3>
        <p className="section-description">
          选择接收通知的方式
        </p>

        <div className="notification-item">
          <div className="notification-label">
            <h4><MailOutlined /> 邮件通知</h4>
            <p>通过邮件接收重要通知和更新</p>
          </div>
          <Switch 
            checked={settings.email} 
            onChange={() => handleToggle('email')}
          />
        </div>

        <div className="notification-item">
          <div className="notification-label">
            <h4><MessageOutlined /> 短信通知</h4>
            <p>通过短信接收重要操作验证和提醒</p>
          </div>
          <Switch 
            checked={settings.sms} 
            onChange={() => handleToggle('sms')}
          />
        </div>

        <div className="notification-item">
          <div className="notification-label">
            <h4><BellOutlined /> 站内消息</h4>
            <p>在平台内接收消息通知</p>
          </div>
          <Switch 
            checked={settings.inApp} 
            onChange={() => handleToggle('inApp')}
          />
        </div>

        <div className="notification-item">
          <div className="notification-label">
            <h4><MobileOutlined /> 微信推送</h4>
            <p>通过微信服务号接收通知（需绑定）</p>
          </div>
          <Switch 
            checked={settings.wechat} 
            onChange={() => handleToggle('wechat')}
            disabled
          />
        </div>
      </div>

      <div className="settings-section">
        <h3 className="section-title">通知内容</h3>
        <p className="section-description">
          选择希望接收的通知类型
        </p>

        <div className="notification-item">
          <div className="notification-label">
            <h4>💰 投资机会推送</h4>
            <p>新的投资项目和机会推荐</p>
          </div>
          <Switch 
            checked={settings.investmentOpportunity} 
            onChange={() => handleToggle('investmentOpportunity')}
          />
        </div>

        <div className="notification-item">
          <div className="notification-label">
            <h4>📊 持仓变动提醒</h4>
            <p>投资组合的重要变动通知</p>
          </div>
          <Switch 
            checked={settings.positionChange} 
            onChange={() => handleToggle('positionChange')}
          />
        </div>

        <div className="notification-item">
          <div className="notification-label">
            <h4>💸 分红到账通知</h4>
            <p>收益分红和资金到账提醒</p>
          </div>
          <Switch 
            checked={settings.dividendNotice} 
            onChange={() => handleToggle('dividendNotice')}
          />
        </div>

        <div className="notification-item">
          <div className="notification-label">
            <h4>📈 项目进度更新</h4>
            <p>已投资项目的进展情况通知</p>
          </div>
          <Switch 
            checked={settings.projectUpdate} 
            onChange={() => handleToggle('projectUpdate')}
          />
        </div>

        <div className="notification-item">
          <div className="notification-label">
            <h4>⚠️ 风险预警提醒</h4>
            <p>项目风险和市场风险预警（强烈建议开启）</p>
          </div>
          <Switch 
            checked={settings.riskWarning} 
            onChange={() => handleToggle('riskWarning')}
          />
        </div>

        <div className="notification-item">
          <div className="notification-label">
            <h4>📰 平台公告/活动</h4>
            <p>平台重要公告和营销活动信息</p>
          </div>
          <Switch 
            checked={settings.platformAnnouncement} 
            onChange={() => handleToggle('platformAnnouncement')}
          />
        </div>
      </div>

      <div className="settings-section">
        <h3 className="section-title">免打扰时段</h3>
        <p className="section-description">
          设置免打扰时间，期间不会收到非紧急通知（风险预警除外）
        </p>

        <Form layout="inline" style={{ marginTop: 16 }}>
          <Form.Item label="开始时间">
            <TimePicker 
              value={doNotDisturbStart}
              format="HH:mm"
              onChange={(time) => time && setDoNotDisturbStart(time)}
            />
          </Form.Item>
          <Form.Item label="结束时间">
            <TimePicker 
              value={doNotDisturbEnd}
              format="HH:mm"
              onChange={(time) => time && setDoNotDisturbEnd(time)}
            />
          </Form.Item>
        </Form>
      </div>

      <div className="form-actions">
        <Button type="primary" onClick={handleSave}>
          保存设置
        </Button>
      </div>
    </div>
  )
}

export default Notifications
