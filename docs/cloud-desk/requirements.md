# 龙虾工作台 / CLAW-DESK 需求澄清文档

本文是 龙虾工作台 当前唯一的需求主文档。

目标是把项目定位、MVP 范围、产品边界和开发优先级讲清楚。历史草案已删除；当前只维护 `README.md` 与本文，本文作为当前开发依据。

## 1. 一句话定位

**龙虾工作台是一个基于 OpenClaw 源码二次开发的个人 AI 工作台 / Agent 管理控制台，在 OpenClaw 原有本地控制台能力上，新增云账户、余额、Relay API Key、模型中转计费、账单和对账能力。**

更短地说：

> 龙虾工作台 = OpenClaw Control UI + 云账户 / 余额 / Relay 中转 / 账单对账层。

## 2. 当前核心判断

龙虾工作台 不应该从零重写 OpenClaw。

OpenClaw 已经具备这些基础能力：

- Gateway
- Control UI
- Agent 管理
- Session / Chat
- Usage / token / cost 统计
- Instances / Presence
- Skills
- Nodes
- Cron / Tasks
- Logs
- Config / Settings

龙虾工作台应该复用这些能力，在上面增加商业化和产品化能力：

- Cloud Account：云账户
- Cloud Billing：余额、充值、交易流水
- Cloud Relay：模型中转 Endpoint 与 Relay API Key
- Reconciliation：本地用量与云端扣费对账

因此当前 MVP 的正确方向是：

> 基于 OpenClaw Control UI 二开，而不是另起一套完全独立的新 Web 控制台。

## 3. 产品边界

### 3.1 要做什么

龙虾工作台 MVP 要做：

1. 在 OpenClaw Control UI 中增加 龙虾工作台导航分组。
2. 新增 Account 页面，展示 琥格AI 云账户状态。
3. 新增 Billing 页面，展示余额、今日消耗、本月消耗、交易流水和充值订单 mock。
4. 新增 Relay 页面，展示 Relay Endpoint、Relay API Key、可用模型和连接测试 mock。
5. 新增 Reconciliation 页面，展示本地 usage 与云端扣费的 mock 对账关系。
6. 龙虾工作台页面调用独立 龙虾工作台 API 后端接口；MVP 阶段前端可先使用 mock adapter，后续通过 龙虾工作台 API Base URL 切换到真实后端。
7. 在 Dashboard / Overview 中增加 龙虾工作台状态卡片。
8. 在 Settings 中增加 龙虾工作台配置区。
9. 复用 OpenClaw 现有 Usage 能力，并明确标识为 Local Usage / 本地用量。
10. 确保原 OpenClaw Chat、Sessions、Usage、Settings 等功能不被破坏。

### 3.2 暂不做什么

MVP 暂不做：

- 从零重写 OpenClaw。
- 从零另做一套完全独立的 Web 控制台。
- 真实支付。
- 真实充值。
- 完整生产级 OpenAI-compatible Relay。
- 团队 / 企业权限。
- 技能市场交易。
- 桌面端壳。
- 云桌面远程控制。
- 大规模重构 OpenClaw Gateway。
- 把账户、余额、订单、扣费等云端商业逻辑长期塞进 OpenClaw Gateway。

## 4. 命名

- 产品名：**龙虾工作台**
- 品牌名：**琥格AI**
- 工程 / 目录名：**CLAW-DESK**
- 技术基础：**OpenClaw 源码二次开发**

命名含义：

- Cloud：云账户、余额、充值、Relay 中转、模型服务。
- Desk：用户的 AI 工作台、本地 Agent 控制台、任务入口。

## 5. 目标用户

第一阶段优先服务：

- 项目发起人自己
- 独立开发者
- AI 重度使用者
- 个人创业者
- 需要本地 Agent 自动化能力的知识工作者

后续可扩展：

- 小团队负责人
- 自媒体 / 内容创作者
- 远程办公人群
- 希望低门槛使用 OpenClaw 的普通用户
- 有私有化 AI 助手需求的用户

## 6. 要解决的问题

龙虾工作台要解决这些问题：

1. OpenClaw 能力强，但普通用户安装、配置、理解成本高。
2. 用户不知道本地 Agent 是否在线、是否正常工作。
3. 用户不清楚模型调用消耗了多少 token / 费用。
4. 用户配置模型供应商 API Key 有门槛。
5. 个人用户缺少统一入口管理 Agent、会话、用量、配置和账单。
6. 如果要商业化，需要账户、余额、充值、扣费和对账能力，而 OpenClaw 原生不是为这个商业闭环设计的。

