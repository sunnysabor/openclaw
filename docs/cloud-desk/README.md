# 龙虾工作台 / Cloud Desk

龙虾工作台是基于 OpenClaw Control UI 的二次开发方向：在 OpenClaw 原有本地 Gateway、Control UI、Agent、Session、Usage、Settings 等能力基础上，新增云账户、余额、Relay API Key、模型中转计费、账单与对账能力。

一句话：

> 龙虾工作台 = OpenClaw Control UI + 云账户 / 余额 / Relay 中转 / 账单对账层。

## 当前维护位置

龙虾工作台不再作为独立 `CLAW-DESK` 项目维护；需求文档和二开说明统一放在 OpenClaw 源码仓库中，避免两个项目之间反复同步。

当前主文档：

- [需求澄清文档](./requirements.md)

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
