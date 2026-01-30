import { Layout, Menu } from 'antd'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  DashboardOutlined,
  ShoppingOutlined,
  FundOutlined,
  ControlOutlined,
  AppstoreOutlined,
  ProjectOutlined,
  SettingOutlined,
} from '@ant-design/icons'
import type { MenuProps } from 'antd'
import { useAuthStore } from '@/stores/authStore'
import { UserRole } from '@/types'
import './Sidebar.css'

const { Sider } = Layout

type MenuItem = Required<MenuProps>['items'][number]

const Sidebar = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuthStore()

  // 根据用户角色生成菜单项
  const getMenuItems = (): MenuItem[] => {
    const allItems: MenuItem[] = [
      {
        key: '/',
        icon: <DashboardOutlined />,
        label: '首页仪表板',
      },
      {
        key: '/marketplace',
        icon: <ShoppingOutlined />,
        label: '市场浏览器',
      },
      {
        key: '/portfolio',
        icon: <FundOutlined />,
        label: '投资组合',
      },
      {
        key: '/matching',
        icon: <AppstoreOutlined />,
        label: '匹配工作台',
      },
      {
        key: '/projects',
        icon: <ProjectOutlined />,
        label: '我的项目',
      },
      {
        key: '/central-kitchen',
        icon: <ControlOutlined />,
        label: '中央厨房',
      },
      {
        key: '/settings',
        icon: <SettingOutlined />,
        label: '偏好设置',
      },
    ]

    // 根据角色过滤菜单
    if (!user) return []

    switch (user.role) {
      case UserRole.INVESTOR:
        // 投资人：首页、市场浏览器、投资组合、匹配工作台、偏好设置
        return allItems.filter(item => 
          ['/', '/marketplace', '/portfolio', '/matching', '/settings'].includes(item?.key as string)
        )
      
      case UserRole.PROJECT_OWNER:
        // 项目方：首页、市场浏览器、我的项目、偏好设置
        return allItems.filter(item => 
          ['/', '/marketplace', '/projects', '/settings'].includes(item?.key as string)
        )
      
      case UserRole.ADMIN:
        // 管理员：所有页面
        return allItems.filter(item => 
          item?.key !== '/projects' // 管理员不需要"我的项目"
        )
      
      default:
        return allItems.filter(item => 
          ['/', '/marketplace'].includes(item?.key as string)
        )
    }
  }

  const items = getMenuItems()

  const handleMenuClick: MenuProps['onClick'] = (e) => {
    navigate(e.key)
  }

  return (
    <div className="sidebar-container">
      <Sider
        breakpoint="lg"
        collapsedWidth="0"
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'sticky',
          left: 0,
          top: 0,
          bottom: 0,
        }}
      >
        <div className="sidebar-logo">
          <span>湖畔通市场</span>
          <span className="sidebar-logo-subtitle">(LSE)</span>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={items}
          onClick={handleMenuClick}
          className="sidebar-menu"
        />
      </Sider>
    </div>
  )
}

export default Sidebar
