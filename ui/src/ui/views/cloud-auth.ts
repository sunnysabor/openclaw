// Control UI view renders Cloud Desk login/register mock screen content.
import { html } from "lit";
import { cloudDeskApi } from "../cloud-desk-api.ts";
import type { CloudDeskSnapshot } from "../cloud-desk-types.ts";
import {
  renderMetricCard,
  renderMockNotice,
  requestCloudDeskUpdate,
  statusPill,
} from "./cloud-desk-shared.ts";

type SmsAuthState =
  | "idle"
  | "phone_invalid"
  | "code_sent"
  | "can_resend"
  | "code_invalid"
  | "success";
type WechatQrState = "waiting" | "scanned" | "confirmed" | "expired";

const authUiState: {
  smsState: SmsAuthState;
  smsSecondsLeft: number;
  smsTimer: number | null;
  wechatState: WechatQrState;
  phone: string;
  code: string;
} = {
  smsState: "idle",
  smsSecondsLeft: 0,
  smsTimer: null,
  wechatState: cloudDeskApi.getCachedSnapshot().auth.wechat.status,
  phone: cloudDeskApi.getCachedSnapshot().auth.phone,
  code: "",
};

function requestUpdate() {
  requestCloudDeskUpdate();
}

function startSmsCountdown() {
  if (authUiState.smsTimer) window.clearInterval(authUiState.smsTimer);
  authUiState.smsState = "code_sent";
  authUiState.smsSecondsLeft = 60;
  authUiState.smsTimer = window.setInterval(() => {
    authUiState.smsSecondsLeft -= 1;
    if (authUiState.smsSecondsLeft <= 0) {
      if (authUiState.smsTimer) window.clearInterval(authUiState.smsTimer);
      authUiState.smsTimer = null;
      authUiState.smsState = "can_resend";
    }
    requestUpdate();
  }, 1000);
}

function isMainlandPhone(value: string) {
  return /^1\d{10}$/.test(value.trim());
}

function smsMessage() {
  switch (authUiState.smsState) {
    case "phone_invalid":
      return html`<div class="pill danger">请输入有效的手机号</div>`;
    case "code_sent":
      return html`<div class="pill warning">
        验证码已发送，${authUiState.smsSecondsLeft} 秒后可重新发送
      </div>`;
    case "can_resend":
      return html`<div class="pill warning">可以重新发送验证码</div>`;
    case "code_invalid":
      return html`<div class="pill danger">验证码不正确或已过期，请重新输入</div>`;
    case "success":
      return html`<div class="pill success">验证成功，正在刷新账户信息</div>`;
    default:
      return html`<div class="muted">Mock 验证码：123456</div>`;
  }
}

function wechatMessage() {
  switch (authUiState.wechatState) {
    case "waiting":
      return "请使用微信扫码登录";
    case "scanned":
      return "已扫码，请在手机微信中确认";
    case "confirmed":
      return "登录成功，正在刷新账户信息";
    case "expired":
      return "二维码已过期，请刷新后重试";
  }
}

