import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Form, Input, Button, Card, message, Tabs, Space, Divider } from 'antd'
import {
  UserOutlined,
  LockOutlined,
  MailOutlined,
  PhoneOutlined,
  BankOutlined,
  ProjectOutlined,
  CrownOutlined,
} from '@ant-design/icons'
import { useAuthStore } from '@/stores/authStore'
import { UserRole } from '@/types'
import './Login.css'

const Login = () => {
  const navigate = useNavigate()
  const { login, register, devLogin } = useAuthStore()
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('login')

  // 开发模式：快速登录（三种角色 + 额外投资人）
  const handleQuickLogin = (role: UserRole, userId?: string) => {
    devLogin(role, userId)
    
    const userNames: Record<string, string> = {
      'investor-inst-001': '投资人（水珠资本）',
      'investor-inst-004': '投资人（露珠资本）',
      [UserRole.PROJECT_OWNER]: '项目方（华娱传媒）',
      [UserRole.ADMIN]: '平台管理员',
    }
    
    const displayName = userId ? userNames[userId] : userNames[role]
    message.success(`开发模式：已以 ${displayName} 身份登录`)
    navigate('/')
  }

  const onLogin = async (values: any) => {
    setLoading(true)
    try {
      await login(values)
      message.success('登录成功！')
      navigate('/')
    } catch (error: any) {
      message.error(error.response?.data?.error?.message || '登录失败，请检查邮箱和密码')
    } finally {
      setLoading(false)
    }
  }

  const onRegister = async (values: any) => {
    setLoading(true)
    try {
      await register(values)
      message.success('注册成功！')
      navigate('/')
    } catch (error: any) {
      message.error(error.response?.data?.error?.message || '注册失败，请重试')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-container">
      <Card className="login-card" bordered={false}>
        <div className="login-header">
          <h1>Lakeshore Exchange 湖畔通市场</h1>
          <p>投资资产交易平台</p>
        </div>

        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          centered
          items={[
            {
              key: 'login',
              label: '登录',
              children: (
                <Form
                  name="login"
                  onFinish={onLogin}
                  autoComplete="off"
                  size="large"
                >
                  <Form.Item
                    name="email"
                    rules={[
                      { required: true, message: '请输入邮箱' },
                      { type: 'email', message: '请输入有效的邮箱地址' },
                    ]}
                  >
                    <Input
                      prefix={<MailOutlined />}
                      placeholder="邮箱"
                    />
                  </Form.Item>

                  <Form.Item
                    name="password"
                    rules={[{ required: true, message: '请输入密码' }]}
                  >
                    <Input.Password
                      prefix={<LockOutlined />}
                      placeholder="密码"
                    />
                  </Form.Item>

                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      loading={loading}
                      block
                    >
                      登录
                    </Button>
                  </Form.Item>
                </Form>
              ),
            },
            {
              key: 'register',
              label: '注册',
              children: (
                <Form
                  name="register"
                  onFinish={onRegister}
                  autoComplete="off"
                  size="large"
                >
                  <Form.Item
                    name="name"
                    rules={[{ required: true, message: '请输入姓名' }]}
                  >
                    <Input
                      prefix={<UserOutlined />}
                      placeholder="姓名"
                    />
                  </Form.Item>

                  <Form.Item
                    name="email"
                    rules={[
                      { required: true, message: '请输入邮箱' },
                      { type: 'email', message: '请输入有效的邮箱地址' },
                    ]}
                  >
                    <Input
                      prefix={<MailOutlined />}
                      placeholder="邮箱"
                    />
                  </Form.Item>

                  <Form.Item
                    name="phone"
                  >
                    <Input
                      prefix={<PhoneOutlined />}
                      placeholder="手机号（可选）"
                    />
                  </Form.Item>

                  <Form.Item
                    name="password"
                    rules={[
                      { required: true, message: '请输入密码' },
                      { min: 6, message: '密码至少6位' },
                    ]}
                  >
                    <Input.Password
                      prefix={<LockOutlined />}
                      placeholder="密码"
                    />
                  </Form.Item>

                  <Form.Item
                    name="confirmPassword"
                    dependencies={['password']}
                    rules={[
                      { required: true, message: '请确认密码' },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value || getFieldValue('password') === value) {
                            return Promise.resolve()
                          }
                          return Promise.reject(new Error('两次输入的密码不一致'))
                        },
                      }),
                    ]}
                  >
                    <Input.Password
                      prefix={<LockOutlined />}
                      placeholder="确认密码"
                    />
                  </Form.Item>

                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      loading={loading}
                      block
                    >
                      注册
                    </Button>
                  </Form.Item>
                </Form>
              ),
            },
          ]}
        />

        {/* 开发模式快速登录 */}
        <Divider style={{ margin: '24px 0' }}>开发模式快速登录</Divider>
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <Button
            block
            size="large"
            icon={<BankOutlined />}
            onClick={() => handleQuickLogin(UserRole.INVESTOR, 'investor-inst-001')}
            style={{
              borderColor: '#1890ff',
              color: '#1890ff',
            }}
          >
            投资人登录（水珠资本）
          </Button>
          
          <Button
            block
            size="large"
            icon={<BankOutlined />}
            onClick={() => handleQuickLogin(UserRole.INVESTOR, 'investor-inst-004')}
            style={{
              borderColor: '#13c2c2',
              color: '#13c2c2',
            }}
          >
            投资人登录（露珠资本）
          </Button>
          
          <Button
            block
            size="large"
            icon={<ProjectOutlined />}
            onClick={() => handleQuickLogin(UserRole.PROJECT_OWNER)}
            style={{
              borderColor: '#52c41a',
              color: '#52c41a',
            }}
          >
            项目方登录（华娱传媒）
          </Button>
          
          <Button
            block
            size="large"
            icon={<CrownOutlined />}
            onClick={() => handleQuickLogin(UserRole.ADMIN)}
            style={{
              borderColor: '#faad14',
              color: '#faad14',
            }}
          >
            管理员登录（湖畔通平台）
          </Button>
        </Space>
      </Card>
    </div>
  )
}

export default Login
