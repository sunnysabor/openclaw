// Control UI view renders 龙虾工作台 login/register mock screen content.
import { html } from "lit";
import { cloudDeskApi } from "../cloud-desk-api.ts";
import type { CloudDeskSnapshot } from "../cloud-desk-types.ts";
import { renderMockNotice, requestCloudDeskUpdate, statusPill } from "./cloud-desk-shared.ts";

type SmsAuthState =
  | "idle"
  | "phone_invalid"
  | "code_sent"
  | "can_resend"
  | "code_invalid"
  | "success";
type WechatQrState = "waiting" | "scanned" | "confirmed" | "expired";

const authUiState: {
  passwordState: "idle" | "invalid" | "success";
  email: string;
  password: string;
  smsState: SmsAuthState;
  smsSecondsLeft: number;
  smsTimer: number | null;
  wechatState: WechatQrState;
  phone: string;
  code: string;
} = {
  passwordState: "idle",
  email: cloudDeskApi.getCachedSnapshot().auth.email,
  password: "",
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

function accountPasswordMessage() {
  switch (authUiState.passwordState) {
    case "invalid":
      return html`<div class="pill danger">请输入账号和密码。当前是前端 mock 登录。</div>`;
    case "success":
      return html`<div class="pill success">登录成功，正在进入工作区。</div>`;
    default:
      return html`<div class="muted">演示账号可直接输入任意非空邮箱和密码。</div>`;
  }
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
      <section class="card">
        <div class="section-header">
          <div>
            <div class="card-title">琥格AI 登录</div>
            <div class="card-sub">
              先用最简单的账号密码入口验证页面流程。手机号验证码、微信扫码和邀请接受暂时保留为 mock
              次要入口。
            </div>
          </div>
          ${statusPill(account.status)}
        </div>

        <div style="max-width: 560px; margin-top: 20px">
          <div
            style="padding: 28px; border-radius: var(--radius-xl); background: linear-gradient(160deg, color-mix(in srgb, var(--panel, #111827) 92%, #0f172a 8%), color-mix(in srgb, white 8%, var(--panel, #111827) 92%)); border: 1px solid color-mix(in srgb, var(--accent, #7c3aed) 22%, transparent); box-shadow: 0 24px 80px rgba(15, 23, 42, 0.22)"
          >
            <div style="font-size: 14px; color: var(--muted, #94a3b8)">欢迎回来</div>
            <div style="font-size: 32px; font-weight: 800; margin-top: 8px">账号密码登录</div>
            <div class="card-sub" style="margin-top: 8px">
              登录后进入控制台首页。当前仍是前端 mock 流程，用于先验证标准用户登录体验。
            </div>
            <div class="settings-grid" style="margin-top: 18px">
              <label
                >账号 / 邮箱<input
                  type="email"
                  placeholder="name@example.com"
                  .value=${authUiState.email}
                  @input=${(event: Event) => {
                    authUiState.email = (event.target as HTMLInputElement).value;
                  }}
              /></label>
              <label
                >密码<input
                  type="password"
                  placeholder="请输入密码"
                  .value=${authUiState.password}
                  @input=${(event: Event) => {
                    authUiState.password = (event.target as HTMLInputElement).value;
                  }}
              /></label>
            </div>
            <div style="margin-top: 18px; display: flex; gap: 8px; flex-wrap: wrap">
              <button
                class="btn primary"
                style="min-width: 140px"
                @click=${async () => {
                  const email = authUiState.email.trim();
                  const password = authUiState.password.trim();
                  authUiState.passwordState =
                    email.length > 0 && password.length > 0 ? "success" : "invalid";
                  if (authUiState.passwordState === "success") {
                    await run(() => cloudDeskApi.login());
                  }
                  requestUpdate();
                }}
              >
                登录
              </button>
              <button
                class="btn"
                @click=${() => {
                  authUiState.email = auth.email;
                  authUiState.password = "";
                  authUiState.passwordState = "idle";
                  requestUpdate();
                }}
              >
                清空
              </button>
            </div>
            <div
              style="margin-top: 14px; display: flex; justify-content: space-between; gap: 12px; flex-wrap: wrap"
            >
              <button class="btn" style="padding-inline: 0; background: transparent">
                忘记密码
              </button>
              <button class="btn" style="padding-inline: 0; background: transparent">
                注册账号
              </button>
            </div>
            <div style="margin-top: 12px">${accountPasswordMessage()}</div>
            <div class="muted" style="margin-top: 16px">
              示例工作区：${workspace.name} · 当前账号：${account.nickname}
            </div>
          </div>
        </div>
      </section>

      <section class="card">
        <div class="section-header">
          <div>
            <div class="card-title">其他登录方式</div>
            <div class="card-sub">这些入口先保留为次要 mock 方式，不作为首屏主流程。</div>
          </div>
          <div class="muted">手机号验证码、微信扫码、邀请接受仍保留为 P0 mock 入口。</div>
        </div>

        <div
          style="display: grid; grid-template-columns: minmax(280px, 1fr) minmax(260px, 1fr); gap: 16px; margin-top: 16px"
        >
          <section
            class="card"
            style="background: color-mix(in srgb, var(--panel, #111827) 94%, var(--accent, #7c3aed) 6%)"
          >
            <div class="card-title">手机号验证码登录</div>
            <div class="card-sub" style="margin-top: 6px">
              未注册手机号验证后自动创建琥格AI 账号。
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

      ${renderMockNotice()}
    </div>
  `;
}
