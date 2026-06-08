// Control UI view renders Cloud Desk Relay screen content.
import { html } from "lit";
import { cloudDeskApi } from "../cloud-desk-api.ts";
import type { CloudDeskSnapshot } from "../cloud-desk-types.ts";
import { renderMetricCard, renderMockNotice, statusPill } from "./cloud-desk-shared.ts";

export function renderCloudRelay(
  snapshot: CloudDeskSnapshot = cloudDeskApi.getCachedSnapshot(),
  runAction?: (action: () => Promise<unknown>) => Promise<void>,
) {
  const { relay, models } = snapshot;
  const run = runAction ?? ((action: () => Promise<unknown>) => action());
  return html`
    <div class="stack">
      ${renderMockNotice()}
      <div class="dashboard-grid">
        ${renderMetricCard("Relay 端点", relay.endpoint, "OpenAI 兼容方向")}
        ${renderMetricCard("API Key", relay.apiKeyMasked ?? "未创建", relay.apiKeyId ?? "无 Key")}
        ${renderMetricCard("最近测试", relay.lastTest.message, relay.lastTest.testedAt ?? "从未")}
      </div>
      <section class="card">
        <div class="section-header">
          <div>
            <div class="card-title">Relay API Key</div>
            <div class="card-sub">未来真实 API 只会在创建时展示一次明文 Key。</div>
          </div>
          ${statusPill(relay.apiKeyStatus)}
        </div>
        <div class="settings-grid" style="margin-top: 16px">
          <label>端点<input readonly .value=${relay.endpoint} /></label>
          <label>脱敏 Key<input readonly .value=${relay.apiKeyMasked ?? ""} /></label>
          <label>创建时间<input readonly .value=${relay.createdAt ?? "—"} /></label>
          <label>最近使用时间<input readonly .value=${relay.lastUsedAt ?? "从未"} /></label>
        </div>
        <div style="margin-top: 16px; display: flex; gap: 8px; flex-wrap: wrap">
          <button
            class="btn primary"
            @click=${async () => {
              await run(() => cloudDeskApi.createRelayApiKey());
            }}
          >
            创建 API Key Mock
          </button>
          <button
            class="btn"
            @click=${async () => {
              await run(() => cloudDeskApi.resetRelayApiKey());
            }}
          >
            重置 API Key Mock
          </button>
          <button
            class="btn danger"
            @click=${async () => {
              await run(() => cloudDeskApi.revokeRelayApiKey());
            }}
          >
            吊销 API Key Mock
          </button>
          <button
            class="btn"
            @click=${async () => {
              await run(() => cloudDeskApi.testRelay());
            }}
          >
            测试 Relay 连接
          </button>
        </div>
      </section>
      <section class="card">
        <div class="section-header">
          <div>
            <div class="card-title">可用模型</div>
            <div class="card-sub">Mock 模型列表与费率。</div>
          </div>
          <button class="btn">拉取模型列表</button>
        </div>
        <div class="table-wrap" style="margin-top: 12px">
          <table>
            <thead>
              <tr>
                <th>模型</th>
                <th>提供方</th>
                <th>状态</th>
                <th>输入 / 1K</th>
                <th>输出 / 1K</th>
                <th>上下文</th>
              </tr>
            </thead>
            <tbody>
              ${models.map(
                (model) => html`
                  <tr>
                    <td class="mono">${model.model}</td>
                    <td>${model.provider}</td>
                    <td>${statusPill(model.status)}</td>
                    <td>${model.inputCreditsPer1kTokens} credits</td>
                    <td>${model.outputCreditsPer1kTokens} credits</td>
                    <td>${model.contextWindow.toLocaleString()}</td>
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
