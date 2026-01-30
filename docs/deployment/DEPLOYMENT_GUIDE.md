# Lakeshore Exchange 湖畔通市场 - 部署指南

## 环境要求

### 开发环境
- Node.js >= 18.x
- npm >= 9.x 或 yarn >= 1.22.x
- PostgreSQL >= 14.x
- Redis >= 6.x

### 生产环境
- Docker >= 20.x
- Kubernetes >= 1.24.x (可选)
- Nginx >= 1.20.x

## 本地开发部署

### 1. 克隆项目
```bash
cd C:\Users\ivanguo\Claude Apps\ExchangeApp
```

### 2. 安装依赖

#### 后端
```bash
cd backend
npm install
```

#### 前端
```bash
cd frontend
npm install
```

### 3. 配置环境变量

#### 后端配置
```bash
cd backend
cp .env.example .env
# 编辑 .env 文件，配置数据库连接等信息
```

#### 前端配置
```bash
cd frontend
cp .env.example .env
# 编辑 .env 文件，配置API地址
```

### 4. 初始化数据库

```bash
cd backend
npm run prisma:generate
npm run prisma:migrate
```

### 5. 启动开发服务器

#### 启动后端（终端1）
```bash
cd backend
npm run dev
# 后端运行在 http://localhost:5000
```

#### 启动前端（终端2）
```bash
cd frontend
npm run dev
# 前端运行在 http://localhost:3000
```

### 6. 访问应用
打开浏览器访问: http://localhost:3000

## Docker 部署

### 1. 创建 Docker 镜像

#### 后端 Dockerfile
```dockerfile
# backend/Dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
EXPOSE 5000
CMD ["npm", "start"]
```

#### 前端 Dockerfile
```dockerfile
# frontend/Dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### 2. Docker Compose 配置

```yaml
# docker-compose.yml
version: '3.8'

services:
  postgres:
    image: postgres:14-alpine
    environment:
      POSTGRES_DB: marketplace_exchange
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  redis:
    image: redis:6-alpine
    ports:
      - "6379:6379"

  backend:
    build: ./backend
    environment:
      DATABASE_URL: postgresql://postgres:postgres@postgres:5432/marketplace_exchange
      REDIS_URL: redis://redis:6379
      JWT_SECRET: your-secret-key
      NODE_ENV: production
    ports:
      - "5000:5000"
    depends_on:
      - postgres
      - redis

  frontend:
    build: ./frontend
    ports:
      - "80:80"
    depends_on:
      - backend

volumes:
  postgres_data:
```

### 3. 启动 Docker 容器

```bash
docker-compose up -d
```

## 生产环境部署

### 1. 构建生产版本

#### 后端
```bash
cd backend
npm run build
```

#### 前端
```bash
cd frontend
npm run build
```

### 2. Nginx 配置

```nginx
# nginx.conf
server {
    listen 80;
    server_name your-domain.com;

    # 前端静态文件
    location / {
        root /usr/share/nginx/html;
        try_files $uri $uri/ /index.html;
    }

    # API 代理
    location /api {
        proxy_pass http://backend:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # 健康检查
    location /health {
        proxy_pass http://backend:5000/health;
    }
}
```

### 3. SSL 配置（使用 Let's Encrypt）

```bash
# 安装 certbot
sudo apt-get install certbot python3-certbot-nginx

# 获取证书
sudo certbot --nginx -d your-domain.com

# 自动续期
sudo certbot renew --dry-run
```

### 4. PM2 进程管理（Node.js 应用）

```bash
# 安装 PM2
npm install -g pm2

# 启动应用
cd backend
pm2 start dist/index.js --name marketplace-backend

# 保存配置
pm2 save

# 设置开机自启
pm2 startup
```

## 数据库迁移

### 开发环境
```bash
cd backend
npm run prisma:migrate
```

### 生产环境
```bash
cd backend
npx prisma migrate deploy
```

## 监控和日志

### 应用日志
```bash
# PM2 日志
pm2 logs marketplace-backend

# Docker 日志
docker-compose logs -f backend
```

### 性能监控
- 使用 PM2 Plus 或 New Relic 进行应用性能监控
- 使用 Prometheus + Grafana 进行系统监控

## 备份策略

### 数据库备份
```bash
# 每日自动备份
0 2 * * * pg_dump -U postgres marketplace_exchange > /backup/db_$(date +\%Y\%m\%d).sql
```

### 文件备份
```bash
# 备份上传文件
rsync -avz /app/uploads /backup/uploads_$(date +\%Y\%m\%d)
```

## 安全检查清单

- [ ] 更改所有默认密码
- [ ] 配置防火墙规则
- [ ] 启用 HTTPS
- [ ] 配置 CORS 白名单
- [ ] 启用 Rate Limiting
- [ ] 定期更新依赖包
- [ ] 配置数据库访问权限
- [ ] 启用日志审计
- [ ] 配置备份策略
- [ ] 设置监控告警

## 故障排查

### 常见问题

1. **数据库连接失败**
   - 检查 DATABASE_URL 配置
   - 确认 PostgreSQL 服务运行状态
   - 检查网络连接和防火墙规则

2. **前端无法访问后端 API**
   - 检查 CORS 配置
   - 确认 API_BASE_URL 配置正确
   - 检查 Nginx 代理配置

3. **JWT Token 过期**
   - 检查 JWT_EXPIRES_IN 配置
   - 实现 Token 刷新机制

4. **性能问题**
   - 启用 Redis 缓存
   - 优化数据库查询
   - 使用 CDN 加速静态资源

## 扩展部署

### 水平扩展
- 使用负载均衡器（Nginx/HAProxy）
- 部署多个后端实例
- 使用 Redis 共享 Session

### 垂直扩展
- 增加服务器资源（CPU/内存）
- 优化数据库配置
- 使用数据库读写分离

## 联系支持

如有部署问题，请联系技术支持团队。
