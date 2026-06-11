/* @vitest-environment jsdom */

import { render } from "lit";
import { describe, expect, it } from "vitest";
import { renderCloudAccount } from "./cloud-account.ts";
import { renderCloudAuth } from "./cloud-auth.ts";
import { renderCloudBilling } from "./cloud-billing.ts";
import { renderCloudMembers } from "./cloud-members.ts";
import { renderCloudProfile } from "./cloud-profile.ts";
import { renderCloudReconciliation } from "./cloud-reconciliation.ts";
import { renderCloudRelay } from "./cloud-relay.ts";

function textOf(template: unknown): string {
  const container = document.createElement("div");
  render(template as Parameters<typeof render>[0], container);
  return container.textContent?.replace(/\s+/g, " ").trim() ?? "";
}

describe("Cloud Desk mock views", () => {
  it("renders the account, billing, relay, and reconciliation P0 pages", () => {
    expect(textOf(renderCloudAccount())).toContain("云账户");
    expect(textOf(renderCloudBilling())).toContain("充值订单 Mock");
    expect(textOf(renderCloudRelay())).toContain("Relay API Key");
    expect(textOf(renderCloudReconciliation())).toContain("本地用量 vs 云端账单");
  });

  it("renders auth state pages with SMS and WeChat mock flows", () => {
    const text = textOf(renderCloudAuth());
    expect(text).toContain("账号密码登录");
    expect(text).toContain("账号 / 邮箱");
    expect(text).toContain("密码");
    expect(text).toContain("忘记密码");
    expect(text).toContain("注册账号");
    expect(text).toContain("手机号验证码登录");
    expect(text).toContain("微信扫码登录");
    expect(text).toContain("Mock 验证码：123456");
    expect(text).toContain("模拟已扫码");
    expect(text).toContain("模拟过期");
  });

  it("keeps profile and members pages clearly marked as workspace mock pages", () => {
    expect(textOf(renderCloudProfile())).toContain("工作区设置");
    const membersText = textOf(renderCloudMembers());
    expect(membersText).toContain("邀请用户");
    expect(membersText).toContain("角色权限预览");
  });
});