## 7. 产品组成

龙虾工作台分为三层。

### 7.1 OpenClaw 本地能力层

复用 OpenClaw 原有能力：

- Gateway
- Control UI
- Agent / Session / Chat
- Usage / token-cost 统计
- Instances / Presence
- Skills / Nodes / Cron / Tasks
- Logs / Config / Settings

原则：

- 尽量复用，不重写。
- 龙虾工作台 新增功能尽量以独立 `cloud-*` 模块加入。
- 避免大规模魔改，方便后续跟随 OpenClaw 上游更新。

### 7.2 龙虾工作台 控制台增强层

在 OpenClaw Control UI 里新增：

- Cloud Account 页面
- Cloud Billing 页面
- Cloud Relay 页面
- Cloud Reconciliation 页面
- Dashboard 中的 龙虾工作台状态卡片
- Settings 中的 龙虾工作台配置区

### 7.3 龙虾工作台 云端商业层

后续真实商业化需要：

- 用户账号
- Token / Credits 余额
- 充值订单
- 模型 Relay API Key
- 模型调用记录
- 扣费交易流水
- 用量统计
- 本地 usage 与云端扣费对账

MVP 阶段前端可以先做 mock adapter。后续真实商业化能力由独立 龙虾工作台 API 后端提供，而不是长期塞进 OpenClaw Gateway。

## 8. MVP 拆分

为了避免第一版过大，MVP 拆成三个小阶段。

### 8.1 P0.1：前端 mock 可见

目标：先让 龙虾工作台 在 OpenClaw Control UI 中可见。

要做：

- 新增 龙虾工作台导航分组。
- 新增 Account / Billing / Relay / Reconciliation 页面。
- Dashboard / Overview 增加 龙虾工作台状态卡片。
- 页面先展示前端 mock 数据。
- 不接真实 API。
- 不影响原 OpenClaw 功能。

验收：

- 打开 Control UI 能看到 龙虾工作台 分组。
- 四个页面都能进入。
- 页面有清晰 mock 标识。
- 原 Chat / Sessions / Usage / Settings 仍可正常使用。

### 8.2 P0.2：API adapter 与接口契约

目标：把页面数据访问统一收敛到 龙虾工作台 API adapter，并定义后端接口契约。

要做：

- 新增 `cloudDeskApi` 前端 adapter。
- Account / Billing / Relay / Reconciliation 页面都通过 adapter 获取数据。
- adapter 第一版可以返回本地 mock 数据。
- Settings 中配置 龙虾工作台 API Base URL。
- 后续可把 adapter 从 mock 切换到真实 龙虾工作台 API 后端。

验收：

- 页面不直接散落写死数据，而是统一调用 `cloudDeskApi`。
- mock 登录 / 退出可用。
- mock 创建充值订单可用。
- mock 创建 / 重置 Relay API Key 可用。
- mock 连接测试可用。
- 已形成后端 API contract，方便单独启动后端项目实现。

### 8.3 P0.3：接入本地 Usage 与 mock 对账

目标：把 OpenClaw 本地用量和 龙虾工作台 账单概念关联起来。

要做：

- 复用 OpenClaw `sessions.usage` 能力。
- 将原 Usage 页面明确标识为 Local Usage / 本地用量。
- Reconciliation 页面展示本地 usage 与云端 mock billing 的对应关系。
- 支持 matched / local_only / cloud_only / mismatch 状态。

验收：

- 能看到本地 session usage。
- 能看到 mock cloud billing transaction。
- 能看到对账状态。
- 文案明确说明 Local Usage 不等于真实账单。

## 9. P1 / P2 后续范围

### 9.1 P1 可做

- 真实 琥格AI 账号登录。
- 真实 Relay API Key 管理。
- OpenAI-compatible Relay 最小转发。
- 本地 OpenClaw provider 配置写入 琥格AI Relay。
- 模拟充值流程增强。
- Relay 调用日志。
- 多模型费率展示。
- 按 Agent / Session / 模型聚合用量。

### 9.2 P2 后续

- 真实支付。
- 订单、退款、发票。
- 团队版账户。
- 技能市场。
- 云端同步。
- 一键安装 / 升级 OpenClaw。
- 桌面端壳：Tauri / Electron。
- 企业私有化部署。

## 10. 关键页面需求

### 10.1 Dashboard / Overview

复用 OpenClaw Overview，并增加 龙虾工作台 卡片：

- Cloud Account Card
  - 未登录 / 已登录
  - 当前账户
  - 套餐
- Balance Card
  - 当前余额
  - 今日消耗
  - 本月消耗
