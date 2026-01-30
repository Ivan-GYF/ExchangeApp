import { Layout, Avatar, Dropdown, Space, Tag } from 'antd'
import { UserOutlined, LogoutOutlined, BankOutlined, ProjectOutlined, CrownOutlined } from '@ant-design/icons'
import { useAuthStore } from '@/stores/authStore'
import { useNavigate } from 'react-router-dom'
import { UserRole } from '@/types'
import type { MenuProps } from 'antd'
import './Header.css'

const { Header: AntHeader } = Layout

const Header = () => {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  // 角色标签配置
  const getRoleTag = () => {
    if (!user) return null
    
    switch (user.role) {
      case UserRole.INVESTOR:
        return <Tag icon={<BankOutlined />} color="blue">投资人</Tag>
      case UserRole.PROJECT_OWNER:
        return <Tag icon={<ProjectOutlined />} color="green">项目方</Tag>
      case UserRole.ADMIN:
        return <Tag icon={<CrownOutlined />} color="gold">管理员</Tag>
      default:
        return null
    }
  }

  const items: MenuProps['items'] = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '个人信息',
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      onClick: handleLogout,
    },
  ]

  return (
    <AntHeader className="header-container">
      <div className="header-title">
        Lakeshore Exchange 湖畔通市场
      </div>
      <Dropdown 
        menu={{ items, className: 'header-dropdown-menu' }} 
        placement="bottomRight"
      >
        <Space className="header-user-section">
          <Avatar icon={<UserOutlined />} />
          <span className="header-user-name">{user?.name || '用户'}</span>
          {getRoleTag()}
        </Space>
      </Dropdown>
    </AntHeader>
  )
}

export default Header
