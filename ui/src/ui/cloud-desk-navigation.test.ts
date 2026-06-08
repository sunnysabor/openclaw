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

describe("Cloud Desk navigation", () => {
  it("keeps Cloud Desk as a dedicated navigation group", () => {
    expect(TAB_GROUPS.find((group) => group.label === "cloudDesk")?.tabs).toEqual(CLOUD_DESK_TABS);
  });

  it("maps every Cloud Desk tab to a stable route and back", () => {
    for (const tab of CLOUD_DESK_TABS) {
      expect(pathForTab(tab)).toBe(CLOUD_DESK_PATHS[tab]);
      expect(pathForTab(tab, "/ui")).toBe(`/ui${CLOUD_DESK_PATHS[tab]}`);
      expect(tabFromPath(CLOUD_DESK_PATHS[tab])).toBe(tab);
      expect(tabFromPath(`/ui${CLOUD_DESK_PATHS[tab]}`, "/ui")).toBe(tab);
    }
  });

  it("exposes Cloud Desk titles, subtitles, and icons", () => {
    expect(Object.fromEntries(CLOUD_DESK_TABS.map((tab) => [tab, titleForTab(tab)]))).toEqual({
      cloudAuth: "Login",
      cloudProfile: "Profile",
      cloudMembers: "Members",
      cloudAccount: "Cloud Account",
      cloudBilling: "Cloud Billing",
      cloudRelay: "Cloud Relay",
      cloudReconciliation: "Reconciliation",
    });
    expect(CLOUD_DESK_TABS.map((tab) => subtitleForTab(tab))).toEqual([
      "Login, registration, and invite acceptance.",
      "User profile and workspace settings.",
      "Members, roles, and invite links.",
      "Cloud account identity and status.",
      "Balance, spend, transactions, and recharge order mock.",
      "Relay endpoint, API key state, models, and rates.",
      "Compare local usage with cloud relay billing records.",
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
