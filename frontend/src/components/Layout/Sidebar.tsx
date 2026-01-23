import { Layout, Menu } from 'antd'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  DashboardOutlined,
  ShoppingOutlined,
  FundOutlined,
  ControlOutlined,
  AppstoreOutlined,
} from '@ant-design/icons'
import type { MenuProps } from 'antd'

const { Sider } = Layout

type MenuItem = Required<MenuProps>['items'][number]

const Sidebar = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const items: MenuItem[] = [
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
      key: '/central-kitchen',
      icon: <ControlOutlined />,
      label: '中央厨房',
    },
  ]

  const handleMenuClick: MenuProps['onClick'] = (e) => {
    navigate(e.key)
  }

  return (
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
      <div style={{
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        fontSize: '20px',
        fontWeight: 'bold',
      }}>
        MEP
      </div>
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[location.pathname]}
        items={items}
        onClick={handleMenuClick}
      />
    </Sider>
  )
}

export default Sidebar