export function renderCloudAuth(
  snapshot: CloudDeskSnapshot = cloudDeskApi.getCachedSnapshot(),
  runAction?: (action: () => Promise<unknown>) => Promise<void>,
) {
  const { auth, account, workspace, invites } = snapshot;
  const run = runAction ?? ((action: () => Promise<unknown>) => action());
  const pendingInvite = invites.find((invite) => invite.status === "pending");
  return html`
    <div class="stack">
      ${renderMockNotice()}
      <div class="dashboard-grid">
        ${renderMetricCard(
          "主要登录方式",
          "手机号验证码",
          `${auth.phoneCountryCode} ${authUiState.phone}`,
        )}
        ${renderMetricCard("微信扫码", wechatMessage(), `有效期：${auth.wechat.expiresAt}`)}
        ${renderMetricCard("邀请入口", auth.inviteCode, pendingInvite?.email ?? "可选")}
      </div>

      <section class="card">
        <div class="section-header">
          <div>
            <div class="card-title">Cloud Desk 登录</div>
            <div class="card-sub">
              面向国内用户的登录闭环：手机号验证码优先，微信扫码作为快捷路径。
            </div>
          </div>
          ${statusPill(account.status)}
        </div>

        <div
          style="display: grid; grid-template-columns: minmax(280px, 1.2fr) minmax(260px, 0.8fr); gap: 16px; margin-top: 16px"
        >
          <section
            class="card"
            style="background: color-mix(in srgb, var(--panel, #111827) 94%, var(--accent, #7c3aed) 6%)"
          >
            <div class="card-title">手机号验证码登录</div>
            <div class="card-sub" style="margin-top: 6px">
              未注册手机号验证后自动创建 Cloud Desk 账号。
            </div>
            <div class="settings-grid" style="margin-top: 16px">
              <label
                >国家/地区
                <select>
                  <option selected>中国大陆 +86</option>
                  <option>中国香港 +852</option>
                  <option>中国澳门 +853</option>
                  <option>中国台湾 +886</option>
                  <option>United States +1</option>
                </select>
              </label>
              <label
                >手机号<input
                  inputmode="tel"
                  placeholder="请输入手机号"
                  .value=${authUiState.phone}
                  @input=${(event: Event) => {
                    authUiState.phone = (event.target as HTMLInputElement).value;
                  }}
              /></label>
              <label
                >短信验证码<input
                  inputmode="numeric"
                  placeholder="6 位验证码"
                  .value=${authUiState.code}
                  @input=${(event: Event) => {
                    authUiState.code = (event.target as HTMLInputElement).value;
                  }}
              /></label>
              <label>邀请码 / 邀请链接<input placeholder="可选" .value=${auth.inviteCode} /></label>
            </div>
            <div style="margin-top: 16px; display: flex; gap: 8px; flex-wrap: wrap">
              <button
                class="btn"
                ?disabled=${authUiState.smsState === "code_sent"}
                @click=${() => {
                  if (!isMainlandPhone(authUiState.phone)) authUiState.smsState = "phone_invalid";
                  else startSmsCountdown();
                  requestUpdate();
                }}
              >
                ${authUiState.smsState === "can_resend" ? "重新发送" : "获取验证码"}
              </button>
              <button
                class="btn primary"
                @click=${async () => {
                  authUiState.smsState = authUiState.code === "123456" ? "success" : "code_invalid";
                  if (authUiState.smsState === "success") await run(() => cloudDeskApi.login());
                  requestUpdate();
                }}
              >
                登录 / 注册
              </button>
            </div>
            <div style="margin-top: 12px">${smsMessage()}</div>
            <div class="muted" style="margin-top: 12px; line-height: 1.6">
              登录即表示同意《服务协议》和《隐私政策》。真实实现需要短信限流、图形验证码、风控、session/JWT
              交换。
            </div>
          </section>

          <section class="card" style="text-align: center">
            <div class="card-title">微信扫码登录</div>
            <div class="card-sub" style="margin-top: 6px">
              使用微信扫一扫，确认后自动进入工作区。
            </div>
            <div
              style="width: 180px; height: 180px; margin: 18px auto 12px; border-radius: 20px; background: #fff; color: #111827; display: grid; place-items: center; box-shadow: inset 0 0 0 1px rgba(0,0,0,.08); opacity: ${authUiState.wechatState ===
              "expired"
                ? 0.35
                : 1}"
            >
              <div
                style="width: 132px; height: 132px; display: grid; grid-template-columns: repeat(7, 1fr); gap: 4px"
              >
                ${Array.from({ length: 49 }, (_, index) => {
                  const filled = [
                    0, 1, 2, 4, 6, 7, 9, 10, 13, 14, 16, 18, 20, 22, 24, 25, 27, 28, 31, 33, 35, 37,
                    38, 40, 42, 43, 44, 46, 48,
                  ].includes(index);
                  return html`<span
                    style="border-radius: 2px; background: ${filled
                      ? "#111827"
                      : "#ffffff"}; border: 1px solid ${filled ? "#111827" : "#e5e7eb"}"
                  ></span>`;
                })}
              </div>
            </div>
            <div>${statusPill(authUiState.wechatState)}</div>
            <div class="muted" style="margin-top: 10px">${wechatMessage()}</div>
            <div class="muted" style="margin-top: 6px">Mock QR：${auth.wechat.qrCodeUrl}</div>
            <div
              style="margin-top: 14px; display: flex; justify-content: center; gap: 8px; flex-wrap: wrap"
            >
              <button
                class="btn"
                @click=${() => {
                  authUiState.wechatState = "waiting";
                  requestUpdate();
                }}
              >
                刷新二维码
              </button>
              <button
                class="btn"
                @click=${() => {
                  authUiState.wechatState = "scanned";
                  requestUpdate();
                }}
              >
                模拟已扫码
              </button>
              <button
                class="btn primary"
                @click=${async () => {
                  authUiState.wechatState = "confirmed";
                  await run(() => cloudDeskApi.login());
                  requestUpdate();
                }}
              >
                模拟确认登录
              </button>
              <button
                class="btn danger"
                @click=${() => {
                  authUiState.wechatState = "expired";
                  requestUpdate();
                }}
              >
                模拟过期
              </button>
            </div>
          </section>
        </div>
      </section>

      <section class="card">
        <div class="section-header">
          <div>
            <div class="card-title">注册与邀请接受</div>
            <div class="card-sub">
              把新用户注册、邀请加入工作区、已有用户加入团队放在同一个登录闭环里。
            </div>
          </div>
          ${pendingInvite ? statusPill(pendingInvite.status) : ""}
        </div>
        <div class="settings-grid" style="margin-top: 16px">
          <label>邮箱补充资料<input placeholder="you@company.com" .value=${auth.email} /></label>
          <label>姓名 / 昵称<input placeholder="你的名字" .value=${account.nickname} /></label>
          <label>目标工作区<input readonly .value=${workspace.name} /></label>
          <label>邀请链接<input readonly .value=${pendingInvite?.inviteUrl ?? ""} /></label>
        </div>
        <div style="margin-top: 16px; display: flex; gap: 8px; flex-wrap: wrap">
          <button
            class="btn primary"
            @click=${async () => {
              await run(() => cloudDeskApi.acceptInvite());
              requestUpdate();
            }}
          >
            接受邀请并进入工作区</button
          ><button class="btn">稍后补充资料</button><button class="btn">切换账号</button>
        </div>
      </section>
    </div>
  `;
}
