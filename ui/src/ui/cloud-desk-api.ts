// Control UI 龙虾工作台 mock adapter.
import { getSafeLocalStorage } from "../local-storage.ts";
import type { CloudDeskSettings, CloudDeskSnapshot } from "./cloud-desk-types.ts";

const CLOUD_DESK_SETTINGS_KEY = "openclaw.control.cloudDesk.settings.v1";

export const DEFAULT_CLOUD_DESK_SETTINGS: CloudDeskSettings = {
  enabled: true,
  mockMode: true,
  apiBaseUrl: "mock://lobster-workbench-api",
  relayEndpoint: "https://relay.hugeai.example/v1",
};

const now = "2026-06-07T09:00:00+08:00";

export const cloudDeskMockSnapshot: CloudDeskSnapshot = {
  auth: {
    mode: "login",
    email: "demo@hugeai.local",
    phoneCountryCode: "+86",
    phone: "13800138000",
    smsCode: "246810",
    verificationCode: "246810",
    inviteCode: "HUGEAI-TEAM-2026",
    wechat: {
      qrCodeUrl: "mock://wechat-qr/hugeai-lobster-workbench-demo",
      status: "waiting",
      expiresAt: "2026-06-07T09:05:00+08:00",
    },
  },
  account: {
    userId: "user_demo_001",
    email: "demo@hugeai.local",
    phone: "13800138000",
    nickname: "琥格AI Demo",
    avatarUrl: null,
    title: "创始人 / 工作区所有者",
    plan: "developer",
    status: "active",
    loginAt: now,
  },
  workspace: {
    workspaceId: "ws_hugeai_lobster_demo",
    name: "琥格AI 龙虾工作台",
    slug: "hugeai-lobster-workbench",
    domain: "hugeai.local",
    ownerUserId: "user_demo_001",
    plan: "developer",
    memberLimit: 12,
    createdAt: "2026-06-01T10:00:00+08:00",
  },
  members: [
    {
      memberId: "mem_001",
      userId: "user_demo_001",
      name: "琥格AI Demo",
      email: "demo@hugeai.local",
      role: "owner",
      status: "active",
      lastActiveAt: now,
      joinedAt: "2026-06-01T10:00:00+08:00",
    },
    {
      memberId: "mem_002",
      userId: "user_ops_002",
      name: "Ops Partner",
      email: "ops@example.com",
      role: "admin",
      status: "active",
      lastActiveAt: "2026-06-07T08:20:00+08:00",
      joinedAt: "2026-06-03T14:30:00+08:00",
    },
    {
      memberId: "mem_003",
      userId: "user_viewer_003",
      name: "Finance Viewer",
      email: "finance@example.com",
      role: "viewer",
      status: "active",
      lastActiveAt: "2026-06-06T18:10:00+08:00",
      joinedAt: "2026-06-05T09:10:00+08:00",
    },
  ],
  invites: [
    {
      inviteId: "inv_001",
      email: "engineer@example.com",
      role: "member",
      status: "pending",
      invitedBy: "琥格AI Demo",
      inviteUrl: "https://app.clawdesk.ai/invite/HUGEAI-TEAM-2026",
      expiresAt: "2026-06-14T09:00:00+08:00",
      createdAt: now,
    },
    {
      inviteId: "inv_002",
      email: "advisor@example.com",
      role: "viewer",
      status: "expired",
      invitedBy: "琥格AI Demo",
      inviteUrl: "https://app.clawdesk.ai/invite/CLAW-ADVISOR-OLD",
      expiresAt: "2026-06-05T09:00:00+08:00",
      createdAt: "2026-05-29T09:00:00+08:00",
    },
  ],
  billing: {
    balanceCredits: 128_640,
    todaySpendCredits: 1_280,
    monthSpendCredits: 36_420,
    currency: "CREDITS",
  },
  transactions: [
    {
      transactionId: "txn_1003",
      type: "debit",
      source: "relay_call",
      amountCredits: -320,
      balanceAfterCredits: 128_640,
      description: "gpt-4.1 relay call",
      relayRequestId: "req_7319",
      sessionId: "session_main_42",
      model: "gpt-4.1",
      createdAt: "2026-06-07T08:41:12+08:00",
    },
    {
      transactionId: "txn_1002",
      type: "debit",
      source: "relay_call",
      amountCredits: -180,
      balanceAfterCredits: 128_960,
      description: "claude-3.5-sonnet relay call",
      relayRequestId: "req_7318",
      sessionId: "session_design_7",
      model: "claude-3.5-sonnet",
      createdAt: "2026-06-07T08:12:03+08:00",
    },
    {
      transactionId: "txn_1001",
      type: "credit",
      source: "recharge_order",
      amountCredits: 50_000,
      balanceAfterCredits: 129_140,
      description: "Mock recharge order paid",
      createdAt: "2026-06-06T21:30:00+08:00",
    },
  ],
  rechargeOrders: [
    {
      orderId: "order_mock_001",
      status: "pending",
      amountCents: 5_000,
      currency: "CNY",
      credits: 50_000,
      paymentUrl: "mock://payment/order_mock_001",
      createdAt: now,
    },
  ],
  relay: {
    endpoint: "https://relay.hugeai.example/v1",
    apiKeyId: "rak_demo_001",
    apiKeyMasked: "cd-relay-****7KpQ",
    apiKeyStatus: "active",
    createdAt: "2026-06-01T10:00:00+08:00",
    lastUsedAt: "2026-06-07T08:41:12+08:00",
    lastTest: {
      status: "ok",
      message: "Mock connection succeeded in 184ms",
      testedAt: "2026-06-07T08:50:00+08:00",
    },
  },
  models: [
    {
      model: "gpt-4.1",
      provider: "openai",
      status: "available",
      inputCreditsPer1kTokens: 10,
      outputCreditsPer1kTokens: 30,
      contextWindow: 128_000,
    },
    {
      model: "claude-3.5-sonnet",
      provider: "anthropic",
      status: "available",
      inputCreditsPer1kTokens: 12,
      outputCreditsPer1kTokens: 36,
      contextWindow: 200_000,
    },
    {
      model: "gemini-2.5-pro",
      provider: "google",
      status: "available",
      inputCreditsPer1kTokens: 8,
      outputCreditsPer1kTokens: 24,
      contextWindow: 1_000_000,
    },
  ],
  reconciliation: [
    {
      reconciliationId: "rec_001",
      status: "matched",
      local: {
        sessionId: "session_main_42",
        agentId: "main",
        model: "gpt-4.1",
        inputTokens: 8_120,
        outputTokens: 1_820,
        estimatedCost: 0.137,
        createdAt: "2026-06-07T08:41:11+08:00",
      },
      cloud: {
        relayRequestId: "req_7319",
        transactionId: "txn_1003",
        model: "gpt-4.1",
        inputTokens: 8_120,
        outputTokens: 1_820,
        chargedCredits: 320,
        createdAt: "2026-06-07T08:41:12+08:00",
      },
      difference: { tokenDiff: 0, costDiffCredits: 0 },
    },
    {
      reconciliationId: "rec_002",
      status: "mismatch",
      local: {
        sessionId: "session_design_7",
        agentId: "designer",
        model: "claude-3.5-sonnet",
        inputTokens: 5_200,
        outputTokens: 1_040,
        estimatedCost: 0.092,
        createdAt: "2026-06-07T08:12:02+08:00",
      },
      cloud: {
        relayRequestId: "req_7318",
        transactionId: "txn_1002",
        model: "claude-3.5-sonnet",
        inputTokens: 5_350,
        outputTokens: 1_040,
        chargedCredits: 180,
        createdAt: "2026-06-07T08:12:03+08:00",
      },
      difference: { tokenDiff: 150, costDiffCredits: 6 },
    },
    {
      reconciliationId: "rec_003",
      status: "local_only",
      local: {
        sessionId: "session_local_9",
        agentId: "main",
        model: "local/mock-model",
        inputTokens: 1_200,
        outputTokens: 440,
        estimatedCost: 0,
        createdAt: "2026-06-07T07:55:00+08:00",
      },
      cloud: null,
      difference: { tokenDiff: 1_640, costDiffCredits: 0 },
    },
  ],
};

