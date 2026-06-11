# 龙虾工作台已实现功能清单

本文记录 `docs/cloud-desk/` 当前对应代码里已经落地的 Cloud Desk 功能点。

本文只描述“已经实现了什么”，不负责定义平台级方向，也不代替需求文档。

阅读和使用原则：

- 如果你要理解平台级目标、系统边界、MVP 闭环，先看 `../../../需求澄清文档.md`
- 如果你要理解 Cloud Desk 子项目页面规划和接口契约，先看 `./requirements.md`
- 如果你要判断当前代码里到底已经实现了什么，以本文和实际代码为准

后续 agent 开始工作前，建议先读 `../../../AGENTS.md`

原则：

- 只写当前仓库里已经实现的能力。
- 以 `ui/src/ui/*` 当前代码为准，不把需求目标当成已完成事实。
- 后续新增或下线功能时，同步更新本文。

## 1. 当前范围

Cloud Desk 当前仍是 OpenClaw Control UI 内的一组二开页面和状态，不是独立应用，也没有独立后端接入。

当前实现形态：

- 前端页面运行在现有 Control UI 中。
- 数据统一经 `cloudDeskApi` adapter 提供。
- 默认使用本地 mock 数据和 mock 行为。
- Cloud Desk 设置保存在浏览器 `localStorage`。
- 原有 OpenClaw Chat、Sessions、Usage、Config 等页面仍保留。

主要代码入口：

- `ui/src/ui/navigation.ts`
- `ui/src/ui/app.ts`
- `ui/src/ui/app-settings.ts`
- `ui/src/ui/cloud-desk-api.ts`
- `ui/src/ui/cloud-desk-types.ts`
- `ui/src/ui/views/cloud-*.ts`

## 2. 导航与路由

当前已经在 Control UI 左侧导航中增加独立的 `cloudDesk` 分组。

已接入页面：

1. `cloudAuth`
2. `cloudProfile`
3. `cloudMembers`
4. `cloudAccount`
5. `cloudBilling`
6. `cloudRelay`
7. `cloudReconciliation`

当前路由：

- `/cloud/auth`
- `/cloud/profile`
- `/cloud/members`
- `/cloud/account`
- `/cloud/billing`
- `/cloud/relay`
- `/cloud/reconciliation`

代码位置：

- `ui/src/ui/navigation.ts`
- `ui/src/ui/cloud-desk-navigation.test.ts`

## 3. 登录态与受保护页面跳转

当前已经实现 Cloud Desk 页面级登录拦截。

行为如下：

1. 当账户未登录时，访问受保护页面会被重定向到 `cloudAuth`。
2. 当前受保护页面包括：
   - `cloudAccount`
   - `cloudBilling`
   - `cloudRelay`
   - `cloudReconciliation`
3. 跳转到 `cloudAuth` 前会记住原始目标页面。
4. 登录成功后，如果存在待跳转目标，则自动回跳到原目标页面。
5. 如果已登录再进入 `cloudAuth`，会直接回到待跳转目标；若无待跳转目标，则进入 `cloudAccount`。
6. 如果登录态失效或退出登录，当前不在 `cloudAuth` 时会切回 `cloudAuth`。

本次新增落地：

- 受保护标签页跳到登录页。
- 登录成功后恢复原目标标签页。
- `AppViewState` 增加 `pendingCloudDeskRedirectTab` 保存回跳目标。

代码位置：

- `ui/src/ui/app-settings.ts`
- `ui/src/ui/app-view-state.ts`
- `ui/src/ui/app.ts`
- `ui/src/ui/app-settings.refresh-active-tab.node.test.ts`

## 4. Overview 入口

当前 Overview 已增加一个 龙虾工作台 卡片区。

已展示内容：

1. 套餐
2. 余额
3. Relay API Key / Relay endpoint 摘要
4. 对账异常数
5. 账户状态、Relay Key 状态、最近 Relay 测试状态
6. “打开龙虾工作台” 入口按钮

说明：

- 当前 Overview 卡片直接从 `cloudDeskApi.getCachedSnapshot()` 读取 mock 快照。
- 文案明确这是基于 OpenClaw 二开的 Mock 预览。

代码位置：

- `ui/src/ui/views/overview.ts`

## 5. 页面实现

### 5.1 登录页 `cloudAuth`

当前已实现：

