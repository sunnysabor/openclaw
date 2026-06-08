// Control UI tests cover Cloud Desk navigation routes.
import { describe, expect, it } from "vitest";
import {
  TAB_GROUPS,
  iconForTab,
  pathForTab,
  subtitleForTab,
  tabFromPath,
  titleForTab,
} from "./navigation.ts";

const CLOUD_DESK_TABS = [
  "cloudAuth",
  "cloudProfile",
  "cloudMembers",
  "cloudAccount",
  "cloudBilling",
  "cloudRelay",
  "cloudReconciliation",
] as const;

const CLOUD_DESK_PATHS: Record<(typeof CLOUD_DESK_TABS)[number], string> = {
  cloudAuth: "/cloud/auth",
  cloudProfile: "/cloud/profile",
  cloudMembers: "/cloud/members",
  cloudAccount: "/cloud/account",
  cloudBilling: "/cloud/billing",
  cloudRelay: "/cloud/relay",
  cloudReconciliation: "/cloud/reconciliation",
};

describe("龙虾工作台 navigation", () => {
  it("keeps 龙虾工作台 as a dedicated navigation group", () => {
    expect(TAB_GROUPS.find((group) => group.label === "cloudDesk")?.tabs).toEqual(CLOUD_DESK_TABS);
  });

  it("maps every 龙虾工作台 tab to a stable route and back", () => {
    for (const tab of CLOUD_DESK_TABS) {
      expect(pathForTab(tab)).toBe(CLOUD_DESK_PATHS[tab]);
      expect(pathForTab(tab, "/ui")).toBe(`/ui${CLOUD_DESK_PATHS[tab]}`);
      expect(tabFromPath(CLOUD_DESK_PATHS[tab])).toBe(tab);
      expect(tabFromPath(`/ui${CLOUD_DESK_PATHS[tab]}`, "/ui")).toBe(tab);
    }
  });

  it("exposes 龙虾工作台 titles, subtitles, and icons", () => {
    expect(Object.fromEntries(CLOUD_DESK_TABS.map((tab) => [tab, titleForTab(tab)]))).toEqual({
      cloudAuth: "登录",
      cloudProfile: "资料",
      cloudMembers: "成员",
      cloudAccount: "云账户",
      cloudBilling: "云账单",
      cloudRelay: "Relay 中转",
      cloudReconciliation: "对账",
    });
    expect(CLOUD_DESK_TABS.map((tab) => subtitleForTab(tab))).toEqual([
      "琥格AI 账号登录、注册与邀请接受。",
      "琥格AI 用户资料与工作区设置。",
      "龙虾工作台成员、角色与邀请链接。",
      "琥格AI 云账户身份与状态。",
      "琥格AI 点数余额、消耗、交易流水与充值订单 Mock。",
      "琥格AI Relay 端点、API Key 状态、模型与费率。",
      "对比本地用量与琥格AI Relay 计费记录。",
    ]);
    expect(Object.fromEntries(CLOUD_DESK_TABS.map((tab) => [tab, iconForTab(tab)]))).toEqual({
      cloudAuth: "key",
      cloudProfile: "circle",
      cloudMembers: "link",
      cloudAccount: "globe",
      cloudBilling: "barChart",
      cloudRelay: "radio",
      cloudReconciliation: "activity",
    });
  });
});