function cloneSnapshot(): CloudDeskSnapshot {
  return structuredClone(cloudDeskMockSnapshot);
}

function timestamp() {
  return new Date().toISOString();
}

let rechargeOrderCounter = cloudDeskMockSnapshot.rechargeOrders.length + 1;
let relayKeyCounter = 2;
let inviteCounter = cloudDeskMockSnapshot.invites.length + 1;
let cloudDeskSettingsMemory = { ...DEFAULT_CLOUD_DESK_SETTINGS };

function normalizeCloudDeskSettings(value: unknown): CloudDeskSettings {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return { ...DEFAULT_CLOUD_DESK_SETTINGS };
  }
  const raw = value as Partial<CloudDeskSettings>;
  return {
    enabled: typeof raw.enabled === "boolean" ? raw.enabled : DEFAULT_CLOUD_DESK_SETTINGS.enabled,
    mockMode:
      typeof raw.mockMode === "boolean" ? raw.mockMode : DEFAULT_CLOUD_DESK_SETTINGS.mockMode,
    apiBaseUrl:
      typeof raw.apiBaseUrl === "string" && raw.apiBaseUrl.trim()
        ? raw.apiBaseUrl.trim()
        : DEFAULT_CLOUD_DESK_SETTINGS.apiBaseUrl,
    relayEndpoint:
      typeof raw.relayEndpoint === "string" && raw.relayEndpoint.trim()
        ? raw.relayEndpoint.trim()
        : DEFAULT_CLOUD_DESK_SETTINGS.relayEndpoint,
  };
}

