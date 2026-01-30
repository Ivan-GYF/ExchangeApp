import { useState } from 'react'
import { Tabs, Card } from 'antd'
import { 
  UserOutlined, 
  BankOutlined, 
  LockOutlined, 
  BellOutlined, 
  HeartOutlined, 
  SafetyOutlined,
  FileTextOutlined 
} from '@ant-design/icons'
import BasicInfo from './components/BasicInfo'
import BankAccount from './components/BankAccount'
import Security from './components/Security'
import Notifications from './components/Notifications'
import InvestmentPreference from './components/InvestmentPreference'
import TwoFactorAuth from './components/TwoFactorAuth'
import Statements from './components/Statements'
import './Settings.css'

const Settings = () => {
  const [activeTab, setActiveTab] = useState('basic')

  const items = [
    {
      key: 'basic',
      label: (
        <span>
          <UserOutlined />
          基本信息
        </span>
      ),
      children: <BasicInfo />,
    },
    {
      key: 'bank',
      label: (
        <span>
          <BankOutlined />
          银行账户
        </span>
      ),
      children: <BankAccount />,
    },
    {
      key: 'security',
      label: (
        <span>
          <LockOutlined />
          安全设置
        </span>
      ),
      children: <Security />,
    },
    {
      key: 'notifications',
      label: (
        <span>
          <BellOutlined />
          通知偏好
        </span>
      ),
      children: <Notifications />,
    },
    {
      key: 'investment',
      label: (
        <span>
          <HeartOutlined />
          投资偏好
        </span>
      ),
      children: <InvestmentPreference />,
    },
    {
      key: '2fa',
      label: (
        <span>
          <SafetyOutlined />
          双重验证
        </span>
      ),
      children: <TwoFactorAuth />,
    },
    {
      key: 'statements',
      label: (
        <span>
          <FileTextOutlined />
          对账单
        </span>
      ),
      children: <Statements />,
    },
  ]

  return (
    <div className="settings-container">
      <h1 className="page-title">偏好设置</h1>
      <Card className="settings-card">
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={items}
          tabPosition="left"
          className="settings-tabs"
        />
      </Card>
    </div>
  )
}

export default Settings