- Relay Card
  - Endpoint
  - API Key 状态
  - 最近测试结果
- Local vs Cloud Usage Card
  - 本地 usage 条数
  - 云端扣费记录条数
  - mismatch 数量

### 10.2 Account 页面

字段：

- 用户 ID
- 邮箱 / 手机号
- 昵称
- 套餐
- 账户状态
- 登录时间

操作：

- mock 登录
- mock 退出
- 刷新账户信息

### 10.3 Billing 页面

字段：

- 当前余额
- 今日消耗
- 本月消耗
- 最近交易流水
- 订单状态 mock

操作：

- 查询余额
- 查询交易流水
- 创建充值订单 mock
- 查看订单状态 mock

### 10.4 Relay 页面

字段：

- Relay Endpoint
- Relay API Key masked value
- API Key 创建时间
- API Key 最近使用时间
- 可用模型
- 模型费率说明
- 最近连接测试结果

操作：

- 创建 API Key mock
- 重置 API Key mock
- 撤销 API Key mock
- 测试 Relay 连接 mock
- 拉取模型列表 mock

### 10.5 Reconciliation 页面

字段：

- 本地 session id
- 本地 agent id
- 云端 relay request id
- 模型
- input tokens
- output tokens
- 本地估算费用
- 云端实际扣费
- 差异状态
- 创建时间

操作：

- 按 session id 过滤
- 按状态过滤
- 触发 mock 同步本地 usage

### 10.6 Settings 页面

新增 龙虾工作台设置区：

- 龙虾工作台 enabled
- mock mode
- 龙虾工作台 API Base URL
- Relay Endpoint
- 当前 Cloud Account
- 清除 龙虾工作台 登录状态

### 10.7 登录 / 绑定交互状态页面

如果继续落地 琥格AI 账户体系，建议在 Account / Auth 相关页面中补充两个交互状态页面，避免登录流程只停留在“输入框 + 按钮”的静态状态。

#### 10.7.1 手机验证码登录状态

适用场景：手机号登录、手机号绑定、手机号验证。

页面 / 组件状态：

- 未发送验证码
  - 输入手机号。
  - 点击发送验证码。
  - 校验手机号格式。
- 验证码已发送
  - 展示 60 秒倒计时。
  - 倒计时期间禁用“重新发送”。
  - 明确提示验证码已发送到当前手机号。
- 可重新发送
  - 60 秒倒计时结束后允许重新发送。
  - 重新发送后重置倒计时。
- 验证码错误
  - 展示验证码错误提示。
  - 保留手机号。
  - 允许重新输入验证码。
- 手机号格式错误
  - 在发送前提示手机号格式错误。
  - 不触发发送验证码动作。
- 登录 / 绑定成功
  - 展示成功状态。
  - 自动刷新 Cloud Account 信息。

建议文案：

- “验证码已发送，60 秒后可重新发送。”
- “验证码不正确或已过期，请重新输入。”
- “请输入有效的手机号。”
- “验证成功，正在刷新账户信息。”

P0 mock 要求：

- 验证码发送使用 mock action。
- 倒计时在前端实现。
- 可预设一个 mock 验证码，例如 `123456`。
- 错误状态必须可手动触发，方便验收 UI。

#### 10.7.2 微信扫码登录状态

适用场景：微信扫码登录、微信账号绑定、后续支付确认前置身份验证。

页面 / 组件状态：

- 等待扫码
  - 展示二维码。
  - 展示二维码有效期。
  - 提示用户使用微信扫码。
- 已扫码，等待手机确认
  - 二维码区域切换为“已扫码”。
  - 提示用户在手机微信中确认登录。
  - 禁止重复扫码提示干扰。
- 登录成功
  - 展示成功状态。
  - 自动刷新 Cloud Account 信息。
  - 可跳转 Account 页面或关闭登录弹窗。
- 二维码过期
  - 展示过期状态。
  - 提供“刷新二维码”按钮。
  - 刷新后回到等待扫码状态。

建议文案：

- “请使用微信扫码登录。”
- “已扫码，请在手机上确认。”
- “登录成功，正在刷新账户信息。”
- “二维码已过期，请刷新后重试。”

P0 mock 要求：

- 二维码可使用 mock 占位图或本地生成的占位块。
- 支持通过 mock 按钮或 mock 状态切换模拟：等待扫码 / 已扫码 / 登录成功 / 已过期。
- 不接入真实微信开放平台。
- 页面必须明确标识 mock mode。

#### 10.7.3 Auth 状态枚举建议

前端可以统一定义登录交互状态，避免散落布尔值：

