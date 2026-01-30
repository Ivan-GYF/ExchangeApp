import { Form, Input, Button, message, Modal } from 'antd'
import { LockOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons'
import { useState } from 'react'

const Security = () => {
  const [passwordForm] = Form.useForm()
  const [contactForm] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false)
  const [verifyForm] = Form.useForm()

  const handlePasswordChange = async (values: any) => {
    if (values.newPassword !== values.confirmPassword) {
      message.error('两次输入的新密码不一致')
      return
    }

    setLoading(true)
    try {
      // TODO: 调用API修改密码
      await new Promise(resolve => setTimeout(resolve, 1000))
      message.success('密码修改成功，请重新登录')
      passwordForm.resetFields()
    } catch (error) {
      message.error('密码修改失败，请检查原密码是否正确')
    } finally {
      setLoading(false)
    }
  }

  const handleContactUpdate = async (values: any) => {
    // 先进行身份验证
    setIsVerifyModalOpen(true)
  }

  const handleVerifySubmit = async (values: any) => {
    setLoading(true)
    try {
      // TODO: 调用API验证验证码
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // 验证通过后更新联系方式
      const contactValues = contactForm.getFieldsValue()
      // TODO: 调用API更新联系方式
      
      message.success('联系方式更新成功')
      setIsVerifyModalOpen(false)
      verifyForm.resetFields()
    } catch (error) {
      message.error('验证失败，请重试')
    } finally {
      setLoading(false)
    }
  }

  const sendVerificationCode = async (type: 'email' | 'phone') => {
    try {
      // TODO: 调用API发送验证码
      await new Promise(resolve => setTimeout(resolve, 500))
      message.success(`验证码已发送至您的${type === 'email' ? '邮箱' : '手机'}`)
    } catch (error) {
      message.error('发送失败，请重试')
    }
  }

  return (
    <div className="settings-content">
      <div className="settings-section">
        <h3 className="section-title">
          <LockOutlined /> 修改登录密码
        </h3>
        <p className="section-description">
          为了账户安全，请定期更换密码。密码长度至少8位，需包含字母和数字。
        </p>
        <Form
          form={passwordForm}
          layout="vertical"
          onFinish={handlePasswordChange}
          style={{ maxWidth: 400 }}
        >
          <Form.Item
            label="原密码"
            name="oldPassword"
            rules={[{ required: true, message: '请输入原密码' }]}
          >
            <Input.Password 
              prefix={<LockOutlined />}
              placeholder="请输入原密码" 
            />
          </Form.Item>

          <Form.Item
            label="新密码"
            name="newPassword"
            rules={[
              { required: true, message: '请输入新密码' },
              { min: 8, message: '密码长度至少8位' },
              { pattern: /^(?=.*[A-Za-z])(?=.*\d)/, message: '密码必须包含字母和数字' },
            ]}
          >
            <Input.Password 
              prefix={<LockOutlined />}
              placeholder="请输入新密码（至少8位，包含字母和数字）" 
            />
          </Form.Item>

          <Form.Item
            label="确认新密码"
            name="confirmPassword"
            rules={[{ required: true, message: '请再次输入新密码' }]}
          >
            <Input.Password 
              prefix={<LockOutlined />}
              placeholder="请再次输入新密码" 
            />
          </Form.Item>

          <Button type="primary" htmlType="submit" loading={loading}>
            修改密码
          </Button>
        </Form>
      </div>

      <div className="settings-section">
        <h3 className="section-title">
          <PhoneOutlined /> 联系方式更新
        </h3>
        <p className="section-description">
          更新联系方式需要通过原手机号或邮箱进行身份验证
        </p>
        <Form
          form={contactForm}
          layout="vertical"
          onFinish={handleContactUpdate}
          style={{ maxWidth: 400 }}
        >
          <Form.Item
            label="主手机号"
            name="primaryPhone"
            rules={[
              { required: true, message: '请输入手机号' },
              { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号' },
            ]}
          >
            <Input 
              prefix={<PhoneOutlined />}
              placeholder="请输入手机号" 
            />
          </Form.Item>

          <Form.Item
            label="备用手机号"
            name="backupPhone"
            rules={[
              { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号' },
            ]}
          >
            <Input 
              prefix={<PhoneOutlined />}
              placeholder="请输入备用手机号（可选）" 
            />
          </Form.Item>

          <Form.Item
            label="主邮箱"
            name="primaryEmail"
            rules={[
              { required: true, message: '请输入邮箱' },
              { type: 'email', message: '请输入有效的邮箱地址' },
            ]}
          >
            <Input 
              prefix={<MailOutlined />}
              placeholder="请输入邮箱地址" 
            />
          </Form.Item>

          <Form.Item
            label="备用邮箱"
            name="backupEmail"
            rules={[
              { type: 'email', message: '请输入有效的邮箱地址' },
            ]}
          >
            <Input 
              prefix={<MailOutlined />}
              placeholder="请输入备用邮箱（可选）" 
            />
          </Form.Item>

          <Button type="primary" htmlType="submit">
            更新联系方式
          </Button>
        </Form>
      </div>

      <Modal
        title="身份验证"
        open={isVerifyModalOpen}
        onCancel={() => setIsVerifyModalOpen(false)}
        footer={null}
      >
        <p style={{ marginBottom: 16, color: 'rgba(0,0,0,0.65)' }}>
          为了保护您的账户安全，请完成身份验证
        </p>
        <Form
          form={verifyForm}
          layout="vertical"
          onFinish={handleVerifySubmit}
        >
          <Form.Item
            label="验证方式"
            name="verifyMethod"
            initialValue="phone"
            rules={[{ required: true }]}
          >
            <Input.Group compact>
              <Button 
                onClick={() => sendVerificationCode('phone')}
                style={{ marginRight: 8 }}
              >
                发送短信验证码
              </Button>
              <Button onClick={() => sendVerificationCode('email')}>
                发送邮箱验证码
              </Button>
            </Input.Group>
          </Form.Item>

          <Form.Item
            label="验证码"
            name="verifyCode"
            rules={[{ required: true, message: '请输入验证码' }]}
          >
            <Input placeholder="请输入6位验证码" maxLength={6} />
          </Form.Item>

          <div className="form-actions">
            <Button type="primary" htmlType="submit" loading={loading}>
              确认
            </Button>
            <Button onClick={() => setIsVerifyModalOpen(false)}>
              取消
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  )
}

export default Security
