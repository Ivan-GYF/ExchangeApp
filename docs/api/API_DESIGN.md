# API 接口设计文档

## 基础信息

- **Base URL**: `http://localhost:5000/api`
- **认证方式**: JWT Bearer Token
- **请求格式**: JSON
- **响应格式**: JSON

## 通用响应格式

### 成功响应
```json
{
  "success": true,
  "data": {},
  "message": "操作成功"
}
```

### 错误响应
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "错误描述"
  }
}
```

## 1. 认证模块 (Auth)

### 1.1 用户注册
- **POST** `/auth/register`
- **Body**:
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "张三",
  "phone": "13800138000",
  "role": "INVESTOR"
}
```

### 1.2 用户登录
- **POST** `/auth/login`
- **Body**:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```
- **Response**:
```json
{
  "success": true,
  "data": {
    "token": "jwt_token_here",
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "张三",
      "role": "INVESTOR"
    }
  }
}
```

### 1.3 获取当前用户信息
- **GET** `/auth/me`
- **Headers**: `Authorization: Bearer {token}`

## 2. 资产模块 (Assets)

### 2.1 获取资产列表
- **GET** `/assets`
- **Query Parameters**:
  - `type`: AssetType[] (可选，多选)
  - `riskLevel`: RiskLevel[] (可选)
  - `minReturn`: number (可选)
  - `maxReturn`: number (可选)
  - `region`: string (可选)
  - `status`: AssetStatus (可选)
  - `page`: number (默认: 1)
  - `limit`: number (默认: 20)
  - `sortBy`: string (默认: createdAt)
  - `sortOrder`: 'asc' | 'desc' (默认: desc)

- **Response**:
```json
{
  "success": true,
  "data": {
    "assets": [
      {
        "id": "uuid",
        "title": "某市赛道场馆收益权",
        "type": "RACING_TRACK",
        "targetAmount": 3000000,
        "raisedAmount": 1850000,
        "expectedReturn": {"min": 10, "max": 12},
        "riskLevel": "MEDIUM",
        "region": "北京",
        "status": "FUNDING",
        "fundingDeadline": "2026-02-15T00:00:00Z"
      }
    ],
    "pagination": {
      "total": 100,
      "page": 1,
      "limit": 20,
      "totalPages": 5
    }
  }
}
```

### 2.2 获取资产详情
- **GET** `/assets/:id`
- **Response**:
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "某市赛道场馆收益权",
    "description": "详细描述...",
    "type": "RACING_TRACK",
    "targetAmount": 3000000,
    "raisedAmount": 1850000,
    "minInvestment": 100000,
    "maxInvestment": 2000000,
    "expectedReturn": {"min": 10, "max": 12, "type": "annual"},
    "revenueStructure": {
      "ticketSales": 40,
      "eventHosting": 35,
      "commercialRental": 25
    },
    "riskLevel": "MEDIUM",
    "riskScore": 7.8,
    "region": "北京",
    "status": "FUNDING",
    "fundingDeadline": "2026-02-15T00:00:00Z",
    "investmentPeriod": 36,
    "dueDiligence": {
      "operatingLicense": true,
      "revenueContract": true,
      "historicalAudit": true
    },
    "milestones": [],
    "documents": []
  }
}
```

### 2.3 创建资产（管理员）
- **POST** `/assets`
- **Headers**: `Authorization: Bearer {token}`
- **Body**: Asset创建数据

### 2.4 更新资产状态（管理员）
- **PATCH** `/assets/:id/status`
- **Body**:
```json
{
  "status": "APPROVED",
  "comment": "审批通过"
}
```

## 3. 投资模块 (Investments)

### 3.1 创建投资
- **POST** `/investments`
- **Headers**: `Authorization: Bearer {token}`
- **Body**:
```json
{
  "assetId": "uuid",
  "amount": 1000000
}
```

### 3.2 获取我的投资列表
- **GET** `/investments/my`
- **Headers**: `Authorization: Bearer {token}`
- **Query**: `status`, `page`, `limit`

### 3.3 获取投资详情
- **GET** `/investments/:id`
- **Headers**: `Authorization: Bearer {token}`

### 3.4 获取投资组合统计
- **GET** `/investments/portfolio/stats`
- **Headers**: `Authorization: Bearer {token}`
- **Response**:
```json
{
  "success": true,
  "data": {
    "totalValue": 8650000,
    "totalReturn": 12.3,
    "distribution": {
      "RACING_TRACK": 35,
      "DOUYIN_STREAMING": 28,
      "CAMPUS_FACILITY": 22,
      "CONCERT_TICKET": 15
    },
    "upcomingMilestones": []
  }
}
```

## 4. 匹配模块 (Matching)

### 4.1 更新投资者画像
- **PUT** `/matching/profile`
- **Headers**: `Authorization: Bearer {token}`
- **Body**:
```json
{
  "investmentRange": {"min": 500000, "max": 3000000},
  "riskTolerance": "BALANCED",
  "preferredTypes": ["RACING_TRACK", "CAMPUS_FACILITY"],
  "preferredRegions": ["北京", "上海"],
  "returnExpectation": {"min": 8, "max": 15},
  "aiMatchingEnabled": true
}
```