```ts
type SmsAuthState =
  | "idle"
  | "phone_invalid"
  | "code_sent"
  | "counting_down"
  | "can_resend"
  | "code_invalid"
  | "success";

type WechatQrState = "waiting_scan" | "scanned_waiting_confirm" | "success" | "expired";
```

后续如果 Account 页面同时支持手机号、邮箱、微信扫码登录，建议抽象成 `cloud-auth-*` 组件，页面只负责布局和账户信息刷新。

## 11. Token / 用量 / 余额概念澄清

这些概念必须分开，不能都叫 token。

| 名称                     | 所属系统              | 用途                       | 是否商业计费 |
| ------------------------ | --------------------- | -------------------------- | ------------ |
| Gateway Token            | OpenClaw 本地 Gateway | 浏览器连接本地 Gateway     | 否           |
| Device Token             | OpenClaw 本地 Gateway | 设备配对 / 浏览器身份      | 否           |
| Usage Tokens             | OpenClaw usage        | 模型输入 / 输出 token 数量 | 作为统计依据 |
| 琥格AI Balance / Credits | 琥格AI 云账户         | 用户充值余额               | 是           |
| Relay API Key            | 琥格AI Relay          | 调用模型中转站             | 是           |
| Provider API Key         | 上游模型供应商        | 琥格AI Relay 调供应商      | 间接相关     |

UI 文案建议：

- Gateway Token：本地连接凭证。
- 琥格AI Balance / Credits：云账户余额。
- Relay API Key：模型中转站调用密钥。
- Usage Tokens：模型输入 / 输出 token 数量。

重要原则：

> Local Usage 是本地模型调用统计，Cloud Billing 是云端 Relay 实际扣费记录，二者不能直接等同。

## 12. 技术落地点

### 12.1 当前源码位置

OpenClaw 源码位置：

```text
/home/jerry/vscodeproject/openclaw
```

CLAW-DESK 中的引用：

```text
CLAW-DESK/vendor/openclaw -> /home/jerry/vscodeproject/openclaw
```

当前建议：

- `CLAW-DESK` 保留产品需求和二开规划。
- 实际代码改动发生在 `/home/jerry/vscodeproject/openclaw`。

### 12.2 前端候选改动点

候选新增文件：

```text
ui/src/ui/cloud-desk-types.ts
ui/src/ui/cloud-desk-api.ts
ui/src/ui/controllers/cloud-account.ts
ui/src/ui/controllers/cloud-billing.ts
ui/src/ui/controllers/cloud-relay.ts
ui/src/ui/controllers/cloud-reconciliation.ts
ui/src/ui/views/cloud-account.ts
ui/src/ui/views/cloud-billing.ts
ui/src/ui/views/cloud-relay.ts
ui/src/ui/views/cloud-reconciliation.ts
ui/src/ui/views/cloud-dashboard-cards.ts
```

候选修改文件：

```text
ui/src/ui/navigation.ts
ui/src/ui/app-render.ts
ui/src/ui/views/overview.ts
ui/src/ui/views/overview-cards.ts
ui/src/ui/views/usage.ts
ui/src/ui/app-settings.ts
ui/src/i18n/*
```

### 12.3 Gateway 候选改动点

候选新增文件：

```text
src/gateway/cloud-desk-api.ts
src/gateway/cloud-desk-types.ts
src/gateway/cloud-desk-store.ts
```

候选修改文件：

```text
src/gateway/control-ui-contract.ts
src/gateway/control-ui-routing.ts
src/gateway/server-control-ui-root.ts
src/config/schema.ts
src/config/schema.help.ts
```

最终以 OpenClaw 源码实际结构为准。

## 13. 龙虾工作台后端接口设计

龙虾工作台后端可以作为独立项目提供，例如 `cloud-desk-api`。

### 13.1 后端职责

龙虾工作台 API 后端负责云端商业能力：

- 用户登录与账户信息
- 余额与消费统计
- 充值订单
- 交易流水
- Relay API Key 管理
- Relay Endpoint / 模型列表 / 费率
- Relay 连接测试
- 模型调用记录
- 云端扣费记录
- 本地 usage 与云端扣费的对账数据

OpenClaw Gateway 仍主要负责本地能力：

- 本地 Gateway 状态
- 本地 Agent / Session / Chat
- 本地 Usage
- 本地 Settings / Config
- 本地 Logs / Nodes / Skills 等

### 13.2 调用方式

Control UI 中新增 `cloudDeskApi` adapter：

