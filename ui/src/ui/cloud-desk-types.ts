// Control UI Cloud Desk data contracts.

export type CloudDeskAccount = {
  userId: string;
  email: string;
  phone: string | null;
  nickname: string;
  avatarUrl: string | null;
  title: string;
  plan: string;
  status: "active" | "inactive" | "suspended";
  loginAt: string;
};

export type CloudDeskBillingSummary = {
  balanceCredits: number;
  todaySpendCredits: number;
  monthSpendCredits: number;
  currency: "CREDITS";
};

export type CloudDeskTransaction = {
  transactionId: string;
  type: "credit" | "debit";
  source: string;
  amountCredits: number;
  balanceAfterCredits: number;
  description: string;
  relayRequestId?: string;
  sessionId?: string;
  model?: string;
  createdAt: string;
};

export type CloudDeskRechargeOrder = {
  orderId: string;
  status: "pending" | "paid" | "cancelled";
  amountCents: number;
  currency: "CNY";
  credits: number;
  paymentUrl: string;
  createdAt: string;
};

export type CloudDeskRelayConfig = {
  endpoint: string;
  apiKeyId: string | null;
  apiKeyMasked: string | null;
  apiKeyStatus: "active" | "missing" | "revoked";
  createdAt: string | null;
  lastUsedAt: string | null;
  lastTest: {
    status: "ok" | "failed" | "never";
    message: string;
    testedAt: string | null;
  };
};

export type CloudDeskModelRate = {
  model: string;
  provider: string;
  status: "available" | "disabled";
  inputCreditsPer1kTokens: number;
  outputCreditsPer1kTokens: number;
  contextWindow: number;
};

export type CloudDeskReconciliationRecord = {
  reconciliationId: string;
  status: "matched" | "local_only" | "cloud_only" | "mismatch";
  local: {
    sessionId: string;
    agentId: string;
    model: string;
    inputTokens: number;
    outputTokens: number;
    estimatedCost: number;
    createdAt: string;
  } | null;
  cloud: {
    relayRequestId: string;
    transactionId: string;
    model: string;
    inputTokens: number;
    outputTokens: number;
    chargedCredits: number;
    createdAt: string;
  } | null;
  difference: {
    tokenDiff: number;
    costDiffCredits: number;
  };
};

export type CloudDeskWorkspace = {
  workspaceId: string;
  name: string;
  slug: string;
  domain: string;
  ownerUserId: string;
  plan: string;
  memberLimit: number;
  createdAt: string;
};

export type CloudDeskMember = {
  memberId: string;
  userId: string;
  name: string;
  email: string;
  role: "owner" | "admin" | "member" | "viewer";
  status: "active" | "pending" | "disabled";
  lastActiveAt: string | null;
  joinedAt: string;
};

export type CloudDeskInvite = {
  inviteId: string;
  email: string;
  role: "admin" | "member" | "viewer";
  status: "pending" | "accepted" | "expired" | "revoked";
  invitedBy: string;
  inviteUrl: string;
  expiresAt: string;
  createdAt: string;
};

export type CloudDeskAuthMock = {
  mode: "login" | "register";
  email: string;
  phoneCountryCode: string;
  phone: string;
  smsCode: string;
  verificationCode: string;
  inviteCode: string;
  wechat: {
    qrCodeUrl: string;
    status: "waiting" | "scanned" | "confirmed" | "expired";
    expiresAt: string;
  };
};

export type CloudDeskSnapshot = {
  auth: CloudDeskAuthMock;
  account: CloudDeskAccount;
  workspace: CloudDeskWorkspace;
  members: CloudDeskMember[];
  invites: CloudDeskInvite[];
  billing: CloudDeskBillingSummary;
  transactions: CloudDeskTransaction[];
  rechargeOrders: CloudDeskRechargeOrder[];
  relay: CloudDeskRelayConfig;
  models: CloudDeskModelRate[];
  reconciliation: CloudDeskReconciliationRecord[];
};

export type CloudDeskSettings = {
  enabled: boolean;
  mockMode: boolean;
  apiBaseUrl: string;
  relayEndpoint: string;
};
