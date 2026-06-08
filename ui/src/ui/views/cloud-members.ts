// Control UI view renders ClawDesk workspace members and invites screen content.
import { html } from "lit";
import { cloudDeskApi } from "../cloud-desk-api.ts";
import type { CloudDeskSnapshot } from "../cloud-desk-types.ts";
import { renderMetricCard, renderMockNotice, statusPill } from "./cloud-desk-shared.ts";

export function renderCloudMembers(
  snapshot: CloudDeskSnapshot = cloudDeskApi.getCachedSnapshot(),
  runAction?: (action: () => Promise<unknown>) => Promise<void>,
) {
  const { workspace, members, invites } = snapshot;
  const run = runAction ?? ((action: () => Promise<unknown>) => action());
  const pending邀请 = invites.filter((invite) => invite.status === "pending");
  return html`
    <div class="stack">
      ${renderMockNotice()}
      <div class="dashboard-grid">
        ${renderMetricCard("工作区", workspace.name, workspace.workspaceId)}
        ${renderMetricCard("成员", String(members.length), "活跃和已禁用成员")}
        ${renderMetricCard("待处理邀请", String(pending邀请.length), "等待接受")}
      </div>
      <section class="card">
        <div class="section-header">
          <div>
            <div class="card-title">邀请用户</div>
            <div class="card-sub">生成邀请链接、分配角色，并让用户加入当前工作区。</div>
          </div>
          <button
            class="btn primary"
            @click=${async () => {
              await run(() => cloudDeskApi.createInvite());
            }}
          >
            创建邀请 Mock
          </button>
        </div>
        <div class="settings-grid" style="margin-top: 16px">
          <label
            >邮箱<input placeholder="teammate@company.com" .value=${pending邀请[0]?.email ?? ""}
          /></label>
          <label
            >角色
            <select>
              <option>member</option>
              <option>admin</option>
              <option>viewer</option>
            </select>
          </label>
          <label
            >邀请过期时间<input readonly .value=${pending邀请[0]?.expiresAt ?? "7 days"}
          /></label>
          <label>邀请链接<input readonly .value=${pending邀请[0]?.inviteUrl ?? ""} /></label>
        </div>
        <div style="margin-top: 16px; display: flex; gap: 8px; flex-wrap: wrap">
          <button class="btn">复制邀请链接</button>
          <button class="btn">发送邮件 Mock</button>
          <button class="btn">重新生成链接</button>
        </div>
      </section>
      <section class="card">
        <div class="section-header">
          <div>
            <div class="card-title">成员</div>
            <div class="card-sub">账户、Relay、账单和工作区设置的角色权限预览。</div>
          </div>
          <input placeholder="搜索成员" />
        </div>
        <div class="table-wrap" style="margin-top: 12px">
          <table>
            <thead>
              <tr>
                <th>姓名</th>
                <th>邮箱</th>
                <th>角色</th>
                <th>状态</th>
                <th>最近活跃</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              ${members.map(
                (member) => html`
                  <tr>
                    <td>${member.name}</td>
                    <td class="mono">${member.email}</td>
                    <td>${statusPill(member.role)}</td>
                    <td>${statusPill(member.status)}</td>
                    <td>${member.lastActiveAt ?? "从未"}</td>
                    <td><button class="btn">编辑角色</button></td>
                  </tr>
                `,
              )}
            </tbody>
          </table>
        </div>
      </section>
      <section class="card">
        <div class="card-title">邀请</div>
        <div class="table-wrap" style="margin-top: 12px">
          <table>
            <thead>
              <tr>
                <th>邮箱</th>
                <th>角色</th>
                <th>状态</th>
                <th>邀请人</th>
                <th>过期时间</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              ${invites.map(
                (invite) => html`
                  <tr>
                    <td class="mono">${invite.email}</td>
                    <td>${statusPill(invite.role)}</td>
                    <td>${statusPill(invite.status)}</td>
                    <td>${invite.invitedBy}</td>
                    <td>${invite.expiresAt}</td>
                    <td style="display: flex; gap: 8px; flex-wrap: wrap">
                      <button class="btn">复制</button>
                      <button class="btn">重发</button>
                      <button class="btn danger">撤销</button>
                    </td>
                  </tr>
                `,
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  `;
}