```ts
cloudDeskApi.getAccount();
cloudDeskApi.login();
cloudDeskApi.logout();
cloudDeskApi.getBillingSummary();
cloudDeskApi.getTransactions();
cloudDeskApi.createRechargeOrder();
cloudDeskApi.getRelayConfig();
cloudDeskApi.createRelayApiKey();
cloudDeskApi.resetRelayApiKey();
cloudDeskApi.testRelay();
cloudDeskApi.getReconciliation();
```

P0 阶段：adapter 返回 mock 数据。

后续真实后端接入：adapter 通过 `龙虾工作台 API Base URL` 调用独立 龙虾工作台 API。

示例：

```text
http://127.0.0.1:8787
https://api.clouddesk.example
```

### 13.3 通用约定

#### 认证

真实后端接入后，龙虾工作台 API 使用独立认证，不复用 OpenClaw Gateway Token。

请求头建议：

```http
Authorization: Bearer <cloud_desk_access_token>
Content-Type: application/json
```

需要明确区分：

- OpenClaw Gateway Token：本地控制台连接凭证。
- 琥格AI Access Token：琥格AI 云账户登录凭证。
- Relay API Key：模型中转站调用密钥。

#### 响应格式

成功响应：

```json
{
  "ok": true,
  "data": {}
}
```

失败响应：

```json
{
  "ok": false,
  "error": {
    "code": "INSUFFICIENT_BALANCE",
    "message": "余额不足",
    "details": {}
  }
}
```

分页响应：

```json
{
  "ok": true,
  "data": {
    "items": [],
    "page": 1,
    "pageSize": 20,
    "total": 0
  }
}
```

#### 金额单位

建议后端内部使用整数 credits，避免浮点误差。

例如：

```json
{
  "balanceCredits": 123456,
  "currency": "CREDITS",
  "displayAmount": "1234.56"
}
```

#### 时间格式

统一使用 ISO-8601：

```text
2026-06-07T00:00:00+08:00
```

### 13.4 Auth / Account 接口

- `POST /api/auth/login`：登录，返回 龙虾工作台 access token 和账户信息。
- `POST /api/auth/logout`：退出登录。
- `GET /api/account/me`：获取当前账户信息。

账户信息字段：

```json
{
  "userId": "user_001",
  "email": "demo@example.com",
  "phone": null,
  "nickname": "Demo User",
  "plan": "free",
  "status": "active",
  "loginAt": "2026-06-07T00:00:00+08:00"
}
```

### 13.5 Billing 接口

- `GET /api/billing/summary`：获取余额、今日消耗、本月消耗。
- `GET /api/billing/transactions`：获取交易流水。
- `POST /api/billing/recharge-orders`：创建充值订单，P0/P1 可 mock。
- `GET /api/billing/recharge-orders/:orderId`：查询充值订单状态。

交易流水核心字段：

```json
{
  "transactionId": "txn_001",
  "type": "debit",
  "source": "relay_call",
  "amountCredits": -120,
  "balanceAfterCredits": 99880,
  "description": "gpt-4.1 relay call",
  "relayRequestId": "req_001",
  "sessionId": "session_001",
  "model": "gpt-4.1",
  "createdAt": "2026-06-07T00:00:00+08:00"
}
```

充值订单核心字段：

```json
{
  "orderId": "order_001",
  "status": "pending",
  "amountCents": 5000,
  "currency": "CNY",
  "credits": 500000,
  "paymentUrl": "mock://payment/order_001",
  "createdAt": "2026-06-07T00:00:00+08:00"
}
```

### 13.6 Relay 接口

- `GET /api/relay/config`：获取 Relay Endpoint 与 API Key 状态。
- `POST /api/relay/api-keys`：创建 Relay API Key。
- `POST /api/relay/api-keys/reset`：重置 Relay API Key。
- `POST /api/relay/api-keys/revoke`：撤销 Relay API Key。
- `GET /api/relay/models`：获取可用模型与费率。
- `POST /api/relay/test`：测试 Relay 连接。

Relay config 核心字段：

```json
{
  "endpoint": "https://relay.clouddesk.example/v1",
  "apiKeyId": "rak_001",
  "apiKeyMasked": "cd-relay-****abcd",
  "apiKeyStatus": "active",
  "createdAt": "2026-06-07T00:00:00+08:00",
  "lastUsedAt": null
}
```

创建 / 重置 API Key 时，明文 `apiKey` 只返回一次：

```json
{
  "apiKeyId": "rak_001",
  "apiKey": "cd-relay_sk_live_xxx",
  "apiKeyMasked": "cd-relay-****abcd",
  "status": "active",
  "createdAt": "2026-06-07T00:00:00+08:00"
}
```

