// Control UI tests cover Cloud Desk mock adapter state transitions.
import { beforeEach, describe, expect, it, vi } from "vitest";

async function loadFreshCloudDeskApi() {
  vi.resetModules();
  return import("./cloud-desk-api.ts");
}

describe("cloudDeskApi mock adapter", () => {
  beforeEach(() => {
    vi.useRealTimers();
  });

  it("returns cloned snapshots so callers cannot mutate adapter state accidentally", async () => {
    const { cloudDeskApi } = await loadFreshCloudDeskApi();

    const snapshot = cloudDeskApi.getCachedSnapshot();
    snapshot.account.status = "inactive";
    snapshot.billing.balanceCredits = 1;

    const nextSnapshot = cloudDeskApi.getCachedSnapshot();
    expect(nextSnapshot.account.status).toBe("active");
    expect(nextSnapshot.billing.balanceCredits).toBe(128_640);
  });

  it("updates account status for login and logout", async () => {
    const { cloudDeskApi } = await loadFreshCloudDeskApi();

    await cloudDeskApi.logout();
    expect(cloudDeskApi.getCachedSnapshot().account.status).toBe("inactive");

    const account = await cloudDeskApi.login();
    expect(account.status).toBe("active");
    expect(cloudDeskApi.getCachedSnapshot().account.status).toBe("active");
  });

  it("creates recharge orders with matching payment URLs", async () => {
    const { cloudDeskApi } = await loadFreshCloudDeskApi();
    const before = cloudDeskApi.getCachedSnapshot().rechargeOrders.length;

    const order = await cloudDeskApi.createRechargeOrder();
    const snapshot = cloudDeskApi.getCachedSnapshot();

    expect(snapshot.rechargeOrders).toHaveLength(before + 1);
    expect(snapshot.rechargeOrders[0]?.orderId).toBe(order.orderId);
    expect(order.paymentUrl).toBe(`mock://payment/${order.orderId}`);
    expect(order.status).toBe("pending");
  });

  it("marks the latest recharge paid and records balance + transaction changes", async () => {
    const { cloudDeskApi } = await loadFreshCloudDeskApi();
    const before = cloudDeskApi.getCachedSnapshot();

    await cloudDeskApi.createRechargeOrder();
    const order = await cloudDeskApi.markLatestRechargePaid();
    const after = cloudDeskApi.getCachedSnapshot();

    expect(order?.status).toBe("paid");
    expect(after.billing.balanceCredits).toBe(before.billing.balanceCredits + 50_000);
    expect(after.transactions[0]).toMatchObject({
      type: "credit",
      source: "recharge_order",
      amountCredits: 50_000,
      balanceAfterCredits: before.billing.balanceCredits + 50_000,
      description: "Mock 充值订单已支付",
    });
  });

  it("updates Relay test result and API key lifecycle", async () => {
    const { cloudDeskApi } = await loadFreshCloudDeskApi();

    const relayTest = await cloudDeskApi.testRelay();
    expect(relayTest.status).toBe("ok");
    expect(relayTest.message).toContain("Mock 连接成功");

    const created = await cloudDeskApi.createRelayApiKey();
    expect(created.apiKeyStatus).toBe("active");
    expect(created.apiKeyId).toMatch(/^rak_mock_/);
    expect(created.apiKeyMasked).toMatch(/^cd-relay-\*\*\*\*/);

    const revoked = await cloudDeskApi.revokeRelayApiKey();
    expect(revoked.apiKeyStatus).toBe("revoked");

    const reset = await cloudDeskApi.resetRelayApiKey();
    expect(reset.apiKeyStatus).toBe("active");
    expect(reset.apiKeyId).toMatch(/^rak_mock_/);
  });

  it("creates and accepts invites", async () => {
    const { cloudDeskApi } = await loadFreshCloudDeskApi();
    const before = cloudDeskApi.getCachedSnapshot().invites.length;

    const invite = await cloudDeskApi.createInvite();
    expect(invite.status).toBe("pending");
    expect(cloudDeskApi.getCachedSnapshot().invites).toHaveLength(before + 1);

    await cloudDeskApi.acceptInvite();
    expect(cloudDeskApi.getCachedSnapshot().invites[0]?.status).toBe("accepted");
  });

  it("syncs local usage mismatches into matched reconciliation rows", async () => {
    const { cloudDeskApi } = await loadFreshCloudDeskApi();

    expect(
      cloudDeskApi.getCachedSnapshot().reconciliation.some((row) => row.status === "mismatch"),
    ).toBe(true);

    const rows = await cloudDeskApi.syncLocalUsage();
    expect(rows.some((row) => row.status === "mismatch")).toBe(false);
    expect(rows.find((row) => row.reconciliationId === "rec_002")?.difference).toEqual({
      tokenDiff: 0,
      costDiffCredits: 0,
    });
  });

  it("persists Cloud Desk settings locally with normalization and reset", async () => {
    const { cloudDeskApi, DEFAULT_CLOUD_DESK_SETTINGS } = await loadFreshCloudDeskApi();

    expect(cloudDeskApi.getSettings()).toEqual(DEFAULT_CLOUD_DESK_SETTINGS);

    const saved = cloudDeskApi.saveSettings({
      enabled: false,
      mockMode: false,
      apiBaseUrl: " https://api.example.test/v1 ",
      relayEndpoint: " https://relay.example.test/v1 ",
    });
    expect(saved).toEqual({
      enabled: false,
      mockMode: false,
      apiBaseUrl: "https://api.example.test/v1",
      relayEndpoint: "https://relay.example.test/v1",
    });
    expect(cloudDeskApi.getSettings()).toEqual(saved);

    expect(cloudDeskApi.resetSettings()).toEqual(DEFAULT_CLOUD_DESK_SETTINGS);
    expect(cloudDeskApi.getSettings()).toEqual(DEFAULT_CLOUD_DESK_SETTINGS);
  });
});