export function loadCloudDeskSettings(): CloudDeskSettings {
  try {
    const raw = getSafeLocalStorage()?.getItem(CLOUD_DESK_SETTINGS_KEY);
    return raw ? normalizeCloudDeskSettings(JSON.parse(raw)) : { ...cloudDeskSettingsMemory };
  } catch {
    return { ...cloudDeskSettingsMemory };
  }
}

export function saveCloudDeskSettings(next: CloudDeskSettings): CloudDeskSettings {
  const normalized = normalizeCloudDeskSettings(next);
  cloudDeskSettingsMemory = { ...normalized };
  try {
    getSafeLocalStorage()?.setItem(CLOUD_DESK_SETTINGS_KEY, JSON.stringify(normalized));
  } catch {
    // Best effort: settings still apply in memory for the current render.
  }
  return normalized;
}

export function resetCloudDeskSettings(): CloudDeskSettings {
  cloudDeskSettingsMemory = { ...DEFAULT_CLOUD_DESK_SETTINGS };
  try {
    getSafeLocalStorage()?.removeItem(CLOUD_DESK_SETTINGS_KEY);
  } catch {
    // Best effort.
  }
  return { ...DEFAULT_CLOUD_DESK_SETTINGS };
}

export const cloudDeskApi = {
  getSettings(): CloudDeskSettings {
    return loadCloudDeskSettings();
  },
  saveSettings(next: CloudDeskSettings): CloudDeskSettings {
    return saveCloudDeskSettings(next);
  },
  resetSettings(): CloudDeskSettings {
    return resetCloudDeskSettings();
  },
  getCachedSnapshot(): CloudDeskSnapshot {
    return cloneSnapshot();
  },
  async getSnapshot(): Promise<CloudDeskSnapshot> {
    return cloneSnapshot();
  },
  async login() {
    cloudDeskMockSnapshot.account.status = "active";
    cloudDeskMockSnapshot.account.loginAt = timestamp();
    return structuredClone(cloudDeskMockSnapshot.account);
  },
  async logout() {
    cloudDeskMockSnapshot.account.status = "inactive";
    return { ok: true };
  },
  async refreshAccount() {
    cloudDeskMockSnapshot.account.loginAt = timestamp();
    return structuredClone(cloudDeskMockSnapshot.account);
  },
  async createRechargeOrder() {
    const orderId = `order_mock_${String(rechargeOrderCounter++).padStart(3, "0")}`;
    const order = {
      orderId,
      status: "pending" as const,
      amountCents: 5_000,
      currency: "CNY" as const,
      credits: 50_000,
      paymentUrl: `mock://payment/${orderId}`,
      createdAt: timestamp(),
    };
    cloudDeskMockSnapshot.rechargeOrders = [order, ...cloudDeskMockSnapshot.rechargeOrders];
    return structuredClone(order);
  },
  async markLatestRechargePaid() {
    const order = cloudDeskMockSnapshot.rechargeOrders[0];
    if (!order) return null;
    order.status = "paid";
    cloudDeskMockSnapshot.billing.balanceCredits += order.credits;
    cloudDeskMockSnapshot.transactions = [
      {
        transactionId: `txn_mock_${Date.now()}`,
        type: "credit",
        source: "recharge_order",
        amountCredits: order.credits,
        balanceAfterCredits: cloudDeskMockSnapshot.billing.balanceCredits,
        description: "Mock 充值订单已支付",
        createdAt: timestamp(),
      },
      ...cloudDeskMockSnapshot.transactions,
    ];
    return structuredClone(order);
  },
  async testRelay() {
    cloudDeskMockSnapshot.relay.lastTest = {
      status: "ok",
      message: `Mock 连接成功，耗时 ${Math.floor(120 + Math.random() * 160)}ms`,
      testedAt: timestamp(),
    };
    return structuredClone(cloudDeskMockSnapshot.relay.lastTest);
  },
  async createRelayApiKey() {
    cloudDeskMockSnapshot.relay.apiKeyId = `rak_mock_${relayKeyCounter++}`;
    cloudDeskMockSnapshot.relay.apiKeyMasked = `cd-relay-****${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
    cloudDeskMockSnapshot.relay.apiKeyStatus = "active";
    cloudDeskMockSnapshot.relay.createdAt = timestamp();
    return structuredClone(cloudDeskMockSnapshot.relay);
  },
  async revokeRelayApiKey() {
    cloudDeskMockSnapshot.relay.apiKeyStatus = "revoked";
    return structuredClone(cloudDeskMockSnapshot.relay);
  },
  async resetRelayApiKey() {
    return this.createRelayApiKey();
  },
  async createInvite() {
    const invite = {
      inviteId: `inv_mock_${String(inviteCounter++).padStart(3, "0")}`,
      email: `new-user-${inviteCounter}@example.com`,
      role: "member" as const,
      status: "pending" as const,
      invitedBy: cloudDeskMockSnapshot.account.nickname,
      inviteUrl: `https://app.clawdesk.ai/invite/MOCK-${Date.now()}`,
      expiresAt: new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString(),
      createdAt: timestamp(),
    };
    cloudDeskMockSnapshot.invites = [invite, ...cloudDeskMockSnapshot.invites];
    return structuredClone(invite);
  },
  async acceptInvite() {
    const invite = cloudDeskMockSnapshot.invites.find((item) => item.status === "pending");
    if (invite) invite.status = "accepted";
    return { ok: true, workspace: structuredClone(cloudDeskMockSnapshot.workspace) };
  },
  async syncLocalUsage() {
    cloudDeskMockSnapshot.reconciliation = cloudDeskMockSnapshot.reconciliation.map((item) =>
      item.status === "mismatch"
        ? { ...item, status: "matched" as const, difference: { tokenDiff: 0, costDiffCredits: 0 } }
        : item,
    );
    return structuredClone(cloudDeskMockSnapshot.reconciliation);
  },
};