模型与费率字段：

```json
{
  "model": "gpt-4.1",
  "provider": "openai",
  "status": "available",
  "inputCreditsPer1kTokens": 10,
  "outputCreditsPer1kTokens": 30,
  "contextWindow": 128000
}
```

### 13.7 Usage / Reconciliation 接口

- `GET /api/reconciliation`：获取本地 usage 与云端扣费的对账记录。
- `POST /api/reconciliation/sync-local-usage`：手动提交或同步本地 usage 摘要。

查询参数：

```text
page=1&pageSize=20&status=matched|local_only|cloud_only|mismatch&sessionId=session_001
```

对账记录字段：

```json
{
  "reconciliationId": "rec_001",
  "status": "matched",
  "local": {
    "sessionId": "session_001",
    "agentId": "main",
    "model": "gpt-4.1",
    "inputTokens": 1000,
    "outputTokens": 500,
    "estimatedCost": 0.045,
    "createdAt": "2026-06-07T00:00:00+08:00"
  },
  "cloud": {
    "relayRequestId": "req_001",
    "transactionId": "txn_001",
    "model": "gpt-4.1",
    "inputTokens": 1000,
    "outputTokens": 500,
    "chargedCredits": 25,
    "createdAt": "2026-06-07T00:00:01+08:00"
  },
  "difference": {
    "tokenDiff": 0,
    "costDiffCredits": 0
  }
}
```

同步本地 usage 请求字段：

```json
{
  "items": [
    {
      "sessionId": "session_001",
      "agentId": "main",
      "model": "gpt-4.1",
      "inputTokens": 1000,
      "outputTokens": 500,
      "estimatedCost": 0.045,
      "createdAt": "2026-06-07T00:00:00+08:00"
    }
  ]
}
```

### 13.8 Relay OpenAI-compatible 接口方向

P1 阶段 琥格AI Relay 可以提供 OpenAI-compatible API：

```http
POST /v1/chat/completions
POST /v1/responses
GET  /v1/models
```

这部分用于真实模型中转、用量统计和扣费，不属于 P0 必做。

P0 只需要 Control UI 页面和 龙虾工作台 API contract，不需要实现真实 Relay 转发。

## 14. 安全与权限要求

MVP 必须遵守：

- 龙虾工作台功能失败不能影响 OpenClaw 原有本地功能。
- Relay API Key 不长期展示明文。
- 敏感配置使用 OpenClaw 现有 SecretRef 或等效机制。
- 写入模型配置、重置 key、扣费相关动作需要明确确认。
- Gateway Token、Cloud Account Token、Relay API Key UI 上必须分区展示。
- Mock mode 必须显眼标识，避免用户误以为是真实扣费。

## 15. 第一阶段验收标准

P0 完成时，应满足：

1. OpenClaw Control UI 左侧导航出现 龙虾工作台 分组。
2. 龙虾工作台 下有 Account / Billing / Relay / Reconciliation 页面。
3. 页面展示 mock 数据，并有 mock mode 标识。
4. Dashboard 展示 龙虾工作台 account / balance / relay 状态卡片。
5. Local Usage 页面仍可用，并明确是本地用量。
6. Billing / Reconciliation 页面能展示 mock 本地 usage 与云端扣费关联。
7. 原 OpenClaw Chat / Sessions / Usage / Settings 不被破坏。
8. 需求和 README 保持同步，不再新增分散需求文档。

## 16. 当前仍需确认的问题

这些问题不阻塞 P0.1，但在继续开发时需要确认：

1. 龙虾工作台页面是否默认开启，还是通过 `cloudDesk.enabled` 配置开启？当前建议：默认开启 mock mode，后续配置化。
2. 龙虾工作台后端是否现在单独新建项目？当前建议：可以后续新建；前端先按接口契约调用 mock adapter。
3. Cloud Account 登录态 MVP 存在哪里？当前建议：前端 localStorage；真实后端接入后使用后端 token/session。
4. Relay API Key mock 是否由前端 mock adapter 生成？当前建议：P0 阶段可以；真实后端接入后由后端生成。
5. 对账第一版是否只做展示，不做自动上报？当前建议：先展示 + 手动 sync mock。
6. 是否马上把 OpenClaw provider 配置写成 琥格AI Relay？当前建议：P1 再做。
7. 是否中文优先？当前建议：中文优先，英文后补。

## 17. Agent 接手维护说明

本节用于给后续接手本项目的其他 agent / 开发者快速建立上下文，避免重复讨论或走偏方向。

### 17.1 接手后先读什么

