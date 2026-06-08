// Control UI view renders Cloud Desk billing screen content.
import { html } from "lit";
import { cloudDeskApi } from "../cloud-desk-api.ts";
import type { CloudDeskSnapshot } from "../cloud-desk-types.ts";
import {
  formatCredits,
  formatSignedCredits,
  renderMetricCard,
  renderMockNotice,
  statusPill,
} from "./cloud-desk-shared.ts";

export function renderCloudBilling(
  snapshot: CloudDeskSnapshot = cloudDeskApi.getCachedSnapshot(),
  runAction?: (action: () => Promise<unknown>) => Promise<void>,
) {
  const { billing, transactions, rechargeOrders } = snapshot;
  const run = runAction ?? ((action: () => Promise<unknown>) => action());
  return html`
    <div class="stack">
      ${renderMockNotice()}
      <div class="dashboard-grid">
        ${renderMetricCard("当前余额", formatCredits(billing.balanceCredits), billing.currency)}
        ${renderMetricCard("今日消耗", formatCredits(billing.todaySpendCredits), "今日 Relay 调用")}
        ${renderMetricCard("本月消耗", formatCredits(billing.monthSpendCredits), "当前账期")}
      </div>
      <section class="card">
        <div class="section-header">
          <div>
            <div class="card-title">最近交易</div>
            <div class="card-sub">来自 mock adapter 的云端计费记录。</div>
          </div>
          <button class="btn">查询交易</button>
        </div>
        <div class="table-wrap" style="margin-top: 12px">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>类型</th>
                <th>金额</th>
                <th>交易后余额</th>
                <th>说明</th>
                <th>会话</th>
                <th>创建时间</th>
              </tr>
            </thead>
            <tbody>
              ${transactions.map(
                (item) => html`
                  <tr>
                    <td class="mono">${item.transactionId}</td>
                    <td>${statusPill(item.type)}</td>
                    <td>${formatSignedCredits(item.amountCredits)}</td>
                    <td>${formatCredits(item.balanceAfterCredits)}</td>
                    <td>${item.description}</td>
                    <td class="mono">${item.sessionId ?? "—"}</td>
                    <td>${item.createdAt}</td>
                  </tr>
                `,
              )}
            </tbody>
          </table>
        </div>
      </section>
      <section class="card">
        <div class="section-header">
          <div>
            <div class="card-title">充值订单 Mock</div>
            <div class="card-sub">P0 阶段刻意不实现真实支付。</div>
          </div>
          <button
            class="btn primary"
            @click=${async () => {
              await run(() => cloudDeskApi.createRechargeOrder());
            }}
          >
            创建充值订单 Mock
          </button>
          <button
            class="btn"
            @click=${async () => {
              await run(() => cloudDeskApi.markLatestRechargePaid());
            }}
          >
            模拟最新订单支付成功
          </button>
        </div>
        ${rechargeOrders.map(
          (order) => html`
            <div class="list-row" style="margin-top: 12px">
              <div>
                <div class="mono">${order.orderId}</div>
                <div class="muted">${order.paymentUrl}</div>
              </div>
              <div>${statusPill(order.status)}</div>
              <div>${(order.amountCents / 100).toFixed(2)} ${order.currency}</div>
              <div>${formatCredits(order.credits)}</div>
            </div>
          `,
        )}
      </section>
    </div>
  `;
}