1. 手机号验证码登录 Mock。
2. 微信扫码登录 Mock。
3. 邀请码 / 邀请链接输入区。
4. 验证码倒计时、手机号格式校验、验证码错误提示。
5. 微信二维码等待、扫码、确认、过期四种状态预览。
6. 邀请接受按钮走 mock action。
7. 登录成功后调用 `cloudDeskApi.login()` 刷新全局 Cloud Desk snapshot。

当前限制：

- 仍是前端 mock 登录，不请求真实短信、微信或后端 session/JWT。

代码位置：

- `ui/src/ui/views/cloud-auth.ts`

### 5.2 资料页 `cloudProfile`

当前已实现：

1. 用户资料展示。
2. 工作区基础信息展示。
3. 席位占用摘要。
4. 保存资料 Mock。
5. 刷新账户 Mock。
6. 退出 / 禁用账户 Mock。

代码位置：

- `ui/src/ui/views/cloud-profile.ts`

### 5.3 成员页 `cloudMembers`

当前已实现：

1. 成员数、待处理邀请数摘要。
2. 创建邀请 Mock。
3. 邀请链接、角色、过期时间展示。
4. 成员列表表格。
5. 邀请列表表格。
6. 复制、重发、撤销等按钮占位。

说明：

- 当前只有 `createInvite()` 和 `acceptInvite()` 具备 adapter 行为。
- 复制、发送邮件、重发、撤销、编辑角色目前主要是 UI 占位。

代码位置：

- `ui/src/ui/views/cloud-members.ts`

### 5.4 云账户页 `cloudAccount`

当前已实现：

1. 账户身份摘要卡片。
2. 套餐、状态、余额摘要。
3. 账户基础字段只读展示。
4. 状态 pill 展示账户状态和 Relay Key 状态。
5. 模拟登录、刷新账户、模拟退出按钮。

代码位置：

- `ui/src/ui/views/cloud-account.ts`

### 5.5 云账单页 `cloudBilling`

当前已实现：

1. 当前余额、今日消耗、本月消耗摘要。
2. 最近交易列表表格。
3. 充值订单列表。
4. 创建充值订单 Mock。
5. 模拟最新订单支付成功。

当前 adapter 会同步更新：

1. 充值订单状态。
2. 余额。
3. 新增一条 `credit` 交易流水。

代码位置：

- `ui/src/ui/views/cloud-billing.ts`
- `ui/src/ui/cloud-desk-api.ts`

### 5.6 Relay 页 `cloudRelay`

当前已实现：

1. Relay endpoint 摘要。
2. 脱敏 API Key 摘要。
3. 最近测试结果摘要。
4. 创建 API Key Mock。
5. 重置 API Key Mock。
6. 吊销 API Key Mock。
7. 测试 Relay 连接 Mock。
8. 可用模型与费率表格。

当前 adapter 会同步更新：

1. `apiKeyId`
2. `apiKeyMasked`
3. `apiKeyStatus`
4. `createdAt`
5. `lastTest`

代码位置：

- `ui/src/ui/views/cloud-relay.ts`
- `ui/src/ui/cloud-desk-api.ts`

### 5.7 对账页 `cloudReconciliation`

当前已实现：

1. 本地用量行数摘要。
2. 云账单行数摘要。
3. 异常项统计。
4. 本地用量 vs 云账单对账表格。
5. `matched` / `mismatch` / `local_only` / `cloud_only` 状态展示入口。
6. “同步本地用量 Mock” 操作。

当前 adapter 行为：

- `syncLocalUsage()` 会把现有 mock 中的 `mismatch` 项修正为 `matched`，并把差异归零。

代码位置：

- `ui/src/ui/views/cloud-reconciliation.ts`
- `ui/src/ui/cloud-desk-api.ts`

## 6. 设置区

当前 Config 快捷设置区已增加 龙虾工作台设置 卡片。

当前可配置项：

1. `enabled`
2. `mockMode`
3. `apiBaseUrl`
4. `relayEndpoint`

当前可执行操作：

1. 保存龙虾工作台配置。
2. 恢复默认配置。
3. 清除龙虾工作台登录状态 Mock。

当前行为：

- 配置保存在浏览器 `localStorage`。
- 保存和重置后会更新界面提示文案。
- 清除登录状态会调用 `cloudDeskApi.logout()`。

代码位置：

- `ui/src/ui/views/config-quick.ts`
- `ui/src/ui/app.ts`
- `ui/src/ui/cloud-desk-api.ts`