按顺序阅读：

1. `README.md`
   - 了解项目定位、当前阶段、代码改动位置。
2. `docs/requirements.md`
   - 这是当前唯一需求主文档。
   - 以本文为开发依据，不要再从历史草案或零散聊天记录推断需求。
3. `/home/jerry/vscodeproject/openclaw` 中的实际源码结构
   - 在写代码前必须先确认当前 Control UI 的真实目录、路由、导航和组件组织方式。

### 17.2 当前最重要的判断

接手 agent 必须保持以下判断：

- 龙虾工作台 不是从零新建一个控制台。
- 龙虾工作台 MVP 基于 OpenClaw Control UI 二开。
- `CLAW-DESK` 目录主要存产品需求和二开规划。
- 实际代码改动主要发生在 `/home/jerry/vscodeproject/openclaw`。
- P0 优先做前端 mock 可见，不急着接真实支付、真实 Relay、真实微信登录或真实短信服务。
- 龙虾工作台 云端商业能力后续建议由独立 `cloud-desk-api` 后端承担，不要长期塞进 OpenClaw Gateway。

### 17.3 接手后不要做什么

不要做：

- 不要从零重写 OpenClaw。
- 不要另起一套完全独立的 Web 控制台作为 MVP。
- 不要在 P0 实现真实支付。
- 不要在 P0 接入真实微信开放平台或真实短信服务。
- 不要把 Gateway Token、Cloud Account Token、Relay API Key 混成一个概念。
- 不要把 Local Usage 直接等同于 Cloud Billing。
- 不要绕过 mock adapter，在页面里到处硬编码业务数据。
- 不要破坏原 OpenClaw Chat / Sessions / Usage / Settings 等功能。

### 17.4 推荐接手任务顺序

推荐顺序：

1. 核对 OpenClaw Control UI 实际结构。
2. 做 P0.1：龙虾工作台导航分组 + 四个 mock 页面可见。
3. 给 Account/Auth 补手机验证码与微信扫码 mock 状态。
4. 抽象 `cloudDeskApi` adapter。
5. 整理后端 API contract 或 mock server。
6. 接入本地 Usage 做 mock 对账。

如果只能做一个最小任务，优先做：

> 在 OpenClaw Control UI 中新增 龙虾工作台导航分组和 Account / Billing / Relay / Reconciliation 四个 mock 页面，并确保原功能不受影响。

### 17.5 修改文档时的规则

- 当前只维护两个主文档：`README.md` 和 `docs/requirements.md`。
- 如果需求变化，优先更新 `docs/requirements.md`。
- README 只保留项目入口、当前阶段、MVP 摘要和开发位置，不展开过多细节。
- 不新增分散需求文档，除非后续明确进入 API contract / 设计稿 / 开发任务拆分阶段。
- 修改需求时要同步检查：MVP 范围、暂不做事项、验收标准、下一步落地建议是否仍一致。

## 18. 当前落地状态与下一步建议

截至当前代码落地，P0 前端 mock 已经完成大部分“可见 + 可交互”目标。

### 18.1 已落地

实际源码位置：`/home/jerry/vscodeproject/openclaw`。

已完成：

1. 龙虾工作台导航分组已接入 Control UI。
2. 已新增并挂载页面：
   - `/cloud/auth`
   - `/cloud/profile`
   - `/cloud/members`
   - `/cloud/account`
   - `/cloud/billing`
   - `/cloud/relay`
   - `/cloud/reconciliation`
3. 页面主体已中文化一轮；CLI 命令文案保持使用 `openclaw`，只有 Web 控制台使用 龙虾工作台 / 龙虾工作台 品牌。
4. 已新增 `cloudDeskApi` mock adapter、`CloudDeskSnapshot` 与 `CloudDeskSettings` 类型定义。
5. 龙虾工作台页面已从直接散读 mock 数据，改为优先消费 `AppViewState.cloudDeskSnapshot`；测试/独立渲染场景仍保留 `cloudDeskApi.getCachedSnapshot()` 作为默认 fallback。
6. 已接入 P0 mock action：
   - 登录 / 退出 / 刷新账户。
   - 手机验证码登录状态与微信扫码状态。
   - 创建充值订单与模拟支付成功。
   - 创建、重置、吊销 Relay API Key。
   - 测试 Relay 连接。
   - 创建邀请与接受邀请。
   - 同步本地用量 mock 对账。
