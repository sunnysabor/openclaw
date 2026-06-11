# 龙虾工作台 / Cloud Desk

龙虾工作台是基于 OpenClaw Control UI 的二次开发方向：在 OpenClaw 原有本地 Gateway、Control UI、Agent、Session、Usage、Settings 等能力基础上，新增云账户、余额、Relay API Key、模型中转计费、账单与对账能力。

一句话：

> 龙虾工作台 = OpenClaw Control UI + 云账户 / 余额 / Relay 中转 / 账单对账层。

## 当前维护位置

龙虾工作台不再作为独立 `CLAW-DESK` 项目维护；需求文档和二开说明统一放在 OpenClaw 源码仓库中，避免两个项目之间反复同步。

补充说明：

当前 `docs/cloud-desk/` 不是唯一文档入口。仓库根目录还维护了平台级主需求文档和 agent 协作入口文件。

从当前目录出发，后续如需理解整个平台级目标、系统边界、MVP 闭环和文档维护规则，还应继续阅读：

- `../../../需求澄清文档.md`
- `../../../AGENTS.md`

当前主文档：

- [需求澄清文档](./requirements.md)
- [当前已实现功能清单](./implemented.md)

## 文档分工

- `README.md`
  - Cloud Desk 文档目录入口。
- `requirements.md`
  - 产品定位、MVP 范围、边界、后续规划、接口契约草案。
- `implemented.md`
  - 以当前代码为准的已实现能力、页面、交互、mock adapter、设置持久化和验证状态。
- `../../../需求澄清文档.md`
  - 平台级产品方向、系统边界、核心对象定义、云端平台与 Token 中转站分工。
- `../../../AGENTS.md`
  - 后续 agent 的阅读顺序、协作约束和文档同步 checklist。

## 建议阅读顺序

如果你是第一次接手这个方向，建议按下面顺序读：

1. `../../../AGENTS.md`
2. `../../../需求澄清文档.md`
3. `./README.md`
4. `./requirements.md`
5. `./implemented.md`

如果任务直接涉及 OpenClaw UI 改造、页面判断、路由和 mock 行为，以 `implemented.md` 和实际代码为准。

## 当前实现摘要

当前仓库里已经落地的 Cloud Desk 能力包括：

1. Control UI 新增独立的 龙虾工作台 导航分组。
2. 已接入 `cloudAuth`、`cloudProfile`、`cloudMembers`、`cloudAccount`、`cloudBilling`、`cloudRelay`、`cloudReconciliation` 七个页面。
3. Overview 已增加 龙虾工作台 状态卡片入口。
4. Config 快捷设置区已增加 龙虾工作台设置卡片。
5. 已有统一 `cloudDeskApi` mock adapter、`CloudDeskSnapshot` / `CloudDeskSettings` 类型定义和本地 `localStorage` 持久化。
6. 已实现 Cloud Desk 受保护页面的登录拦截和登录后回跳。

详细能力、限制和代码入口见 [当前已实现功能清单](./implemented.md)。

## MVP 范围

第一版 MVP 聚焦：

1. 在 OpenClaw Control UI 中增加龙虾工作台导航分组。
2. 增加 Account / Billing / Relay / Reconciliation 页面。
3. 在 Dashboard / Overview 中增加龙虾工作台状态卡片。
4. 使用 mock adapter 展示账户、余额、交易流水、Relay API Key、模型列表和对账结果。
5. 定义龙虾工作台 API contract，方便后续独立后端实现接口。
6. 复用 OpenClaw 本地 Usage 能力，并明确标识为 Local Usage / 本地用量。
7. 确保原 OpenClaw Chat、Sessions、Usage、Settings 等功能不被破坏。

## 暂不做

MVP 暂不做：

- 真实支付。
- 真实充值订单。
- 完整生产级 OpenAI-compatible Relay。
- 团队 / 企业权限。
- 技能市场交易。
- 桌面端壳。
- 从零重写 OpenClaw。
