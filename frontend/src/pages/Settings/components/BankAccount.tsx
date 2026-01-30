import { useState, useMemo } from 'react'
import { Button, Modal, Form, Input, Select, message, Tag, Popconfirm, Card, Statistic, Row, Col, InputNumber, Tooltip } from 'antd'
import { BankOutlined, PlusOutlined, StarOutlined, StarFilled, DeleteOutlined, EditOutlined, WalletOutlined, ArrowUpOutlined, ArrowDownOutlined, QuestionCircleOutlined } from '@ant-design/icons'
import { useAuthStore } from '@/stores/authStore'

interface BankCard {
  id: string
  bankName: string
  cardNumber: string
  accountType: string
  branch: string
  isDefault: boolean
}

interface AccountData {
  cards: BankCard[]
  accountBalance: number
  frozenAmount: number
}

const BankAccount = () => {
  const { user } = useAuthStore()
  
  // 根据不同用户ID设置不同的初始数据
  const initialAccountData = useMemo<AccountData>(() => {
    const accountDataMap: Record<string, AccountData> = {
      // 水珠资本管理有限公司
      'investor-inst-001': {
        cards: [
          {
            id: '1',
            bankName: '中国工商银行',
            cardNumber: '6222 **** **** 1234',
            accountType: '对公账户',
            branch: '上海陆家嘴支行',
            isDefault: true,
          },
          {
            id: '2',
            bankName: '招商银行',
            cardNumber: '6225 **** **** 5678',
            accountType: '对公账户',
            branch: '上海浦东分行',
            isDefault: false,
          },
        ],
        accountBalance: 25680000, // ¥256,800.00
        frozenAmount: 7180000,    // ¥71,800.00（冻结金额）
      },
      // 露珠资本有限合伙
      'investor-inst-004': {
        cards: [
          {
            id: '1',
            bankName: '中国建设银行',
            cardNumber: '6227 **** **** 8888',
            accountType: '对公账户',
            branch: '北京朝阳支行',
            isDefault: true,
          },
        ],
        accountBalance: 12800000, // ¥128,000.00
        frozenAmount: 3200000,    // ¥32,000.00（冻结金额）
      },
    }
    
    // 默认数据（如果用户不在映射中）
    return accountDataMap[user?.id || ''] || {
      cards: [
        {
          id: '1',
          bankName: '中国工商银行',
          cardNumber: '6222 **** **** 1234',
          accountType: '储蓄卡',
          branch: '北京分行',
          isDefault: true,
        },
      ],
      accountBalance: 15680000,
      frozenAmount: 3180000,
    }
  }, [user?.id])
  
  const [cards, setCards] = useState<BankCard[]>(initialAccountData.cards)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCard, setEditingCard] = useState<BankCard | null>(null)
  const [form] = Form.useForm()
  
  // 账户资金信息
  const [accountBalance, setAccountBalance] = useState(initialAccountData.accountBalance)
  const [frozenAmount, setFrozenAmount] = useState(initialAccountData.frozenAmount)
  
  // 可提金额 = 账户余额 - 冻结金额
  const availableAmount = accountBalance - frozenAmount
  
  // 入金/出金弹窗
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false)
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false)
  const [depositForm] = Form.useForm()
  const [withdrawForm] = Form.useForm()
  const [transactionLoading, setTransactionLoading] = useState(false)

  const handleAddCard = () => {
    setEditingCard(null)
    form.resetFields()
    setIsModalOpen(true)
  }

  const handleEditCard = (card: BankCard) => {
    setEditingCard(card)
    form.setFieldsValue(card)
    setIsModalOpen(true)
  }

  const handleSubmit = async (values: any) => {
    try {
      // 脱敏处理卡号
      const maskedNumber = values.cardNumber.replace(/(\d{4})\d{8}(\d{4})/, '$1 **** **** $2')
      
      if (editingCard) {
        // 编辑
        setCards(cards.map(card => 
          card.id === editingCard.id 
            ? { ...card, ...values, cardNumber: maskedNumber }
            : card
        ))
        message.success('银行卡信息更新成功')
      } else {
        // 新增
        const newCard: BankCard = {
          id: Date.now().toString(),
          ...values,
          cardNumber: maskedNumber,
          isDefault: cards.length === 0,
        }
        setCards([...cards, newCard])
        message.success('银行卡添加成功')
      }
      setIsModalOpen(false)
      form.resetFields()
    } catch (error) {
      message.error('操作失败，请重试')
    }
  }

  const handleSetDefault = (id: string) => {
    setCards(cards.map(card => ({
      ...card,
      isDefault: card.id === id,
    })))
    message.success('默认银行卡设置成功')
  }

  const handleDeleteCard = (id: string) => {
    setCards(cards.filter(card => card.id !== id))
    message.success('银行卡删除成功')
  }

  // 入金操作
  const handleDeposit = async (values: any) => {
    if (cards.length === 0) {
      message.error('请先添加银行卡')
      return
    }
    
    setTransactionLoading(true)
    try {
      const amount = values.amount * 100 // 转换为分
      // TODO: 调用API执行入金
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      setAccountBalance(prev => prev + amount)
      // 入金不影响冻结金额，冻结金额保持不变
      
      message.success(`入金成功！金额：¥${values.amount.toLocaleString()}`)
      setIsDepositModalOpen(false)
      depositForm.resetFields()
    } catch (error) {
      message.error('入金失败，请重试')
    } finally {
      setTransactionLoading(false)
    }
  }

  // 出金操作
  const handleWithdraw = async (values: any) => {
    if (cards.length === 0) {
      message.error('请先添加银行卡')
      return
    }
    
    const amount = values.amount * 100 // 转换为分
    const currentAvailable = accountBalance - frozenAmount
    
    if (amount > currentAvailable) {
      message.error('可提金额不足')
      return
    }
    
    setTransactionLoading(true)
    try {
      // TODO: 调用API执行出金
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      setAccountBalance(prev => prev - amount)
      // 出金不影响冻结金额，冻结金额保持不变
      
      message.success(`出金成功！金额：¥${values.amount.toLocaleString()}`)
      setIsWithdrawModalOpen(false)
      withdrawForm.resetFields()
    } catch (error) {
      message.error('出金失败，请重试')
    } finally {
      setTransactionLoading(false)
    }
  }

  return (
    <div className="settings-content">
      {/* 账户资金概览 */}
      <div className="settings-section">
        <h3 className="section-title">
          <WalletOutlined /> 账户资金
        </h3>
        <Row gutter={16} style={{ marginBottom: 24 }}>
          <Col span={8}>
            <Card>
              <Statistic
                title="账户余额"
                value={accountBalance / 100}
                precision={2}
                prefix="¥"
                valueStyle={{ color: '#1890ff', fontSize: 28, fontWeight: 600 }}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Statistic
                title="可提金额"
                value={availableAmount / 100}
                precision={2}
                prefix="¥"
                valueStyle={{ color: '#52c41a', fontSize: 28, fontWeight: 600 }}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Statistic
                title={
                  <span>
                    冻结金额{' '}
                    <Tooltip title="冻结金额代表已投资但尚未退出的资金或正在处理中的交易金额，这部分钱虽然在账户余额中，但暂时不能提取">
                      <QuestionCircleOutlined style={{ color: 'rgba(0,0,0,0.45)', fontSize: 14 }} />
                    </Tooltip>
                  </span>
                }
                value={frozenAmount / 100}
                precision={2}
                prefix="¥"
                valueStyle={{ color: '#ff4d4f', fontSize: 28, fontWeight: 600 }}
              />
            </Card>
          </Col>
        </Row>
        
        <div style={{ display: 'flex', gap: 12 }}>
          <Button 
            type="primary" 
            size="large"
            icon={<ArrowDownOutlined />}
            onClick={() => setIsDepositModalOpen(true)}
          >
            入金
          </Button>
          <Button 
            size="large"
            icon={<ArrowUpOutlined />}
            onClick={() => setIsWithdrawModalOpen(true)}
          >
            出金
          </Button>
        </div>
      </div>

      <div className="settings-section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div>
            <h3 className="section-title" style={{ marginBottom: 0 }}>我的银行卡</h3>
            <p className="section-description">管理您的银行卡信息，用于出入金操作</p>
          </div>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAddCard}>
            添加银行卡
          </Button>
        </div>

        <div className="bank-card-list">
          {cards.map(card => (
            <div 
              key={card.id} 
              className={`bank-card-item ${card.isDefault ? 'default' : ''}`}
            >
              <div className="bank-card-info">
                <BankOutlined className="bank-card-icon" />
                <div className="bank-card-details">
                  <h4>
                    {card.bankName}
                    {card.isDefault && (
                      <Tag color="success" style={{ marginLeft: 8 }}>默认</Tag>
                    )}
                  </h4>
                  <p>{card.cardNumber}</p>
                  <p>{card.accountType} • {card.branch}</p>
                </div>
              </div>
              <div className="bank-card-actions">
                {!card.isDefault && (
                  <Button 
                    icon={<StarOutlined />}
                    onClick={() => handleSetDefault(card.id)}
                  >
                    设为默认
                  </Button>
                )}
                {card.isDefault && (
                  <Button icon={<StarFilled />} disabled>
                    默认银行卡
                  </Button>
                )}
                <Button 
                  icon={<EditOutlined />}
                  onClick={() => handleEditCard(card)}
                >
                  编辑
                </Button>
                <Popconfirm
                  title="确认删除"
                  description="确定要删除这张银行卡吗？"
                  onConfirm={() => handleDeleteCard(card.id)}
                  okText="确定"
                  cancelText="取消"
                >
                  <Button danger icon={<DeleteOutlined />}>
                    删除
                  </Button>
                </Popconfirm>
              </div>
            </div>
          ))}

          {cards.length === 0 && (
            <div style={{ textAlign: 'center', padding: 48, color: 'rgba(0,0,0,0.45)' }}>
              暂无银行卡，请添加
            </div>
          )}
        </div>
      </div>

      <Modal
        title={editingCard ? '编辑银行卡' : '添加银行卡'}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            label="银行名称"
            name="bankName"
            rules={[{ required: true, message: '请选择银行' }]}
          >
            <Select placeholder="请选择银行">
              <Select.Option value="中国工商银行">中国工商银行</Select.Option>
              <Select.Option value="中国建设银行">中国建设银行</Select.Option>
              <Select.Option value="中国农业银行">中国农业银行</Select.Option>
              <Select.Option value="中国银行">中国银行</Select.Option>
              <Select.Option value="交通银行">交通银行</Select.Option>
              <Select.Option value="招商银行">招商银行</Select.Option>
              <Select.Option value="浦发银行">浦发银行</Select.Option>
              <Select.Option value="中信银行">中信银行</Select.Option>
              <Select.Option value="民生银行">民生银行</Select.Option>
              <Select.Option value="其他">其他</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="银行卡号"
            name="cardNumber"
            rules={[
              { required: true, message: '请输入银行卡号' },
              { pattern: /^\d{16,19}$/, message: '请输入16-19位银行卡号' },
            ]}
          >
            <Input placeholder="请输入银行卡号" maxLength={19} />
          </Form.Item>

          <Form.Item
            label="账户类型"
            name="accountType"
            rules={[{ required: true, message: '请选择账户类型' }]}
          >
            <Select placeholder="请选择账户类型">
              <Select.Option value="储蓄卡">储蓄卡</Select.Option>
              <Select.Option value="对公账户">对公账户</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="开户行"
            name="branch"
            rules={[{ required: true, message: '请输入开户行' }]}
          >
            <Input placeholder="如：北京分行" />
          </Form.Item>

          <div className="form-actions">
            <Button type="primary" htmlType="submit">
              {editingCard ? '保存修改' : '添加'}
            </Button>
            <Button onClick={() => setIsModalOpen(false)}>
              取消
            </Button>
          </div>
        </Form>
      </Modal>

      {/* 入金弹窗 */}
      <Modal
        title="账户入金"
        open={isDepositModalOpen}
        onCancel={() => setIsDepositModalOpen(false)}
        footer={null}
        width={500}
      >
        <Form
          form={depositForm}
          layout="vertical"
          onFinish={handleDeposit}
        >
          <Form.Item
            label="入金银行卡"
            name="bankCardId"
            initialValue={cards.find(c => c.isDefault)?.id || cards[0]?.id}
            rules={[{ required: true, message: '请选择银行卡' }]}
          >
            <Select placeholder="请选择银行卡">
              {cards.map(card => (
                <Select.Option key={card.id} value={card.id}>
                  {card.bankName} {card.cardNumber}
                  {card.isDefault && <Tag color="success" style={{ marginLeft: 8 }}>默认</Tag>}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="入金金额"
            name="amount"
            rules={[
              { required: true, message: '请输入入金金额' },
              { 
                type: 'number', 
                min: 1000, 
                message: '最低入金金额为 ¥1,000' 
              },
            ]}
          >
            <InputNumber
              style={{ width: '100%' }}
              placeholder="请输入入金金额"
              prefix="¥"
              formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={value => value!.replace(/\¥\s?|(,*)/g, '')}
              min={1000}
              precision={2}
            />
          </Form.Item>

          <div style={{ 
            background: '#f6f8fa', 
            padding: 16, 
            borderRadius: 8,
            marginBottom: 16,
          }}>
            <h4 style={{ margin: '0 0 8px 0', fontSize: 14 }}>入金说明</h4>
            <ul style={{ margin: 0, paddingLeft: 20, fontSize: 13, color: 'rgba(0,0,0,0.65)' }}>
              <li>最低入金金额：¥1,000</li>
              <li>入金实时到账</li>
              <li>单笔入金无手续费</li>
              <li>请确保银行卡余额充足</li>
            </ul>
          </div>

          <div className="form-actions">
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={transactionLoading}
              size="large"
              block
            >
              确认入金
            </Button>
          </div>
        </Form>
      </Modal>

      {/* 出金弹窗 */}
      <Modal
        title="账户出金"
        open={isWithdrawModalOpen}
        onCancel={() => setIsWithdrawModalOpen(false)}
        footer={null}
        width={500}
      >
        <Form
          form={withdrawForm}
          layout="vertical"
          onFinish={handleWithdraw}
        >
          <Form.Item
            label="出金银行卡"
            name="bankCardId"
            initialValue={cards.find(c => c.isDefault)?.id || cards[0]?.id}
            rules={[{ required: true, message: '请选择银行卡' }]}
          >
            <Select placeholder="请选择银行卡">
              {cards.map(card => (
                <Select.Option key={card.id} value={card.id}>
                  {card.bankName} {card.cardNumber}
                  {card.isDefault && <Tag color="success" style={{ marginLeft: 8 }}>默认</Tag>}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="出金金额"
            name="amount"
            rules={[
              { required: true, message: '请输入出金金额' },
              { 
                type: 'number', 
                min: 1000, 
                message: '最低出金金额为 ¥1,000' 
              },
              {
                validator: (_, value) => {
                  const currentAvailable = accountBalance - frozenAmount
                  if (value && value * 100 > currentAvailable) {
                    return Promise.reject(new Error(`可提金额不足，最多可提 ¥${(currentAvailable / 100).toLocaleString()}`))
                  }
                  return Promise.resolve()
                }
              }
            ]}
          >
            <InputNumber
              style={{ width: '100%' }}
              placeholder="请输入出金金额"
              prefix="¥"
              formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={value => value!.replace(/\¥\s?|(,*)/g, '')}
              min={1000}
              max={availableAmount / 100}
              precision={2}
            />
          </Form.Item>

          <div style={{ 
            background: '#fff7e6', 
            border: '1px solid #ffd591',
            padding: 16, 
            borderRadius: 8,
            marginBottom: 16,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 13, color: 'rgba(0,0,0,0.65)' }}>可提金额：</span>
              <span style={{ fontSize: 14, fontWeight: 600, color: '#fa8c16' }}>
                ¥{(availableAmount / 100).toLocaleString()}
              </span>
            </div>
            <h4 style={{ margin: '8px 0', fontSize: 14 }}>出金说明</h4>
            <ul style={{ margin: 0, paddingLeft: 20, fontSize: 13, color: 'rgba(0,0,0,0.65)' }}>
              <li>最低出金金额：¥1,000</li>
              <li>工作日当天到账，节假日顺延</li>
              <li>单笔出金无手续费</li>
              <li>持仓中的资金不可提取</li>
            </ul>
          </div>

          <div className="form-actions">
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={transactionLoading}
              size="large"
              block
            >
              确认出金
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  )
}

export default BankAccount
