import { Form, Input, Button, message } from 'antd'
import { useAuthStore } from '@/stores/authStore'
import { useState } from 'react'

const BasicInfo = () => {
  const { user } = useAuthStore()
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (values: any) => {
    setLoading(true)
    try {
      // TODO: 调用API更新用户信息
      await new Promise(resolve => setTimeout(resolve, 1000))
      message.success('基本信息更新成功')
      console.log('Updated values:', values)
    } catch (error) {
      message.error('更新失败，请重试')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="settings-content">
      <div className="settings-section">
        <h3 className="section-title">基本资料</h3>
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            name: user?.name,
            email: user?.email,
            institution: user?.institution?.name,
            position: '',
            address: '',
          }}
          onFinish={handleSubmit}
        >
          <Form.Item
            label="账户名称"
            name="name"
            rules={[{ required: true, message: '请输入账户名称' }]}
          >
            <Input placeholder="请输入账户名称" />
          </Form.Item>

          <Form.Item
            label="邮箱地址"
            name="email"
            rules={[
              { required: true, message: '请输入邮箱地址' },
              { type: 'email', message: '请输入有效的邮箱地址' },
            ]}
          >
            <Input placeholder="请输入邮箱地址" />
          </Form.Item>

          <Form.Item
            label="所属机构"
            name="institution"
          >
            <Input placeholder="请输入所属机构名称" />
          </Form.Item>

          <Form.Item
            label="职位"
            name="position"
          >
            <Input placeholder="请输入职位" />
          </Form.Item>

          <Form.Item
            label="联系地址"
            name="address"
          >
            <Input.TextArea 
              rows={3} 
              placeholder="请输入联系地址" 
            />
          </Form.Item>

          <div className="form-actions">
            <Button type="primary" htmlType="submit" loading={loading}>
              保存修改
            </Button>
            <Button onClick={() => form.resetFields()}>
              重置
            </Button>
          </div>
        </Form>
      </div>
    </div>
  )
}

export default BasicInfo
