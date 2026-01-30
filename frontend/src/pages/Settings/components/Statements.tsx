import { useState } from 'react'
import { Button, Table, DatePicker, message, Space, Tag } from 'antd'
import { DownloadOutlined, FileTextOutlined, FilePdfOutlined, FileExcelOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import type { ColumnsType } from 'antd/es/table'

interface Statement {
  id: string
  period: string
  type: string
  fileSize: string
  status: string
  generatedAt: string
}

const Statements = () => {
  const { RangePicker } = DatePicker
  const [loading, setLoading] = useState(false)
  const [selectedPeriod, setSelectedPeriod] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(null)

  const statements: Statement[] = [
    {
      id: '1',
      period: '2026年1月',
      type: '月度对账单',
      fileSize: '2.3 MB',
      status: 'ready',
      generatedAt: '2026-02-01',
    },
    {
      id: '2',
      period: '2025年12月',
      type: '月度对账单',
      fileSize: '2.1 MB',
      status: 'ready',
      generatedAt: '2026-01-01',
    },
    {
      id: '3',
      period: '2025年11月',
      type: '月度对账单',
      fileSize: '1.9 MB',
      status: 'ready',
      generatedAt: '2025-12-01',
    },
    {
      id: '4',
      period: '2025年Q4',
      type: '季度报告',
      fileSize: '5.8 MB',
      status: 'ready',
      generatedAt: '2026-01-15',
    },
  ]

  const handleDownload = async (record: Statement, format: 'pdf' | 'excel') => {
    setLoading(true)
    try {
      // TODO: 调用API下载文件
      await new Promise(resolve => setTimeout(resolve, 1000))
      message.success(`${record.period} 对账单（${format.toUpperCase()}）下载成功`)
    } catch (error) {
      message.error('下载失败，请重试')
    } finally {
      setLoading(false)
    }
  }

  const handleGenerateCustom = async () => {
    if (!selectedPeriod) {
      message.warning('请选择时间范围')
      return
    }

    setLoading(true)
    try {
      // TODO: 调用API生成自定义对账单
      await new Promise(resolve => setTimeout(resolve, 2000))
      message.success('对账单生成成功，请稍后下载')
    } catch (error) {
      message.error('生成失败，请重试')
    } finally {
      setLoading(false)
    }
  }

  const columns: ColumnsType<Statement> = [
    {
      title: '账期',
      dataIndex: 'period',
      key: 'period',
      render: (text) => (
        <Space>
          <FileTextOutlined style={{ fontSize: 20, color: '#1890ff' }} />
          <span style={{ fontWeight: 500 }}>{text}</span>
        </Space>
      ),
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: '文件大小',
      dataIndex: 'fileSize',
      key: 'fileSize',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'ready' ? 'success' : 'processing'}>
          {status === 'ready' ? '可下载' : '生成中'}
        </Tag>
      ),
    },
    {
      title: '生成时间',
      dataIndex: 'generatedAt',
      key: 'generatedAt',
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            icon={<FilePdfOutlined />}
            onClick={() => handleDownload(record, 'pdf')}
            disabled={record.status !== 'ready'}
          >
            PDF
          </Button>
          <Button
            type="link"
            icon={<FileExcelOutlined />}
            onClick={() => handleDownload(record, 'excel')}
            disabled={record.status !== 'ready'}
          >
            Excel
          </Button>
        </Space>
      ),
    },
  ]

  return (
    <div className="settings-content">
      <div className="settings-section">
        <h3 className="section-title">
          <FileTextOutlined /> 对账单管理
        </h3>
        <p className="section-description">
          查看和下载您的投资对账单，包括持仓明细、交易记录和收益报告
        </p>
      </div>

      <div className="settings-section">
        <h3 className="section-title">定期对账单</h3>
        <p className="section-description">
          系统每月自动生成对账单，您可以随时下载查看
        </p>

        <Table
          columns={columns}
          dataSource={statements}
          rowKey="id"
          pagination={false}
          loading={loading}
        />
      </div>

      <div className="settings-section">
        <h3 className="section-title">自定义对账单</h3>
        <p className="section-description">
          选择自定义时间范围生成对账单
        </p>

        <Space direction="vertical" style={{ width: '100%' }} size="large">
          <div>
            <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>
              选择时间范围：
            </label>
            <RangePicker
              value={selectedPeriod}
              onChange={setSelectedPeriod}
              format="YYYY-MM-DD"
              style={{ width: 400 }}
            />
          </div>

          <Button
            type="primary"
            icon={<DownloadOutlined />}
            onClick={handleGenerateCustom}
            loading={loading}
          >
            生成对账单
          </Button>
        </Space>
      </div>

      <div className="settings-section">
        <h3 className="section-title">其他文档</h3>
        <p className="section-description">
          下载投资相关的其他文档和证明
        </p>

        <div className="statement-list">
          <div className="statement-item">
            <div className="statement-info">
              <FilePdfOutlined className="statement-icon" />
              <div className="statement-details">
                <h4>投资协议</h4>
                <p>所有已签署的投资协议合集</p>
              </div>
            </div>
            <Button type="primary" icon={<DownloadOutlined />}>
              下载
            </Button>
          </div>

          <div className="statement-item">
            <div className="statement-info">
              <FilePdfOutlined className="statement-icon" />
              <div className="statement-details">
                <h4>收益凭证</h4>
                <p>分红和收益的凭证文件</p>
              </div>
            </div>
            <Button type="primary" icon={<DownloadOutlined />}>
              下载
            </Button>
          </div>

          <div className="statement-item">
            <div className="statement-info">
              <FilePdfOutlined className="statement-icon" />
              <div className="statement-details">
                <h4>纳税证明</h4>
                <p>投资收益的纳税证明文件</p>
              </div>
            </div>
            <Button type="primary" icon={<DownloadOutlined />}>
              下载
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Statements
