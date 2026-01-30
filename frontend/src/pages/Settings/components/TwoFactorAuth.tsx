import { useState } from 'react'
import { Button, Switch, message, Modal, Form, Input, Steps, QRCode } from 'antd'
import { SafetyOutlined, MobileOutlined, MailOutlined, QrcodeOutlined } from '@ant-design/icons'

const TwoFactorAuth = () => {
  const [smsEnabled, setSmsEnabled] = useState(true)
  const [emailEnabled, setEmailEnabled] = useState(true)
  const [totpEnabled, setTotpEnabled] = useState(false)
  const [isSetupModalOpen, setIsSetupModalOpen] = useState(false)
  const [setupStep, setSetupStep] = useState(0)
  const [form] = Form.useForm()
  const [secret] = useState('JBSWY3DPEHPK3PXP') // Mock secret

  const handleSmsToggle = async (checked: boolean) => {
    try {
      // TODO: 调用API
      await new Promise(resolve => setTimeout(resolve, 500))
      setSmsEnabled(checked)
      message.success(checked ? '短信验证已开启' : '短信验证已关闭')
    } catch (error) {
      message.error('操作失败，请重试')
    }
  }

  const handleEmailToggle = async (checked: boolean) => {
    try {
      // TODO: 调用API
      await new Promise(resolve => setTimeout(resolve, 500))
      setEmailEnabled(checked)
      message.success(checked ? '邮箱验证已开启' : '邮箱验证已关闭')
    } catch (error) {
      message.error('操作失败，请重试')
    }
  }

  const handleTotpSetup = () => {
    setSetupStep(0)
    setIsSetupModalOpen(true)
  }

  const handleTotpVerify = async (values: any) => {
    try {
      // TODO: 调用API验证TOTP
      await new Promise(resolve => setTimeout(resolve, 500))
      setTotpEnabled(true)
      setIsSetupModalOpen(false)
      message.success('Google Authenticator 已成功绑定')
    } catch (error) {
      message.error('验证码错误，请重试')
    }
  }

  const handleTotpDisable = async () => {
    try {
      // TODO: 调用API
      await new Promise(resolve => setTimeout(resolve, 500))
      setTotpEnabled(false)
      message.success('Google Authenticator 已解绑')
    } catch (error) {
      message.error('操作失败，请重试')
    }
  }

  return (
    <div className="settings-content">
      <div className="settings-section">
        <h3 className="section-title">
          <SafetyOutlined /> 双重验证
        </h3>
        <p className="section-description">
          启用双重验证可大幅提升账户安全性。在登录或进行敏感操作时，除密码外还需要提供第二重验证。
        </p>
      </div>

      <div className="settings-section">
        <div className="notification-item">
          <div className="notification-label">
            <h4><MobileOutlined /> 短信验证</h4>
            <p>通过短信接收验证码（推荐开启）</p>
          </div>
          <Switch 
            checked={smsEnabled} 
            onChange={handleSmsToggle}
          />
        </div>

        <div className="notification-item">
          <div className="notification-label">
            <h4><MailOutlined /> 邮箱验证</h4>
            <p>通过邮箱接收验证码（推荐开启）</p>
          </div>
          <Switch 
            checked={emailEnabled} 
            onChange={handleEmailToggle}
          />
        </div>

        <div className="notification-item">
          <div className="notification-label">
            <h4><QrcodeOutlined /> Google Authenticator</h4>
            <p>使用 Google Authenticator 或其他 TOTP 应用生成验证码（最安全）</p>
            {totpEnabled && (
              <p style={{ color: '#52c41a', marginTop: 4 }}>
                ✓ 已绑定
              </p>
            )}
          </div>
          {!totpEnabled ? (
            <Button type="primary" onClick={handleTotpSetup}>
              立即绑定
            </Button>
          ) : (
            <Button danger onClick={handleTotpDisable}>
              解绑
            </Button>
          )}
        </div>
      </div>

      <div className="settings-section">
        <h3 className="section-title">验证触发场景</h3>
        <p className="section-description">
          以下操作将需要进行双重验证：
        </p>
        <ul style={{ paddingLeft: 24, lineHeight: 2 }}>
          <li>登录账户</li>
          <li>修改密码</li>
          <li>绑定/解绑银行卡</li>
          <li>大额出金（单笔超过10万）</li>
          <li>修改联系方式</li>
          <li>关闭双重验证</li>
        </ul>
      </div>

      <Modal
        title="绑定 Google Authenticator"
        open={isSetupModalOpen}
        onCancel={() => setIsSetupModalOpen(false)}
        footer={null}
        width={600}
      >
        <Steps
          current={setupStep}
          items={[
            { title: '扫描二维码' },
            { title: '验证绑定' },
          ]}
          style={{ marginBottom: 24 }}
        />

        {setupStep === 0 && (
          <div>
            <p style={{ marginBottom: 16 }}>
              1. 在手机上下载并安装 Google Authenticator 或其他 TOTP 应用
            </p>
            <p style={{ marginBottom: 16 }}>
              2. 打开应用，扫描下方二维码
            </p>

            <div className="qr-code-container">
              <QRCode
                value={`otpauth://totp/LakesideExchange:user@example.com?secret=${secret}&issuer=LakesideExchange`}
                size={200}
              />
              <p style={{ marginTop: 16, color: 'rgba(0,0,0,0.45)' }}>
                无法扫码？手动输入密钥：<br />
                <code style={{ 
                  background: '#f5f5f5', 
                  padding: '4px 8px', 
                  borderRadius: 4,
                  fontSize: 14,
                }}>{secret}</code>
              </p>
            </div>

            <div style={{ textAlign: 'center', marginTop: 24 }}>
              <Button type="primary" onClick={() => setSetupStep(1)}>
                下一步
              </Button>
            </div>
          </div>
        )}

        {setupStep === 1 && (
          <div>
            <p style={{ marginBottom: 16 }}>
              请输入 Google Authenticator 中显示的6位验证码
            </p>

            <Form
              form={form}
              onFinish={handleTotpVerify}
              layout="vertical"
            >
              <Form.Item
                name="code"
                rules={[
                  { required: true, message: '请输入验证码' },
                  { pattern: /^\d{6}$/, message: '请输入6位数字验证码' },
                ]}
              >
                <Input 
                  placeholder="请输入6位验证码" 
                  maxLength={6}
                  style={{ fontSize: 24, letterSpacing: 8, textAlign: 'center' }}
                />
              </Form.Item>

              <div className="form-actions" style={{ justifyContent: 'center' }}>
                <Button onClick={() => setSetupStep(0)}>
                  上一步
                </Button>
                <Button type="primary" htmlType="submit">
                  完成绑定
                </Button>
              </div>
            </Form>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default TwoFactorAuth
