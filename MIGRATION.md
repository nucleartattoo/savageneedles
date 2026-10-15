# Savage Needles (Sava) 到 Saleor 平台与全套 TanStack 迁移工程指南

本工程包含完整的 ETL 自动化迁移流水线，将原 Magento 2 电商站点（`https://www.savageneedles.com`）全量迁移至 Saleor Headless 平台，并在本地配备完整的 Apple Container 基础设施编排以及基于全套 TanStack 的现代化 SSR 前台。

---

## 一、服务架构与端口拓扑（完全隔离且不冲突）

在 Mac 本地开发环境下，容器镜像与存储均挂载在 Samsung 980 Pro 外接固态硬盘（`/Volumes/samsung2tb980pro/DeveloperData/apple-container`）上。

为了绝对避免与现有环境（如 NTMS、BDGY 等）端口冲突，Sava 专属服务端口规划如下：

| 服务组件 | 角色 / 技术栈 | 监听端口 | 容器名称 / 数据卷 | 状态 |
| :--- | :--- | :--- | :--- | :--- |
| **Storefront** | 全套 TanStack Start (SSR) + React 19 | **3005** | `sava-storefront` (`sava-storefront:latest`) | 🟢 运行中 |
| **Saleor Dashboard** | 官方后台仪表盘 (React) | **9005** | `sava-dashboard` (`saleor-dashboard:latest`) | 🟢 运行中 |
| **Saleor Core API** | Django / Python 3.12 GraphQL 后台 | **8005** | 宿主机 Python 独立进程 (环境变量 `.env.sava`) | 🟢 运行中 |
| **PostgreSQL** | 关系数据库 (存储商品/类目/订单) | **5436** (映射容器 5432) | `sava-postgres` (卷: `sava-postgres-data`) | 🟢 运行中 |
| **Redis** | 缓存与 Celery 任务队列 | **6383** (映射容器 6379) | `sava-redis` (卷: `sava-redis-data`) | 🟢 运行中 |

> **对比现有其他项目端口（绝不冲突）**：
> - **NTMS**: PG: 5434, Redis: 6381, Dashboard: 9002, Saleor Core: 8003, Storefront: 3002
> - **BDGY**: PG: 5435, Redis: 6382, Dashboard: 9004, Saleor Core: 8004, Storefront: 3000
> - **AMBI**: Storefront: 3003
> - **SAVA**: **PG: 5436, Redis: 6383, Dashboard: 9005, Saleor Core: 8005, Storefront: 3005**

---

## 二、源站点信息与抽取规模

源站凭据来源：`~/.ssh/.env.sava`
- 目标源站：`https://www.savageneedles.com`
- 认证机制：OAuth 1.0a (HMAC-SHA256)
- 提取并迁移的数据资产：
  - **分类树（Categories）**：40 个节点（39 个子类目，包含 Savage Cartridges, Papa Products [Papa Machines, Papa Cartridges, Cartridge Grips...], Cheyenne 等）
  - **属性集（Attribute Sets）**：12 套完整属性集与 6 大变体属性（Color, Size, Gauge, Type, Grip Diameter, Stroke Length）
  - **商品与变体（Products & Variants）**：
    - 源站商品 509 件，其中 141 个子规格变体自动合并关联至 Configurable 主商品；
    - 368 个独立产品全量迁移至 Saleor 并 100% 发布上架到 `default-channel`；
    - 仓库 `Savage Needles LA Hub` 自动绑定并设置初始库存与价格；
    - 原站高清媒体图片自动绑定至各商品。

---

## 三、迁移流水线架构设计