## 7. 数据与 adapter

当前已经有统一的 Cloud Desk adapter 和数据契约。

### 7.1 类型定义

已定义类型包括：

1. `CloudDeskAccount`
2. `CloudDeskBillingSummary`
3. `CloudDeskTransaction`
4. `CloudDeskRechargeOrder`
5. `CloudDeskRelayConfig`
6. `CloudDeskModelRate`
7. `CloudDeskReconciliationRecord`
8. `CloudDeskWorkspace`
9. `CloudDeskMember`
10. `CloudDeskInvite`
11. `CloudDeskAuthMock`
12. `CloudDeskSnapshot`
13. `CloudDeskSettings`

代码位置：

- `ui/src/ui/cloud-desk-types.ts`

### 7.2 mock snapshot

当前 mock snapshot 已覆盖：

1. 登录页 mock 数据
2. 账户信息
3. 工作区信息
4. 成员
5. 邀请
6. 余额和消耗
7. 交易流水
8. 充值订单
9. Relay 配置与最近测试
10. 模型费率
11. 对账记录

代码位置：

- `ui/src/ui/cloud-desk-api.ts`

### 7.3 adapter 方法

当前 adapter 已实现的方法包括：

1. `getCachedSnapshot()`
2. `getSnapshot()`
3. `login()`
4. `logout()`
5. `refreshAccount()`
6. `createRechargeOrder()`
7. `markLatestRechargePaid()`
8. `testRelay()`
9. `createRelayApiKey()`
10. `revokeRelayApiKey()`
11. `resetRelayApiKey()`
12. `createInvite()`
13. `acceptInvite()`
14. `syncLocalUsage()`
15. `getSettings()`
16. `saveSettings()`
17. `resetSettings()`

说明：

- 当前页面不应绕过 `cloudDeskApi` 散落读取或修改 Cloud Desk 数据。
- 真实后端接入时，优先延续现有 adapter 边界，不直接把网络请求散到视图层。

代码位置：

- `ui/src/ui/cloud-desk-api.ts`

## 8. App 状态集成

当前 Cloud Desk 状态已经挂入 Control UI 的主 App 状态。

已接入字段：

1. `cloudDeskSnapshot`
2. `cloudDeskLoading`
3. `cloudDeskError`
4. `pendingCloudDeskRedirectTab`
5. `cloudDeskSettingsDraft`
6. `cloudDeskSettingsMessage`

已接入行为：

1. 统一 `runCloudDeskAction()` 包装 Cloud Desk action。
2. action 执行后刷新最新 snapshot。
3. 登录和退出动作会联动当前标签页跳转。

代码位置：

- `ui/src/ui/app.ts`
- `ui/src/ui/app-view-state.ts`

## 9. 本地 Usage 的当前关系

当前 Usage 页面已经明确区分本地用量和 Cloud Desk 云端账单概念。

当前状态：

- OpenClaw 原生 Usage 仍是本地 Usage。
- Cloud Desk 的云端账单、Relay 扣费和对账在独立页面展示。
- 文案已说明 Local Usage 不等于真实云端账单。

代码位置：

- `ui/src/ui/views/usage.ts`
- `ui/src/ui/views/cloud-reconciliation.ts`

## 10. 当前验证状态

当前已存在的验证主要包括：

1. Cloud Desk 导航与路由测试。
2. Cloud Desk adapter 行为测试。
3. Cloud Desk 页面渲染 smoke test。
4. Cloud Desk 受保护页面登录跳转测试。

对应测试文件：

- `ui/src/ui/cloud-desk-navigation.test.ts`
- `ui/src/ui/cloud-desk-api.test.ts`
- `ui/src/ui/views/cloud-desk.render.test.ts`
- `ui/src/ui/app-settings.refresh-active-tab.node.test.ts`

## 11. 当前未落地或仅占位的部分

这些能力在当前代码里还没有完整落地：

1. 真实 Cloud Desk 后端 API。
2. 真实短信验证码发送与校验。
3. 真实微信扫码登录。
4. 真实支付和充值回调。
5. 真实 Relay 转发、密钥发放和模型同步。
6. 成员编辑、重发邀请、撤销邀请、复制链接等完整行为。
7. 集中的 Cloud Desk loading / error / retry banner。

这些项仍应视为后续工作，不应在对外描述中当成已完成能力。