### 4.2 获取AI推荐资产
- **GET** `/matching/recommendations`
- **Headers**: `Authorization: Bearer {token}`
- **Response**:
```json
{
  "success": true,
  "data": {
    "matchQuality": 94,
    "totalMatches": 12,
    "recommendations": [
      {
        "asset": {},
        "matchScore": 96,
        "matchReasons": [
          "符合您的风险偏好",
          "符合您的回报预期",
          "位于一线城市",
          "属于轻资产赛道类型"
        ]
      }
    ]
  }
}
```

### 4.3 资产对比
- **POST** `/matching/compare`
- **Body**:
```json
{
  "assetIds": ["uuid1", "uuid2"]
}
```

### 4.4 投资计算器
- **POST** `/matching/calculator`
- **Body**:
```json
{
  "amount": 1000000,
  "expectedReturn": 11,
  "period": 36
}
```
- **Response**:
```json
{
  "success": true,
  "data": {
    "totalReturn": 330000,
    "yearlyBreakdown": [110000, 110000, 110000],
    "projectedValue": 1330000
  }
}
```

## 5. 中央厨房模块 (Central Kitchen)

### 5.1 获取总览数据（管理员）
- **GET** `/central-kitchen/overview`
- **Headers**: `Authorization: Bearer {token}`
- **Response**:
```json
{
  "success": true,
  "data": {
    "totalAssets": 280000000,
    "assetPipeline": 28,
    "pendingApproval": 6,
    "systemHealth": 99.8,
    "pipeline": {
      "acquisition": 8,
      "dueDiligence": 12,
      "pricing": 7,
      "listed": 15,
      "matched": 9
    },
    "distribution": {
      "RACING_TRACK": 38,
      "DOUYIN_STREAMING": 25,
      "CAMPUS_FACILITY": 22,
      "CONCERT_TICKET": 15
    }
  }
}
```

### 5.2 获取待审批队列（管理员）
- **GET** `/central-kitchen/pending`
- **Headers**: `Authorization: Bearer {token}`

### 5.3 审批资产（管理员）
- **POST** `/central-kitchen/approve/:assetId`
- **Body**:
```json
{
  "action": "APPROVE" | "REJECT" | "REQUEST_REVIEW",
  "comment": "审批意见"
}
```

### 5.4 获取实时活动（管理员）
- **GET** `/central-kitchen/activities`
- **Query**: `page`, `limit`, `type`

## 6. 仪表板模块 (Dashboard)

### 6.1 获取首页KPI
- **GET** `/dashboard/kpi`
- **Headers**: `Authorization: Bearer {token}`
- **Response**:
```json
{
  "success": true,
  "data": {
    "totalInvestment": 8650000,
    "activeOpportunities": 45,
    "matchedTransactions": 23,
    "portfolioReturn": 12.3
  }
}
```

### 6.2 获取趋势数据
- **GET** `/dashboard/trends`
- **Query**: `period` (7d, 30d, 90d, 1y)
- **Response**:
```json
{
  "success": true,
  "data": {
    "RACING_TRACK": [/* 时间序列数据 */],
    "DOUYIN_STREAMING": [],
    "CAMPUS_FACILITY": [],
    "CONCERT_TICKET": []
  }
}
```

## 7. 分红模块 (Dividends)

### 7.1 获取分红记录
- **GET** `/dividends`
- **Headers**: `Authorization: Bearer {token}`
- **Query**: `investmentId`, `status`, `page`, `limit`

### 7.2 获取即将到账的分红
- **GET** `/dividends/upcoming`
- **Headers**: `Authorization: Bearer {token}`

## 错误码说明

| 错误码 | 说明 |
|--------|------|
| AUTH_001 | 未授权访问 |
| AUTH_002 | Token已过期 |
| AUTH_003 | 用户不存在 |
| AUTH_004 | 密码错误 |
| ASSET_001 | 资产不存在 |
| ASSET_002 | 资产状态不允许操作 |
| INVEST_001 | 投资金额不足 |
| INVEST_002 | 超出最大投资额 |
| INVEST_003 | 资产已满额 |
| PERM_001 | 权限不足 |
| VALID_001 | 参数验证失败 |
| SERVER_001 | 服务器内部错误 |

## 分页说明

所有列表接口支持分页，使用以下参数：
- `page`: 页码（从1开始）
- `limit`: 每页数量（默认20，最大100）

响应中包含分页信息：
```json
{
  "pagination": {
    "total": 100,
    "page": 1,
    "limit": 20,
    "totalPages": 5
  }
}
```

## 排序说明

支持排序的字段：
- `createdAt`: 创建时间
- `updatedAt`: 更新时间
- `amount`: 金额
- `returnRate`: 回报率
- `riskScore`: 风险评分

使用方式：
- `sortBy=createdAt&sortOrder=desc`
