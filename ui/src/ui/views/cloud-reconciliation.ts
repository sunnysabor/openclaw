// Control UI view renders Cloud Desk reconciliation screen content.
import { html } from "lit";
import { cloudDeskApi } from "../cloud-desk-api.ts";
import type { CloudDeskSnapshot } from "../cloud-desk-types.ts";
import { renderMetricCard, renderMockNotice, statusPill } from "./cloud-desk-shared.ts";

export function renderCloudReconciliation(
  snapshot: CloudDeskSnapshot = cloudDeskApi.getCachedSnapshot(),
  runAction?: (action: () => Promise<unknown>) => Promise<void>,
) {
  const { reconciliation } = snapshot;
  const run = runAction ?? ((action: () => Promise<unknown>) => action());
  const mismatchCount = reconciliation.filter((item) => item.status === "mismatch").length;
  const localOnlyCount = reconciliation.filter((item) => item.status === "local_only").length;
  const cloudCount = reconciliation.filter((item) => item.cloud).length;
  return html`
    <div class="stack">
      ${renderMockNotice()}
      <div class="dashboard-grid">
        ${renderMetricCard(
          "本地用量行",
          String(reconciliation.filter((item) => item.local).length),
          "Mock 本地用量摘要",
        )}
        ${renderMetricCard("云账单行", String(cloudCount), "Mock Relay 扣费记录")}
        ${renderMetricCard("异常项", String(mismatchCount + localOnlyCount), "需要检查")}
      </div>
      <section class="card">
        <div class="section-header">
          <div>
            <div class="card-title">本地用量 vs 云端账单</div>
            <div class="card-sub">P0 阶段展示本地模型用量与云端 Relay 账单的 mock 对应关系。</div>
          </div>
          <div style="display: flex; gap: 8px; flex-wrap: wrap">
            <input placeholder="按会话 ID 过滤" />
            <select>
              <option>全部状态</option>
              <option>matched</option>
              <option>mismatch</option>
              <option>local_only</option>
              <option>cloud_only</option>
            </select>
            <button
              class="btn"
              @click=${async () => {
                await run(() => cloudDeskApi.syncLocalUsage());
              }}
            >
              同步本地用量 Mock
            </button>
          </div>
        </div>
        <div class="table-wrap" style="margin-top: 12px">
          <table>
            <thead>
              <tr>
                <th>状态</th>
                <th>会话</th>
                <th>代理</th>
                <th>Relay 请求</th>
                <th>模型</th>
                <th>输入</th>
                <th>输出</th>
                <th>本地估算成本</th>
                <th>云端扣费</th>
                <th>差异</th>
              </tr>
            </thead>
            <tbody>
              ${reconciliation.map(
                (item) => html`
                  <tr>
                    <td>${statusPill(item.status)}</td>
                    <td class="mono">${item.local?.sessionId ?? "—"}</td>
                    <td class="mono">${item.local?.agentId ?? "—"}</td>
                    <td class="mono">${item.cloud?.relayRequestId ?? "—"}</td>
                    <td class="mono">${item.local?.model ?? item.cloud?.model ?? "—"}</td>
                    <td>
                      ${(item.local?.inputTokens ?? item.cloud?.inputTokens ?? 0).toLocaleString()}
                    </td>
                    <td>
                      ${(
                        item.local?.outputTokens ??
                        item.cloud?.outputTokens ??
                        0
                      ).toLocaleString()}
                    </td>
                    <td>${item.local ? `$${item.local.estimatedCost.toFixed(3)}` : "—"}</td>
                    <td>${item.cloud ? `${item.cloud.chargedCredits} credits` : "—"}</td>
                    <td>
                      ${item.difference.tokenDiff.toLocaleString()} tok /
                      ${item.difference.costDiffCredits} credits
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
