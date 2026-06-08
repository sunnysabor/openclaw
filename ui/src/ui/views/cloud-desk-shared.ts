// Shared Cloud Desk UI helpers.
import { html, type TemplateResult } from "lit";

const STATUS_LABELS: Record<string, string> = {
  active: "已启用",
  inactive: "未启用",
  suspended: "已暂停",
  missing: "未创建",
  revoked: "已吊销",
  ok: "正常",
  failed: "失败",
  never: "未测试",
  pending: "待处理",
  paid: "已支付",
  cancelled: "已取消",
  debit: "扣费",
  credit: "充值",
  available: "可用",
  disabled: "已禁用",
  matched: "已匹配",
  mismatch: "不一致",
  local_only: "仅本地",
  cloud_only: "仅云端",
  owner: "所有者",
  admin: "管理员",
  member: "成员",
  viewer: "观察者",
  accepted: "已接受",
  expired: "已过期",
  developer: "开发者版",
  waiting: "等待扫码",
  scanned: "已扫码，待手机确认",
  confirmed: "登录成功",
};

export function formatCredits(credits: number): string {
  return `${(credits / 100).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} 点`;
}

export function formatSignedCredits(credits: number): string {
  const sign = credits > 0 ? "+" : "";
  return `${sign}${formatCredits(credits)}`;
}

export function statusLabel(status: string): string {
  return STATUS_LABELS[status] ?? status;
}

export function requestCloudDeskUpdate() {
  (
    document.querySelector("openclaw-app") as unknown as { requestUpdate?: () => void } | null
  )?.requestUpdate?.();
}

export function renderMockNotice(): TemplateResult {
  return html`
    <section
      class="card"
      style="border-style: dashed; border-color: color-mix(in srgb, var(--accent, #7c3aed) 45%, transparent)"
    >
      <div class="card-title">Cloud Desk Mock 模式</div>
      <div class="card-sub">
        P0 前端预览。当前数据来自本地 mock adapter，暂未请求真实 Cloud Desk API。
      </div>
    </section>
  `;
}

export function renderMetricCard(label: string, value: string, sub?: string): TemplateResult {
  return html`
    <section class="card">
      <div class="card-sub">${label}</div>
      <div style="font-size: 28px; font-weight: 700; margin-top: 8px">${value}</div>
      ${sub ? html`<div class="muted" style="margin-top: 8px">${sub}</div>` : ""}
    </section>
  `;
}

export function statusPill(status: string): TemplateResult {
  const danger = ["failed", "revoked", "suspended", "mismatch", "expired", "cancelled"].includes(
    status,
  );
  const warn = [
    "pending",
    "local_only",
    "cloud_only",
    "missing",
    "waiting",
    "scanned",
    "never",
  ].includes(status);
  return html`<span class="pill ${danger ? "danger" : warn ? "warning" : "success"}"
    >${statusLabel(status)}</span
  >`;
}