7. Overview 已增加 龙虾工作台状态入口。
8. Usage 页面已增加 Local Usage / 本地用量说明，明确不等同于云端真实账单。
9. Settings 已增加 龙虾工作台设置区：
   - 可编辑启用状态、Mock 模式、龙虾工作台 API Base URL、Relay Endpoint。
   - 配置通过 `cloudDeskApi` 存入浏览器 localStorage mock。
   - 可恢复默认配置。
   - 可清除 龙虾工作台 mock 登录状态。
10. 龙虾工作台 snapshot 已挂进 `AppViewState`：
    - app 启动时加载 snapshot。
    - 龙虾工作台 action 统一通过 `runCloudDeskAction()` 执行并刷新 state。
    - 页面渲染入口接收 state snapshot，避免页面各自散读 adapter。
11. 已新增 龙虾工作台 smoke test：
    - `ui/src/ui/cloud-desk-navigation.test.ts`
    - `ui/src/ui/views/cloud-desk.render.test.ts`
12. 已新增 `cloudDeskApi` adapter 行为测试，并覆盖 龙虾工作台 settings save/reset：
    - `ui/src/ui/cloud-desk-api.test.ts`

当前已验证：

```bash
pnpm --dir ui exec vitest run --config vitest.config.ts \
  src/ui/cloud-desk-api.test.ts \
  src/ui/cloud-desk-navigation.test.ts \
  src/ui/views/cloud-desk.render.test.ts \
  src/ui/views/config-quick.test.ts

pnpm --dir ui build
```

说明：全量 browser 测试依赖 Playwright Chromium；如果本机未安装浏览器，需要先处理 Playwright 环境，不能把该环境失败误判为 龙虾工作台 新增测试失败。

### 18.2 当前仍未完成

这些是后续更值得继续推进的事项：

1. **真实 API contract / mock server**
   - 需要把第 13 节 API contract 整理为更正式的 OpenAPI 或 Markdown contract。
   - 可选新增独立 `cloud-desk-api` mock server。
   - 前端 adapter 后续通过 `龙虾工作台 API Base URL` 切换到真实后端或 mock server。

2. **本地 Usage 真实数据接入对账**
   - 当前 Reconciliation 仍以 mock 数据为主。
   - 后续可以读取或复用 OpenClaw `sessions.usage` 数据，生成 local usage 行，再与 cloud billing mock/真实记录对比。

3. **龙虾工作台 loading / error / retry UI**
   - `AppViewState` 已有 `cloudDeskLoading` / `cloudDeskError`，但页面尚未集中展示 loading、错误和重试入口。
   - 后续接真实 API 前建议补一个统一的 龙虾工作台状态 banner。

4. **Settings 配置进一步接入真实后端**
   - 当前 Settings 的 龙虾工作台配置已经可在浏览器 localStorage 中持久化。
   - 后续接真实后端时，需要把配置来源与权限校验、团队级配置、密钥存储边界梳理清楚。

5. **继续检查中文文案和 i18n**
   - 页面主体已经中文化，但部分导航 title / subtitle 在英文 locale 中仍是英文，这是正常的。
   - 如果目标是中文优先体验，应继续检查 zh-CN locale 与页面硬编码中文是否一致。

6. **全量测试环境**
   - 若需要跑完整 UI browser 测试，需要安装 Playwright 浏览器：

```bash
pnpm exec playwright install
```

### 18.3 推荐下一步执行顺序

推荐继续开发顺序：

1. 跑并维护 龙虾工作台 adapter 单测，确保 mock action 行为稳定。
2. 整理正式 API contract 或搭建最小 mock server。
3. 接入真实本地 Usage 数据做 mock 对账。
4. 补 龙虾工作台 loading / error / retry UI。
5. 最后再接真实 龙虾工作台 API、真实 Relay、真实支付、真实微信 / 短信服务。

P0 阶段仍然不要求真实支付、真实 Relay、真实微信登录或真实短信验证码。

### 18.4 给后续 agent 的注意事项

- 不要把 CLI 命令从 `openclaw` 改成 `clawdesk`。
- 不要从零重写控制台；继续基于 OpenClaw Control UI 二开。
- 不要绕过 `cloudDeskApi` 在页面里重新散落硬编码数据。
- 不要把 Local Usage 直接说成云端真实账单。
- 不要把 Gateway Token、Cloud Account Token、Relay API Key 混成一个概念。
- 改动后至少运行：

```bash
pnpm --dir ui exec vitest run --config vitest.config.ts \
  src/ui/cloud-desk-api.test.ts \
  src/ui/cloud-desk-navigation.test.ts \
  src/ui/views/cloud-desk.render.test.ts \
  src/ui/views/config-quick.test.ts

pnpm --dir ui build
```