```text
┌────────────────────────────────────────────────────────────────┐
│               Stage 0: Init Saleor Environment                 │
│  • 创建默认销售渠道 default-channel (USD, US)                  │
│  • 创建主仓库 sava-main-hub (Savage Needles LA Hub)            │
│  • 配置发货区域与运输方式 (UPS Ground, 2nd Day Air, Free)       │
│  • 生成 Sava Storefront API Token                              │
└───────────────────────────────┬────────────────────────────────┘
                                │
┌───────────────────────────────▼────────────────────────────────┐
│               Stage 1: Extract Catalog Data                    │
│  • 抓取分类树 -> artifacts/extracted/categories.json           │
│  • 抓取属性集 -> artifacts/extracted/attributes.json           │
│  • 抓取全部商品及变体 -> artifacts/extracted/products.json      │
└───────────────────────────────┬────────────────────────────────┘
                                │
┌───────────────────────────────▼────────────────────────────────┐
│               Stage 2: Migrate Categories                      │
│  • 拓扑排序 (Parent 优先创建)，递归建立 Saleor Category 树     │
│  • 映射状态持久化至 artifacts/migration_state.json             │
└───────────────────────────────┬────────────────────────────────┘
                                │
┌───────────────────────────────▼────────────────────────────────┐
│               Stage 3: Migrate Attributes & Product Types      │
│  • 创建变体选择属性 (Color, Size, Gauge, Type, Grip, Stroke)   │
│  • 12 套 Attribute Sets 映射至 Saleor ProductTypes             │
└───────────────────────────────┬────────────────────────────────┘
                                │
┌───────────────────────────────▼────────────────────────────────┐
│               Stage 4: Migrate Products & Variants             │
│  • Configurable: 主商品 -> Product + 变体矩阵 -> Variants      │
│  • Simple: 独立商品 -> Product + 单一 Variant                  │
│  • 发布到 default-channel，绑定价格与 LA Hub 库存              │
└────────────────────────────────────────────────────────────────┘
```

---

## 四、前端技术栈：全套 TanStack

前台严格采用全套 TanStack 技术栈开发：
1. **@tanstack/react-start**：现代化服务端渲染 (SSR) 核心框架
2. **@tanstack/react-router**：全类型安全的文件路由系统
3. **@tanstack/react-query**：强大的服务端与客户端状态缓存管理与注水
4. **@tanstack/react-form**：类型安全表单验证
5. **@tanstack/react-router-ssr-query**：集成路由预加载与 Query Client
6. **Tailwind CSS v4**：现代深色暗黑风格，定制 Savage Needles 工匠级红/黑视觉
7. **Lucide React & Biome**：极速图标与代码格式化

---

## 五、常用管理命令

### 1. 容器基础设施管理
```bash
# 查看所有容器运行状态与端口
./manage-containers.sh status

# 启动容器基础设施 (PostgreSQL:5436, Redis:6383, Dashboard:9005, Storefront:3005)
./manage-containers.sh start

# 停止容器
./manage-containers.sh stop

# 构建前台容器镜像
./manage-containers.sh build
```

### 2. 后台 Saleor Core API 管理
```bash
# 启动专用后端 (Port 8005)
./scripts/manage_sava_backend.sh start

# 查看后端状态
./scripts/manage_sava_backend.sh status

# 停止后端
./scripts/manage_sava_backend.sh stop
```

### 3. 数据迁移与端到端验证
```bash
# 1. 探测源站连通性与数据规模
python3 scripts/probe_magento.py

# 2. 抽取源站数据
python3 scripts/migration/run_migration.py --extract

# 3. 分阶段执行迁移
python3 scripts/migration/run_migration.py --migrate-categories
python3 scripts/migration/run_migration.py --migrate-attributes
python3 scripts/migration/run_migration.py --migrate-products

# 4. 执行端到端完整加购、配送、支付、订单生成测试
python3 scripts/test_full_checkout_flow.py
```

### 4. 前端开发与本地预览
```bash
# 开发模式 (Vite Dev)
npm run dev

# 生产构建
npm run build

# 启动 SSR 生产服务器
./scripts/manage_storefront.sh start
```

---

## 六、关键访问入口

- 🛍️ **TanStack 前台 (Storefront)**: [http://localhost:3005](http://localhost:3005)
- 🔮 **Saleor GraphQL API**: [http://localhost:8005/graphql/](http://localhost:8005/graphql/)
- 📊 **Saleor Dashboard 控制台**: [http://localhost:9005](http://localhost:9005)
- 🛒 **健康检查**: [http://localhost:3005/healthz](http://localhost:3005/healthz)
- ⚡ **Saleor Live 桥接面板**: [http://localhost:3005/saleor](http://localhost:3005/saleor)
