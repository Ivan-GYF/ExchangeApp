// Demo 用户数据

export const demoUsers = [
  // ========== 投资人（4个：3机构 + 1个人）==========
  {
    id: 'investor-inst-001',
    email: 'shuizhu@capital.com',
    password: 'demo123',  // 实际应加密
    name: '水珠资本管理有限公司',
    role: 'INVESTOR',
    phone: '021-68886666',
    organizationType: 'INSTITUTION',
    institution: {
      name: '水珠资本管理有限公司',
      type: '私募基金',
      registrationNumber: '私募基金管理人登记证明函号：P1234567',
      aum: 5000000000, // 50亿资产管理规模
    },
    createdAt: '2024-01-10T00:00:00.000Z',
    updatedAt: '2026-01-20T00:00:00.000Z',
  },
  {
    id: 'investor-inst-002',
    email: 'shuiliu@asset.com',
    password: 'demo123',
    name: '水流资产管理有限公司',
    role: 'INVESTOR',
    phone: '021-23219000',
    organizationType: 'INSTITUTION',
    institution: {
      name: '水流资产管理有限公司',
      type: '资产管理',
      registrationNumber: '统一社会信用代码：91310000MA1FL0QU2X',
      aum: 15000000000, // 150亿资产管理规模
    },
    createdAt: '2024-02-15T00:00:00.000Z',
    updatedAt: '2026-01-20T00:00:00.000Z',
  },
  {
    id: 'investor-inst-003',
    email: 'shuidi@trust.com',
    password: 'demo123',
    name: '水滴信托有限责任公司',
    role: 'INVESTOR',
    phone: '0755-82430888',
    organizationType: 'INSTITUTION',
    institution: {
      name: '水滴信托有限责任公司',
      type: '信托公司',
      registrationNumber: '统一社会信用代码：91440300618434016D',
      aum: 80000000000, // 800亿资产管理规模
    },
    createdAt: '2024-03-20T00:00:00.000Z',
    updatedAt: '2026-01-20T00:00:00.000Z',
  },
  {
    id: 'investor-inst-004',
    email: 'luzhu@capital.com',
    password: 'demo123',
    name: '露珠资本有限合伙',
    role: 'INVESTOR',
    phone: '010-59886677',
    organizationType: 'INSTITUTION',
    institution: {
      name: '露珠资本有限合伙',
      type: '私募股权基金',
      registrationNumber: '私募基金管理人登记证明函号：P8765432',
      aum: 8000000000, // 80亿资产管理规模
    },
    createdAt: '2024-06-10T00:00:00.000Z',
    updatedAt: '2026-01-30T00:00:00.000Z',
  },
  {
    id: 'investor-individual-001',
    email: 'zhangmingyuan@wealth.com',
    password: 'demo123',
    name: '张明远',
    role: 'INVESTOR',
    phone: '138-0013-8888',
    organizationType: 'INDIVIDUAL',
    individual: {
      certifiedInvestor: true,
      certificationDate: '2023-06-15',
      investmentExperience: 8, // 8年投资经验
      netWorth: 50000000, // 5000万净资产
    },
    createdAt: '2023-06-15T00:00:00.000Z',
    updatedAt: '2026-01-20T00:00:00.000Z',
  },

  // ========== 项目方（2个）==========
  {
    id: 'project-owner-001',
    email: 'concert@operator.com',
    password: 'demo123',
    name: '华娱文化传媒集团',
    role: 'PROJECT_OWNER',
    phone: '010-84568888',
    organizationType: 'INSTITUTION',
    institution: {
      name: '华娱文化传媒集团有限公司',
      type: '文化演艺',
      registrationNumber: '统一社会信用代码：91110000MA01ABCD12',
      businessScope: '演唱会、音乐节、体育赛事等大型活动策划与运营',
    },
    createdAt: '2024-05-01T00:00:00.000Z',
    updatedAt: '2026-01-20T00:00:00.000Z',
  },
  {
    id: 'project-owner-002',
    email: 'racing@venue.com',
    password: 'demo123',
    name: '久事国际赛事管理有限公司',
    role: 'PROJECT_OWNER',
    phone: '021-68881234',
    organizationType: 'INSTITUTION',
    institution: {
      name: '久事国际赛事管理有限公司',
      type: '体育场馆运营',
      registrationNumber: '统一社会信用代码：913100001234567890',
      businessScope: '赛车场运营、赛事组织、场地租赁、商业开发',
    },
    createdAt: '2024-04-10T00:00:00.000Z',
    updatedAt: '2026-01-20T00:00:00.000Z',
  },

  // ========== 交易所管理员（1个）==========
  {
    id: 'admin-001',
    email: 'admin@lakeside.com',
    password: 'admin123',
    name: '湖畔通平台管理员',
    role: 'ADMIN',
    phone: '400-888-6666',
    organizationType: 'INSTITUTION',
    institution: {
      name: 'Lakeside Exchange 湖畔通市场',
      type: '金融科技平台',
      registrationNumber: '统一社会信用代码：91310000MA1FLAKE01',
    },
    createdAt: '2023-01-01T00:00:00.000Z',
    updatedAt: '2026-01-20T00:00:00.000Z',
  },
]
