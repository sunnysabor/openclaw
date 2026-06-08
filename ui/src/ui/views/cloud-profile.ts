// Control UI view renders 琥格AI profile/workspace screen content.
import { html } from "lit";
import { cloudDeskApi } from "../cloud-desk-api.ts";
import type { CloudDeskSnapshot } from "../cloud-desk-types.ts";
import { renderMetricCard, renderMockNotice, statusPill } from "./cloud-desk-shared.ts";

export function renderCloudProfile(
  snapshot: CloudDeskSnapshot = cloudDeskApi.getCachedSnapshot(),
  runAction?: (action: () => Promise<unknown>) => Promise<void>,
) {
  const { account, workspace, members, invites } = snapshot;
  const run = runAction ?? ((action: () => Promise<unknown>) => action());
  const usedSeats = members.length + invites.filter((invite) => invite.status === "pending").length;
  return html`
    <div class="stack">
      ${renderMockNotice()}
      <div class="dashboard-grid">
        ${renderMetricCard("资料", account.nickname, account.title)}
        ${renderMetricCard("工作区", workspace.name, workspace.domain)}
        ${renderMetricCard(
          "席位",
          `${usedSeats}/${workspace.memberLimit}`,
          "活跃成员 + 待接受邀请",
        )}
      </div>
      <section class="card">
        <div class="section-header">
          <div>
            <div class="card-title">用户资料</div>
            <div class="card-sub">展示在 琥格AI 云服务与 Relay 账单中的个人身份。</div>
          </div>
          ${statusPill(account.status)}
        </div>
        <div class="settings-grid" style="margin-top: 16px">
          <label>显示名称<input .value=${account.nickname} /></label>
          <label>职位<input .value=${account.title} /></label>
          <label>邮箱<input readonly .value=${account.email} /></label>
          <label>手机号<input .value=${account.phone ?? ""} placeholder="稍后绑定手机号" /></label>
          <label>用户 ID<input readonly .value=${account.userId} /></label>
          <label>最近登录<input readonly .value=${account.loginAt} /></label>
        </div>
        <div style="margin-top: 16px; display: flex; gap: 8px; flex-wrap: wrap">
          <button
            class="btn primary"
            @click=${async () => {
              await run(() => cloudDeskApi.refreshAccount());
            }}
          >
            保存资料 Mock
          </button>
          <button class="btn">修改邮箱 Mock</button>
          <button
            class="btn danger"
            @click=${async () => {
              await run(() => cloudDeskApi.logout());
            }}
          >
            禁用账户 Mock
          </button>
        </div>
      </section>
      <section class="card">
        <div class="section-header">
          <div>
            <div class="card-title">工作区设置</div>
            <div class="card-sub">P0 阶段的简单组织模型。角色和账单归属确定后再补充分组能力。</div>
          </div>
          ${statusPill(workspace.plan)}
        </div>
        <div class="settings-grid" style="margin-top: 16px">
          <label>工作区名称<input .value=${workspace.name} /></label>
          <label>Slug<input .value=${workspace.slug} /></label>
          <label>域名<input .value=${workspace.domain} /></label>
          <label>工作区 ID<input readonly .value=${workspace.workspaceId} /></label>
        </div>
      </section>
    </div>
  `;
}
