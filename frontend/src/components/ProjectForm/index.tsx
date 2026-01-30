import { Modal, Form, Input, Select, InputNumber, Row, Col, Button } from 'antd'
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons'
import { useEffect } from 'react'

const { TextArea } = Input
const { Option } = Select

interface ProjectFormProps {
  visible: boolean
  mode: 'create' | 'edit'
  initialValues?: any
  onSubmit: (values: any) => Promise<void>
  onCancel: () => void
}

const ProjectForm = ({ visible, mode, initialValues, onSubmit, onCancel }: ProjectFormProps) => {
  const [form] = Form.useForm()

  useEffect(() => {
    if (visible) {
      if (mode === 'edit' && initialValues) {
        // 编辑模式：填充现有数据
        form.setFieldsValue({
          title: initialValues.title,
          description: initialValues.description,
          type: initialValues.type,
          originalCategory: initialValues.originalCategory,
          targetAmount: initialValues.targetAmount / 10000, // 转换为万元
          minInvestment: initialValues.minInvestment / 10000,
          maxInvestment: initialValues.maxInvestment / 10000,
          expectedReturnMin: initialValues.expectedReturn.min,
          expectedReturnMax: initialValues.expectedReturn.max,
          expectedReturnType: initialValues.expectedReturn.type,
          revenueStructure: Object.entries(initialValues.revenueStructure || {}).map(([key, value]) => ({
            name: key,
            percentage: value,
          })),
          riskLevel: initialValues.riskLevel,
          region: initialValues.region,
          city: initialValues.city,
          investmentPeriod: initialValues.investmentPeriod,
          fundingDeadline: initialValues.fundingDeadline,
        })
      } else {
        // 创建模式：重置表单
        form.resetFields()
      }
    }
  }, [visible, mode, initialValues, form])

  const handleFinish = async (values: any) => {
    try {
      // 转换收益结构为对象格式
      const revenueStructure: Record<string, number> = {}
      if (values.revenueStructure && Array.isArray(values.revenueStructure)) {
        values.revenueStructure.forEach((item: any) => {
          if (item && item.name && item.percentage) {
            revenueStructure[item.name] = item.percentage
          }
        })
      }

      // 构造提交数据
      const submitData = {
        title: values.title,
        description: values.description,
        type: values.type,
        originalCategory: values.originalCategory,
        targetAmount: values.targetAmount * 10000, // 转换为元
        minInvestment: values.minInvestment * 10000,
        maxInvestment: values.maxInvestment * 10000,
        expectedReturn: {
          min: values.expectedReturnMin,
          max: values.expectedReturnMax,
          type: values.expectedReturnType,
        },
        revenueStructure,
        riskLevel: values.riskLevel,
        region: values.region,
        city: values.city,
        investmentPeriod: values.investmentPeriod,
        fundingDeadline: values.fundingDeadline,
      }

      await onSubmit(submitData)
      form.resetFields()
    } catch (error) {
      console.error('Form submission error:', error)
    }
  }

  return (
    <Modal
      title={mode === 'create' ? '提交新项目' : '编辑项目'}
      open={visible}
      onCancel={onCancel}
      onOk={() => form.submit()}
      width={900}
      destroyOnClose
      okText={mode === 'create' ? '提交' : '保存'}
      cancelText="取消"
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
      >
        <Form.Item
          label="项目名称"
          name="title"
          rules={[{ required: true, message: '请输入项目名称' }]}
        >
          <Input placeholder='例如：周杰伦"地表最强"世界巡回演唱会收益权' />
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="项目类型"
              name="type"
              rules={[{ required: true, message: '请选择项目类型' }]}
            >
              <Select placeholder="选择类型">
                <Option value="CO_INVESTMENT">跟投项目</Option>
                <Option value="MIFC_FUND_LP">MIFC主基金LP</Option>
                <Option value="MIFC_ABS">MIFC ABS</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="项目分类"
              name="originalCategory"
              tooltip="用于标签展示的具体分类"
            >
              <Select placeholder="选择分类（可选）" allowClear>
                <Option value="CONCERT_TICKET">演唱会门票</Option>
                <Option value="RACING_TRACK">赛车场</Option>
                <Option value="STREAMING">新媒体流量</Option>
                <Option value="CAMPUS_FACILITY">校园设施</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          label="项目描述"
          name="description"
          rules={[{ required: true, message: '请输入项目描述' }]}
        >
          <TextArea
            rows={8}
            placeholder="详细描述项目概况、收益来源、财务预测、风险控制、投资亮点等信息..."
          />
        </Form.Item>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              label="目标金额（万元）"
              name="targetAmount"
              rules={[{ required: true, message: '请输入目标金额' }]}
            >
              <InputNumber
                style={{ width: '100%' }}
                min={0}
                placeholder="例如：1500"
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="最小投资额（万元）"
              name="minInvestment"
              rules={[{ required: true, message: '请输入最小投资额' }]}
            >
              <InputNumber
                style={{ width: '100%' }}
                min={0}
                placeholder="例如：50"
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="最大投资额（万元）"
              name="maxInvestment"
              rules={[{ required: true, message: '请输入最大投资额' }]}
            >
              <InputNumber
                style={{ width: '100%' }}
                min={0}
                placeholder="例如：500"
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              label="预期收益最低（%）"
              name="expectedReturnMin"
              rules={[{ required: true, message: '请输入最低收益率' }]}
            >
              <InputNumber
                style={{ width: '100%' }}
                min={0}
                max={100}
                placeholder="例如：18"
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="预期收益最高（%）"
              name="expectedReturnMax"
              rules={[{ required: true, message: '请输入最高收益率' }]}
            >
              <InputNumber
                style={{ width: '100%' }}
                min={0}
                max={100}
                placeholder="例如：28"
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="收益类型"
              name="expectedReturnType"
              rules={[{ required: true, message: '请输入收益类型' }]}
            >
              <Input placeholder="例如：项目收益" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item label="收益结构">
          <Form.List name="revenueStructure">
            {(fields, { add, remove }) => (
              <>
                {fields.map((field) => (
                  <Row key={field.key} gutter={16} align="middle">
                    <Col span={11}>
                      <Form.Item
                        {...field}
                        name={[field.name, 'name']}
                        rules={[{ required: true, message: '请输入收益来源' }]}
                        noStyle
                      >
                        <Input placeholder="例如：门票收入" />
                      </Form.Item>
                    </Col>
                    <Col span={11}>
                      <Form.Item
                        {...field}
                        name={[field.name, 'percentage']}
                        rules={[{ required: true, message: '请输入占比' }]}
                        noStyle
                      >
                        <InputNumber
                          style={{ width: '100%' }}
                          min={0}
                          max={100}
                          placeholder="占比（%）"
                          addonAfter="%"
                        />
                      </Form.Item>
                    </Col>
                    <Col span={2}>
                      {fields.length > 1 && (
                        <MinusCircleOutlined
                          style={{ color: '#ff4d4f', fontSize: '18px' }}
                          onClick={() => remove(field.name)}
                        />
                      )}
                    </Col>
                  </Row>
                ))}
                <Button
                  type="dashed"
                  onClick={() => add()}
                  icon={<PlusOutlined />}
                  style={{ width: '100%', marginTop: '8px' }}
                >
                  添加收益来源
                </Button>
              </>
            )}
          </Form.List>
        </Form.Item>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              label="风险等级"
              name="riskLevel"
              rules={[{ required: true, message: '请选择风险等级' }]}
            >
              <Select placeholder="选择风险等级">
                <Option value="LOW">低风险</Option>
                <Option value="MEDIUM">中风险</Option>
                <Option value="HIGH">高风险</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="投资期限（月）"
              name="investmentPeriod"
              rules={[{ required: true, message: '请输入投资期限' }]}
            >
              <InputNumber
                style={{ width: '100%' }}
                min={1}
                placeholder="例如：12"
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="募资截止日期"
              name="fundingDeadline"
              rules={[{ required: true, message: '请选择截止日期' }]}
            >
              <Input type="date" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="地区"
              name="region"
              rules={[{ required: true, message: '请输入地区' }]}
            >
              <Input placeholder="例如：全国" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="城市"
              name="city"
              rules={[{ required: true, message: '请输入城市' }]}
            >
              <Input placeholder="例如：北京" />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  )
}

export default ProjectForm
