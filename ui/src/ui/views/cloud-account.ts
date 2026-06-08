// Control UI view renders Cloud Desk account screen content.
import { html } from "lit";
import { cloudDeskApi } from "../cloud-desk-api.ts";
import type { CloudDeskSnapshot } from "../cloud-desk-types.ts";
import {
  formatCredits,
  renderMetricCard,
  renderMockNotice,
  statusPill,
} from "./cloud-desk-shared.ts";

export function renderCloudAccount(
  snapshot: CloudDeskSnapshot = cloudDeskApi.getCachedSnapshot(),
  runAction?: (action: () => Promise<unknown>) => Promise<void>,
) {
  const { account, billing, relay } = snapshot;
  const run = runAction ?? ((action: () => Promise<unknown>) => action());
  return html`
    <div class="stack">
      ${renderMockNotice()}
      <div class="dashboard-grid">
        ${renderMetricCard("云账户", account.nickname, `${account.email} · ${account.userId}`)}
        ${renderMetricCard("套餐", account.plan, `状态：${account.status}`)}
        ${renderMetricCard("余额", formatCredits(billing.balanceCredits), "Cloud Desk 点数")}
      </div>
      <section class="card">
        <div class="card-title">云账户</div>
        <div class="settings-grid" style="margin-top: 16px">
          <label>用户 ID<input readonly .value=${account.userId} /></label>
          <label>邮箱<input readonly .value=${account.email} /></label>
          <label>手机号<input readonly .value=${account.phone ?? "未绑定"} /></label>
          <label>昵称<input readonly .value=${account.nickname} /></label>
          <label>套餐<input readonly .value=${account.plan} /></label>
          <label>登录时间<input readonly .value=${account.loginAt} /></label>
        </div>
        <div style="margin-top: 16px; display: flex; gap: 8px; flex-wrap: wrap">
          ${statusPill(account.status)} ${statusPill(relay.apiKeyStatus)}
        </div>
      </section>
      <section class="card">
        <div class="card-title">Mock 操作</div>
        <div class="card-sub">P0 阶段按钮用于前端预览，不请求真实后端。</div>
        <div style="margin-top: 12px; display: flex; gap: 8px; flex-wrap: wrap">
          <button
            class="btn primary"
            @click=${async () => {
              await run(() => cloudDeskApi.login());
            }}
          >
            模拟登录
          </button>
          <button
            class="btn"
            @click=${async () => {
              await run(() => cloudDeskApi.refreshAccount());
            }}
          >
            刷新账户
          </button>
          <button
            class="btn danger"
            @click=${async () => {
              await run(() => cloudDeskApi.logout());
            }}
          >
            模拟退出
          </button>
        </div>
      </section>
    </div>
  `;
}
